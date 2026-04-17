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
    <main
      style={{
        minHeight: '100vh',
        background: '#050505',
        color: 'white',
        padding: '32px 20px',
      }}
    >
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div
          style={{
            background: '#0B0B0B',
            border: '1px solid #171717',
            borderRadius: '24px',
            padding: '24px',
          }}
        >
          <h1
            style={{
              marginTop: 0,
              fontFamily: 'TimesCustom, serif',
              fontSize: '42px',
            }}
          >
            Tu expediente
          </h1>

          {expediente ? (
            <>
              <p><strong>Título:</strong> {expediente.expediente_titulo}</p>
              <p><strong>Estado:</strong> {expediente.expediente_estado}</p>
              <p><strong>Descripción:</strong> {expediente.expediente_descripcion || 'Sin descripción.'}</p>
              <p>
                <strong>Última modificación:</strong>{' '}
                {new Date(expediente.expediente_ultima_modificacion).toLocaleString('es-ES')}
              </p>
            </>
          ) : (
            <p>Cargando expediente...</p>
          )}
        </div>

        <div
          style={{
            background: '#0B0B0B',
            border: '1px solid #171717',
            borderRadius: '24px',
            padding: '24px',
          }}
        >
          <h2
            style={{
              fontFamily: 'TimesCustom, serif',
              fontSize: '30px',
              marginTop: 0,
            }}
          >
            Subir archivo
          </h2>

          <p style={{ color: '#B0B0B0' }}>
            Puedes subir foto, vídeo, audio, PDF o DOCX.
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              marginTop: '18px',
            }}
          >
            <label
              style={{
                display: 'inline-block',
                background: 'white',
                color: 'black',
                padding: '14px 18px',
                borderRadius: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                width: 'fit-content',
              }}
            >
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
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <a
            href="https://wa.me/34684741648"
            target="_blank"
            rel="noreferrer"
            style={{
              background: '#111',
              color: 'white',
              border: '1px solid #262626',
              borderRadius: '14px',
              padding: '14px 18px',
            }}
          >
            Contactar por WhatsApp
          </a>

          <button
            onClick={cerrarSesion}
            style={{
              background: '#111',
              color: 'white',
              border: '1px solid #262626',
              borderRadius: '14px',
              padding: '14px 18px',
              cursor: 'pointer',
            }}
          >
            Cerrar sesión
          </button>
        </div>

        {mensaje ? (
          <div style={{ color: '#D6C29A' }}>{mensaje}</div>
        ) : null}
      </div>
    </main>
  )
}
