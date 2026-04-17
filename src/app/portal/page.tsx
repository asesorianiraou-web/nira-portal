'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Expediente = {
  cliente_id: string
  caso_id: string
  nombre: string
  apellidos: string
  expediente_titulo: string
  expediente_estado: string
  expediente_descripcion: string | null
  expediente_ultima_modificacion: string
}

export default function PortalPage() {
  const router = useRouter()
  const [expediente, setExpediente] = useState<Expediente | null>(null)
  const [mensaje, setMensaje] = useState('')
  const [subiendo, setSubiendo] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem('nira_portal_cliente')

    if (!raw) {
      router.push('/')
      return
    }

    const sesion = JSON.parse(raw)
    cargarExpediente(sesion.caso_id)
  }, [router])

  const cargarExpediente = async (casoId: string) => {
    const { data, error } = await supabase
      .from('vw_portal_cliente_resumen')
      .select('*')
      .eq('caso_id', casoId)
      .single()

    if (error || !data) {
      console.error(error)
      setMensaje('No se pudo cargar el expediente.')
      return
    }

    setExpediente(data)
  }

  const subirArchivo = async (file: File | null) => {
    if (!file || !expediente) return

    try {
      setSubiendo(true)
      setMensaje('')

      const nombreSeguro = `${Date.now()}_${file.name}`
      const ruta = `${expediente.caso_id}/${nombreSeguro}`

      const { error: uploadError } = await supabase.storage
        .from('archivos-casos')
        .upload(ruta, file)

      if (uploadError) {
        console.error(uploadError)
        setMensaje('No se pudo subir el archivo.')
        return
      }

      const extension = file.name.includes('.')
        ? '.' + file.name.split('.').pop()
        : null

      const { error: insertError } = await supabase
        .from('archivos')
        .insert({
          caso_id: expediente.caso_id,
          nombre: file.name,
          tipo_archivo: extension,
          storage_path: ruta,
          is_deleted: false,
          origen: 'portal_cliente',
          subido_por_cliente_id: expediente.cliente_id,
        })

      if (insertError) {
        console.error(insertError)
        setMensaje('El archivo subió, pero no se pudo registrar en la base de datos.')
        return
      }

      setMensaje('Archivo subido correctamente.')
    } catch (e) {
      console.error(e)
      setMensaje('Ha ocurrido un error al subir el archivo.')
    } finally {
      setSubiendo(false)
    }
  }

  const cerrarSesion = () => {
    localStorage.removeItem('nira_portal_cliente')
    router.push('/')
  }

  return (
    <>
      <main className="page">
        <div className="wrap">
          <section className="card">
            <h1 className="title">Tu expediente</h1>

            {expediente ? (
              <div className="expedienteInfo">
                <p>
                  <strong>Título:</strong> {expediente.expediente_titulo}
                </p>
                <p>
                  <strong>Estado:</strong> {expediente.expediente_estado}
                </p>
                <p>
                  <strong>Descripción:</strong>{' '}
                  {expediente.expediente_descripcion || 'Sin descripción.'}
                </p>
                <p>
                  <strong>Última modificación:</strong>{' '}
                  {new Date(expediente.expediente_ultima_modificacion).toLocaleString('es-ES')}
                </p>
              </div>
            ) : (
              <p className="muted">Cargando expediente...</p>
            )}
          </section>

          <section className="card">
            <h2 className="subtitle">Subir archivo</h2>

            <p className="muted">
              Puedes subir foto, vídeo, audio, PDF o DOCX.
            </p>

            <div className="uploadBox">
              <label className="primaryButton">
                {subiendo ? 'Subiendo...' : 'Tomar foto o subir archivo'}
                <input
                  type="file"
                  accept="image/*,video/*,audio/*,.pdf,.docx"
                  capture="environment"
                  style={{ display: 'none' }}
                  onChange={(e) => subirArchivo(e.target.files?.[0] || null)}
                />
              </label>
            </div>
          </section>

          <section className="actions">
            <a
              href="https://wa.me/34684741648"
              target="_blank"
              rel="noreferrer"
              className="ghostButton"
            >
              Contactar por WhatsApp
            </a>

            <button onClick={cerrarSesion} className="ghostButton buttonReset">
              Cerrar sesión
            </button>
          </section>

          {mensaje ? <div className="message">{mensaje}</div> : null}
        </div>
      </main>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #050505;
          color: white;
          padding: 24px 16px 40px;
        }

        .wrap {
          width: 100%;
          max-width: 940px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .card {
          background: #0b0b0b;
          border: 1px solid #171717;
          border-radius: 24px;
          padding: 24px;
        }

        .title {
          margin-top: 0;
          margin-bottom: 16px;
          font-family: 'Times New Roman', serif;
          font-size: clamp(34px, 5vw, 52px);
        }

        .subtitle {
          margin-top: 0;
          margin-bottom: 12px;
          font-family: 'Times New Roman', serif;
          font-size: clamp(26px, 4vw, 34px);
        }

        .expedienteInfo {
          display: flex;
          flex-direction: column;
          gap: 10px;
          line-height: 1.7;
          word-break: break-word;
        }

        .expedienteInfo p {
          margin: 0;
        }

        .muted {
          color: #b0b0b0;
          line-height: 1.6;
          margin: 0;
        }

        .uploadBox {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-top: 18px;
        }

        .primaryButton {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: white;
          color: black;
          padding: 14px 18px;
          border-radius: 14px;
          font-weight: 700;
          cursor: pointer;
          width: fit-content;
          min-height: 50px;
          box-sizing: border-box;
        }

        .actions {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .ghostButton {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #111;
          color: white;
          border: 1px solid #262626;
          border-radius: 14px;
          padding: 14px 18px;
          text-decoration: none;
          min-height: 50px;
          box-sizing: border-box;
        }

        .buttonReset {
          cursor: pointer;
          font: inherit;
        }

        .message {
          color: #d6c29a;
          line-height: 1.5;
          word-break: break-word;
        }

        @media (max-width: 640px) {
          .page {
            padding: 16px 12px 28px;
          }

          .card {
            padding: 18px;
            border-radius: 20px;
          }

          .actions {
            flex-direction: column;
          }

          .actions > * {
            width: 100%;
          }

          .primaryButton {
            width: 100%;
          }
        }
      `}</style>
    </>
  )
}
