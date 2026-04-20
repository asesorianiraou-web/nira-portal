'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Expediente = {
  cliente_id: string
  caso_id: string
  nombre: string
  apellidos: string
  numero_expediente: string | null
  codigo_caso: string | null
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
  const [copiado, setCopiado] = useState('')

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
      setCopiado('')

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

  const copiarTexto = async (texto: string, etiqueta: string) => {
    try {
      await navigator.clipboard.writeText(texto)
      setCopiado(`${etiqueta} copiado.`)
      setTimeout(() => setCopiado(''), 2500)
    } catch (e) {
      console.error(e)
      setCopiado('No se pudo copiar.')
      setTimeout(() => setCopiado(''), 2500)
    }
  }

  const cerrarSesion = () => {
    localStorage.removeItem('nira_portal_cliente')
    router.push('/')
  }

  const numeroExpediente = expediente?.numero_expediente?.trim() || 'Pendiente de asignar'
  const codigoCaso = expediente?.codigo_caso?.trim() || 'Pendiente de asignar'

  return (
    <>
      <main className="page">
        <div className="wrap">
          <section className="card">
            <h1 className="title">Tu expediente</h1>

            {expediente ? (
              <>
                <div className="badgesGrid">
                  <div className="badgeCard">
                    <div className="badgeLabel">Nº de expediente</div>
                    <div className="badgeValue">{numeroExpediente}</div>
                    <button
                      className="miniButton"
                      onClick={() => copiarTexto(numeroExpediente, 'Número de expediente')}
                      type="button"
                    >
                      Copiar
                    </button>
                  </div>

                  <div className="badgeCard">
                    <div className="badgeLabel">Código del caso</div>
                    <div className="badgeValue">{codigoCaso}</div>
                    <button
                      className="miniButton"
                      onClick={() => copiarTexto(codigoCaso, 'Código del caso')}
                      type="button"
                    >
                      Copiar
                    </button>
                  </div>
                </div>

                <p className="noticeText">
                  Que tu derecho no dependa de tu bolsillo.
                </p>

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
              </>
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
                {subiendo ? 'Subiendo...' : 'Subir desde archivos'}
                <input
                  type="file"
                  accept="image/*,video/*,audio/*,.pdf,.docx"
                  style={{ display: 'none' }}
                  disabled={subiendo}
                  onChange={(e) => {
                    subirArchivo(e.target.files?.[0] || null)
                    e.currentTarget.value = ''
                  }}
                />
              </label>

              <label className="secondaryButton">
                {subiendo ? 'Subiendo...' : 'Tomar foto con cámara'}
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  style={{ display: 'none' }}
                  disabled={subiendo}
                  onChange={(e) => {
                    subirArchivo(e.target.files?.[0] || null)
                    e.currentTarget.value = ''
                  }}
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
          {copiado ? <div className="message">{copiado}</div> : null}
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

        .badgesGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 14px;
        }

        .badgeCard {
          background: #080808;
          border: 1px solid #171717;
          border-radius: 18px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .badgeLabel {
          color: #8e8e93;
          font-size: 12px;
        }

        .badgeValue {
          font-size: 20px;
          font-weight: 700;
          word-break: break-word;
        }

        .miniButton {
          align-self: flex-start;
          background: #111;
          color: white;
          border: 1px solid #262626;
          border-radius: 12px;
          padding: 10px 14px;
          cursor: pointer;
          font: inherit;
        }

        .noticeText {
          font-family: 'Times New Roman', serif;
          font-size: clamp(22px, 3.5vw, 34px);
          line-height: 1.2;
          margin: 0 0 18px 0;
          color: white;
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

        .primaryButton,
        .secondaryButton {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 14px 18px;
          border-radius: 14px;
          font-weight: 700;
          cursor: pointer;
          width: fit-content;
          min-height: 50px;
          box-sizing: border-box;
        }

        .primaryButton {
          background: white;
          color: black;
        }

        .secondaryButton {
          background: #111;
          color: white;
          border: 1px solid #262626;
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

          .badgesGrid {
            grid-template-columns: 1fr;
          }

          .actions {
            flex-direction: column;
          }

          .actions > * {
            width: 100%;
          }

          .primaryButton,
          .secondaryButton {
            width: 100%;
          }

          .miniButton {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </>
  )
}
