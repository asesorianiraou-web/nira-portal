'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function HomePage() {
  const router = useRouter()

  const [codigo, setCodigo] = useState('')
  const [nombre, setNombre] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [loading, setLoading] = useState(false)

  async function entrarPortal(e: React.FormEvent) {
    e.preventDefault()
    setMensaje('')

    if (!codigo.trim() || !nombre.trim() || !apellidos.trim()) {
      setMensaje('Completa código, nombre y apellidos.')
      return
    }

    try {
      setLoading(true)

      const { data, error } = await supabase.rpc('portal_validar_acceso', {
        p_codigo: codigo.trim(),
        p_nombre: nombre.trim(),
        p_apellidos: apellidos.trim(),
      })

      if (error) {
        console.error(error)
        setMensaje('No se pudo comprobar el acceso.')
        return
      }

      const acceso = Array.isArray(data) ? data[0] : data

      if (!acceso) {
        setMensaje('Código o datos incorrectos.')
        return
      }

      localStorage.setItem(
        'nira_portal_cliente',
        JSON.stringify({
          portal_id: acceso.portal_id,
          cliente_id: acceso.cliente_id,
          caso_id: acceso.caso_id,
        })
      )

      router.push('/portal')
    } catch (e) {
      console.error(e)
      setMensaje('Se produjo un error al entrar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#050505',
        color: 'white',
      }}
    >
      <section
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '32px 24px 20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
            flexWrap: 'wrap',
            marginBottom: 28,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Image
              src="/images/nira_logo.png"
              alt="NIRA Legal Group"
              width={60}
              height={60}
              style={{ objectFit: 'contain' }}
            />
            <div>
              <div
                style={{
                  fontFamily: 'TimesCustom, serif',
                  fontSize: 28,
                  lineHeight: 1.1,
                }}
              >
                NIRA LEGAL GROUP
              </div>
              <div style={{ color: '#B0B0B0', fontSize: 14 }}>
                Asesoría y defensa jurídica
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a
              href="https://wa.me/34684741648"
              target="_blank"
              rel="noreferrer"
              style={{
                background: '#111',
                color: 'white',
                border: '1px solid #262626',
                borderRadius: 14,
                padding: '12px 16px',
              }}
            >
              WhatsApp
            </a>

            <a
              href="https://www.instagram.com/niralegalgroup"
              target="_blank"
              rel="noreferrer"
              style={{
                background: '#111',
                color: 'white',
                border: '1px solid #262626',
                borderRadius: 14,
                padding: '12px 16px',
              }}
            >
              Instagram
            </a>
          </div>
        </div>

        <div
          style={{
            background: '#0B0B0B',
            border: '1px solid #171717',
            borderRadius: 28,
            padding: '32px 24px',
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: 24,
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontFamily: 'TimesCustom, serif',
                fontSize: 54,
                lineHeight: 1.05,
              }}
            >
              Defensa jurídica clara, cercana y seria
            </h1>

            <p
              style={{
                color: '#B0B0B0',
                fontSize: 18,
                lineHeight: 1.6,
                marginTop: 18,
                maxWidth: 700,
              }}
            >
              En NIRA Legal Group ayudamos a ordenar el problema, explicar el
              camino y acompañarte durante todo el expediente.
            </p>

            <div
              style={{
                display: 'flex',
                gap: 12,
                flexWrap: 'wrap',
                marginTop: 20,
              }}
            >
              <a
                href="#portal"
                style={{
                  background: 'white',
                  color: 'black',
                  borderRadius: 14,
                  padding: '14px 18px',
                  fontWeight: 'bold',
                }}
              >
                Acceso cliente
              </a>

              <a
                href="#areas"
                style={{
                  background: '#111',
                  color: 'white',
                  border: '1px solid #262626',
                  borderRadius: 14,
                  padding: '14px 18px',
                }}
              >
                Áreas que llevamos
              </a>
            </div>
          </div>

          <div
            style={{
              background: '#080808',
              border: '1px solid #171717',
              borderRadius: 24,
              padding: 22,
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: 10,
                fontFamily: 'TimesCustom, serif',
                fontSize: 34,
              }}
            >
              Acceso cliente
            </h2>

            <p style={{ color: '#B0B0B0', marginTop: 0, lineHeight: 1.6 }}>
              Entra con el código que te dio el despacho, junto con tu nombre y
              apellidos.
            </p>

            <form
              id="portal"
              onSubmit={entrarPortal}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                marginTop: 18,
              }}
            >
              <input
                type="text"
                placeholder="Código"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                style={inputStyle}
              />

              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                style={inputStyle}
              />

              <input
                type="text"
                placeholder="Apellidos"
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                style={inputStyle}
              />

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: 'white',
                  color: 'black',
                  border: 'none',
                  borderRadius: 14,
                  padding: '14px 18px',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  marginTop: 4,
                }}
              >
                {loading ? 'Comprobando...' : 'Entrar al portal'}
              </button>
            </form>

            {mensaje ? (
              <div
                style={{
                  marginTop: 14,
                  color: '#D6C29A',
                  lineHeight: 1.5,
                }}
              >
                {mensaje}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '10px 24px 50px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
          }}
        >
          <div style={cardStyle}>
            <h3 style={cardTitleStyle}>Quiénes somos</h3>
            <p style={cardTextStyle}>
              Un despacho que busca explicar bien, actuar con estrategia y no
              vender humo.
            </p>
          </div>

          <div style={cardStyle}>
            <h3 style={cardTitleStyle}>Cómo trabajamos</h3>
            <p style={cardTextStyle}>
              Ordenamos el expediente, pedimos lo necesario y mantenemos un
              seguimiento claro.
            </p>
          </div>

          <div style={cardStyle}>
            <h3 style={cardTitleStyle}>Portal cliente</h3>
            <p style={cardTextStyle}>
              Consulta tu expediente y sube documentos desde cualquier
              dispositivo.
            </p>
          </div>
        </div>
      </section>

      <section
        id="areas"
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px 60px',
        }}
      >
        <h3
          style={{
            fontFamily: 'TimesCustom, serif',
            fontSize: 48,
            marginTop: 0,
            marginBottom: 22,
          }}
        >
          Áreas que llevamos
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
          }}
        >
          <div style={cardStyle}>
            <h4 style={smallTitleStyle}>Laboral</h4>
            <p style={cardTextStyle}>
              Despidos, reclamaciones y defensa del trabajador.
            </p>
          </div>

          <div style={cardStyle}>
            <h4 style={smallTitleStyle}>Extranjería</h4>
            <p style={cardTextStyle}>
              Regularización, solicitudes y expedientes.
            </p>
          </div>

          <div style={cardStyle}>
            <h4 style={smallTitleStyle}>Civil</h4>
            <p style={cardTextStyle}>
              Reclamaciones, conflictos y acompañamiento jurídico.
            </p>
          </div>

          <div style={cardStyle}>
            <h4 style={smallTitleStyle}>Consumo</h4>
            <p style={cardTextStyle}>
              Defensa frente a abusos y reclamaciones desproporcionadas.
            </p>
          </div>

          <div style={cardStyle}>
            <h4 style={smallTitleStyle}>Orientación jurídica</h4>
            <p style={cardTextStyle}>
              Guía clara cuando no sabes por dónde empezar.
            </p>
          </div>

          <div style={cardStyle}>
            <h4 style={smallTitleStyle}>Acompañamiento</h4>
            <p style={cardTextStyle}>
              Explicamos, escuchamos y ordenamos el camino.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#050505',
  color: 'white',
  border: '1px solid #262626',
  borderRadius: 14,
  padding: '14px 16px',
  outline: 'none',
}

const cardStyle: React.CSSProperties = {
  background: '#0B0B0B',
  border: '1px solid #171717',
  borderRadius: 24,
  padding: 22,
}

const cardTitleStyle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: 10,
  fontFamily: 'TimesCustom, serif',
  fontSize: 28,
}

const smallTitleStyle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: 10,
  fontFamily: 'TimesCustom, serif',
  fontSize: 24,
}

const cardTextStyle: React.CSSProperties = {
  margin: 0,
  color: '#B0B0B0',
  lineHeight: 1.6,
}
