'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import { supabase } from '@/lib/supabase'

type PortalAccesoResult = {
  cliente_id?: string
  caso_id?: string
  codigo?: string
  nombre?: string
  apellidos?: string
}

export default function HomePage() {
  const router = useRouter()

  const [codigo, setCodigo] = useState('')
  const [nombre, setNombre] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [loading, setLoading] = useState(false)

  const entrarPortal = async (e: FormEvent) => {
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
        setMensaje('No se pudo validar el acceso.')
        return
      }

      const acceso = Array.isArray(data) ? data[0] : data

      if (!acceso) {
        setMensaje('Código o datos incorrectos.')
        return
      }

      localStorage.setItem(
        'nira_portal_cliente',
        JSON.stringify(acceso as PortalAccesoResult)
      )

      router.push('/portal')
    } catch (err) {
      console.error(err)
      setMensaje('Ha ocurrido un error al entrar al portal.')
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
      <div
        style={{
          width: '100%',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '14px 14px 48px',
          boxSizing: 'border-box',
        }}
      >
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '14px',
            flexWrap: 'wrap',
            marginBottom: '16px',
            padding: '2px 0 8px',
          }}
        >
          <Link
            href="/"
            style={{
              textDecoration: 'none',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <Image
              src="/images/nira_logo.png"
              alt="NIRA LEGAL GROUP"
              width={46}
              height={46}
              style={{ objectFit: 'contain' }}
            />
            <div>
              <div
                style={{
                  fontFamily: "'Times New Roman', serif",
                  fontSize: 'clamp(24px, 4vw, 30px)',
                  lineHeight: 1,
                }}
              >
                NIRA LEGAL GROUP
              </div>
              <div
                style={{
                  color: '#B7B7B7',
                  fontSize: '12px',
                  marginTop: '3px',
                }}
              >
                Asesoría y defensa jurídica
              </div>
            </div>
          </Link>

          <div
            style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
            }}
          >
            <a
              href="https://wa.me/34684741648"
              target="_blank"
              rel="noreferrer"
              style={ghostButton}
            >
              WhatsApp
            </a>

            <a
              href="https://www.instagram.com/niralegalgroup/"
              target="_blank"
              rel="noreferrer"
              style={ghostButton}
            >
              Instagram
            </a>

            <Link href="/publicaciones" style={ghostButton}>
              Publicaciones
            </Link>
          </div>
        </header>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '16px',
            marginBottom: '16px',
            background: '#0B0B0B',
            border: '1px solid #171717',
            borderRadius: '28px',
            padding: '20px',
          }}
        >
          <div>
            <div
              style={{
                color: '#D6C29A',
                fontSize: '12px',
                letterSpacing: '1.3px',
                marginBottom: '10px',
              }}
            >
              DESPACHO JURÍDICO • EXTRANJERÍA • LABORAL • PORTAL CLIENTE
            </div>

            <h1
              style={{
                margin: 0,
                fontFamily: "'Times New Roman', serif",
                fontSize: 'clamp(36px, 7vw, 74px)',
                lineHeight: '0.95',
              }}
            >
              Defensa jurídica clara,
              <br />
              cercana y seria
            </h1>

            <p
              style={{
                margin: '18px 0 0 0',
                color: '#E0E0E0',
                lineHeight: '1.9',
                fontSize: '16px',
                maxWidth: '760px',
              }}
            >
              En <strong>NIRA LEGAL GROUP</strong> ayudamos a ordenar el problema,
              explicar el camino y acompañarte durante todo el expediente.
              Trabajamos especialmente asuntos de <strong>extranjería</strong>,
              <strong> laboral</strong>, <strong>civil</strong>, <strong>consumo</strong> y
              <strong> renta</strong>, con una forma de trabajar directa y útil.
            </p>

            <div
              style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
                marginTop: '18px',
              }}
            >
              <a href="#acceso" style={primaryButton}>
                Acceso cliente
              </a>

              <a href="#areas" style={ghostButton}>
                Áreas que llevamos
              </a>

              <Link href="/publicaciones" style={ghostButton}>
                Ver publicaciones
              </Link>
            </div>
          </div>

          <div
            id="acceso"
            style={{
              background: '#050505',
              border: '1px solid #171717',
              borderRadius: '24px',
              padding: '20px',
              alignSelf: 'start',
            }}
          >
            <h2
              style={{
                margin: 0,
                fontFamily: "'Times New Roman', serif",
                fontSize: 'clamp(28px, 5vw, 38px)',
                lineHeight: 1,
              }}
            >
              Acceso cliente
            </h2>

            <p
              style={{
                margin: '14px 0 0 0',
                color: '#D2D2D2',
                lineHeight: '1.8',
                fontSize: '14px',
              }}
            >
              Entra con el código que te dio el despacho, junto con tu nombre y
              apellidos.
            </p>

            <form
              onSubmit={entrarPortal}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                marginTop: '16px',
              }}
            >
              <input
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Código"
                style={inputStyle}
              />

              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre"
                style={inputStyle}
              />

              <input
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                placeholder="Apellidos"
                style={inputStyle}
              />

              <button type="submit" disabled={loading} style={submitButton}>
                {loading ? 'Entrando...' : 'Entrar al portal'}
              </button>
            </form>

            {mensaje ? (
              <div
                style={{
                  marginTop: '12px',
                  color: '#D6C29A',
                  lineHeight: '1.7',
                  fontSize: '14px',
                }}
              >
                {mensaje}
              </div>
            ) : null}
          </div>
        </section>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '14px',
            marginBottom: '18px',
          }}
        >
          <InfoCard
            titulo="Quiénes somos"
            texto="Somos un despacho que busca explicar bien, actuar con estrategia y no vender humo. La idea es sencilla: que tu derecho no dependa de tu bolsillo."
          />
          <InfoCard
            titulo="Cómo trabajamos"
            texto="Ordenamos el expediente, pedimos lo necesario, resolvemos dudas y mantenemos un seguimiento claro. Si ya eres cliente, puedes usar el portal para enviar documentación y seguir tu caso."
          />
          <InfoCard
            titulo="Portal cliente"
            texto="Tu expediente, tus documentos y tu acceso privado en un solo sitio. Útil para subir papeles, revisar datos y mantener el caso más ordenado."
          />
        </section>

        <section
          style={{
            background: '#0B0B0B',
            border: '1px solid #171717',
            borderRadius: '24px',
            padding: '20px',
            marginBottom: '18px',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: "'Times New Roman', serif",
              fontSize: 'clamp(34px, 5.5vw, 62px)',
              lineHeight: '0.98',
            }}
          >
            Extranjería sin tecnicismos y con estrategia
          </h2>

          <p style={paragraph}>
            En nuestra comunicación diaria tratamos temas de <strong>extranjería</strong>
            como <strong>arraigo social</strong>, <strong>arraigo sociolaboral</strong>,
            <strong> arraigo familiar</strong>, <strong>nacionalidad española</strong>,
            <strong> regularización</strong>, <strong>residencia</strong>,
            <strong> autorización de trabajo</strong>, <strong>residencia temporal</strong>,
            <strong> renovación de papeles</strong> y situaciones reales que muchas
            personas viven cuando no saben por dónde empezar.
          </p>

          <p style={paragraph}>
            También explicamos asuntos como <strong>requisitos reales del arraigo 2026</strong>,
            <strong> expediente de extranjería</strong>, <strong>resolución favorable</strong>,
            <strong> denegaciones</strong>, <strong>cómo preparar documentación</strong>,
            <strong> errores frecuentes en regularización</strong> y formas de enfocar
            cada caso sin promesas vacías.
          </p>

          <p style={{ ...paragraph, marginBottom: 0 }}>
            La idea es que cuando alguien busque información sobre
            <strong> nacionalidad</strong>, <strong>arraigo</strong>,
            <strong> regularización</strong>, <strong>residencia</strong>,
            <strong> extranjería en España</strong> o <strong>ayuda para papeles</strong>,
            encuentre una página clara, seria y conectada con un despacho real.
          </p>
        </section>

        <section id="areas" style={{ marginBottom: '18px' }}>
          <h2 style={sectionTitle}>Áreas que llevamos</h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
              gap: '12px',
            }}
          >
            <AreaCard
              titulo="Extranjería"
              texto="Arraigos, nacionalidad, regularización, residencia, trabajo y seguimiento de expedientes."
            />
            <AreaCard
              titulo="Laboral"
              texto="Despidos, finiquitos, indemnizaciones, bajas, horas extra y reclamaciones salariales."
            />
            <AreaCard
              titulo="Civil"
              texto="Reclamaciones, contratos y acompañamiento jurídico en problemas reales del día a día."
            />
            <AreaCard
              titulo="Consumo"
              texto="Micropréstamos, intereses abusivos, tarjetas, bancos y defensa ante empresas que se pasan."
            />
            <AreaCard
              titulo="Renta"
              texto="Ayudamos con borradores de IRPF, revisión, dudas y errores que te pueden costar dinero."
            />
            <AreaCard
              titulo="Orientación jurídica"
              texto="Cuando no sabes ni por dónde empezar, te explicamos con claridad qué camino tiene sentido."
            />
          </div>
        </section>

        <section
          style={{
            background: '#0B0B0B',
            border: '1px solid #171717',
            borderRadius: '24px',
            padding: '20px',
            marginBottom: '18px',
          }}
        >
          <h2 style={sectionTitle}>Contenido útil sobre casos reales</h2>

          <p style={{ ...paragraph, marginTop: 0 }}>
            Aquí irán noticias, análisis de sentencias y piezas reales del despacho.
            Imágenes, resoluciones, vídeos cortos, contenido explicativo, descargas de
            PDF y material útil para que una persona entienda el asunto sin humo.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              marginTop: '14px',
            }}
          >
            <Link href="/publicaciones" style={primaryButton}>
              Entrar en publicaciones
            </Link>

            <a
              href="https://wa.me/34684741648"
              target="_blank"
              rel="noreferrer"
              style={ghostButton}
            >
              Consultar por WhatsApp
            </a>
          </div>
        </section>

        <section style={{ marginBottom: '18px' }}>
          <h2 style={sectionTitle}>Qué puedes hacer aquí</h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px',
            }}
          >
            <MiniCard
              titulo="Consultar"
              texto="Entrar en el portal con tu acceso privado."
            />
            <MiniCard
              titulo="Contactar"
              texto="Escribir por WhatsApp y recibir una orientación inicial clara."
            />
            <MiniCard
              titulo="Acceder"
              texto="Entrar al portal, revisar el caso y leer contenido útil."
            />
            <MiniCard
              titulo="Enviar"
              texto="Subir documentación y mantener el caso más ordenado."
            />
          </div>
        </section>

        <section style={{ marginBottom: '18px' }}>
          <h2 style={sectionTitle}>Preguntas frecuentes</h2>

          <FaqItem
            pregunta="¿Qué es NIRA LEGAL GROUP?"
            respuesta="Un despacho jurídico con enfoque claro, cercano y útil. Trabajamos con estrategia, orden y seguimiento real del caso."
          />
          <FaqItem
            pregunta="¿Cómo entro en mi expediente?"
            respuesta="Con el código que te da el despacho y tus datos. Desde esta misma portada puedes entrar al portal cliente."
          />
          <FaqItem
            pregunta="¿Qué tipo de casos de extranjería tratáis?"
            respuesta="Arraigos, regularización, nacionalidad, renovaciones, residencia y trámites relacionados con trabajo y documentación."
          />
          <FaqItem
            pregunta="¿Puedo enviar documentación por internet?"
            respuesta="Sí. El portal cliente está pensado precisamente para eso: subir archivos, mantener orden y evitar perder papeles."
          />
          <FaqItem
            pregunta="¿También trabajáis laboral, civil o consumo?"
            respuesta="Sí. Además de extranjería, trabajamos laboral, civil, consumo y cuestiones prácticas como renta u orientación jurídica."
          />
        </section>

        <section
          style={{
            background: '#0B0B0B',
            border: '1px solid #171717',
            borderRadius: '24px',
            padding: '22px',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: "'Times New Roman', serif",
              fontSize: 'clamp(30px, 5vw, 54px)',
              lineHeight: 1,
            }}
          >
            Tu derecho no debería depender del bolsillo de nadie
          </h2>

          <p
            style={{
              margin: '12px 0 0 0',
              color: '#E0E0E0',
              lineHeight: '1.8',
              fontSize: '15px',
              maxWidth: '900px',
            }}
          >
            Si necesitas una primera orientación, si tienes dudas sobre un expediente o si ya eres cliente y quieres acceder al portal, aquí tienes una puerta clara para empezar.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              marginTop: '16px',
            }}
          >
            <a
              href="https://wa.me/34684741648"
              target="_blank"
              rel="noreferrer"
              style={primaryButton}
            >
              Hablar por WhatsApp
            </a>

            <Link href="/publicaciones" style={ghostButton}>
              Ver publicaciones
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}

function InfoCard({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div
      style={{
        background: '#0B0B0B',
        border: '1px solid #171717',
        borderRadius: '20px',
        padding: '18px',
      }}
    >
      <h3
        style={{
          margin: 0,
          fontFamily: "'Times New Roman', serif",
          fontSize: 'clamp(24px, 4vw, 30px)',
          lineHeight: 1,
        }}
      >
        {titulo}
      </h3>

      <p
        style={{
          margin: '12px 0 0 0',
          color: '#D5D5D5',
          lineHeight: '1.8',
          fontSize: '14px',
        }}
      >
        {texto}
      </p>
    </div>
  )
}

function AreaCard({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div
      style={{
        background: '#0B0B0B',
        border: '1px solid #171717',
        borderRadius: '18px',
        padding: '16px',
      }}
    >
      <h3
        style={{
          margin: 0,
          fontFamily: "'Times New Roman', serif",
          fontSize: '28px',
          lineHeight: 1,
        }}
      >
        {titulo}
      </h3>

      <p
        style={{
          margin: '10px 0 0 0',
          color: '#D0D0D0',
          lineHeight: '1.8',
          fontSize: '14px',
        }}
      >
        {texto}
      </p>
    </div>
  )
}

function MiniCard({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div
      style={{
        background: '#0B0B0B',
        border: '1px solid #171717',
        borderRadius: '18px',
        padding: '16px',
      }}
    >
      <div
        style={{
          color: '#D6C29A',
          fontSize: '11px',
          letterSpacing: '1.1px',
          marginBottom: '8px',
        }}
      >
        •
      </div>

      <h3
        style={{
          margin: 0,
          fontFamily: "'Times New Roman', serif",
          fontSize: '26px',
          lineHeight: 1,
        }}
      >
        {titulo}
      </h3>

      <p
        style={{
          margin: '10px 0 0 0',
          color: '#D0D0D0',
          lineHeight: '1.8',
          fontSize: '14px',
        }}
      >
        {texto}
      </p>
    </div>
  )
}

function FaqItem({ pregunta, respuesta }: { pregunta: string; respuesta: string }) {
  return (
    <details
      style={{
        background: '#0B0B0B',
        border: '1px solid #171717',
        borderRadius: '16px',
        padding: '14px 16px',
        marginBottom: '10px',
      }}
    >
      <summary
        style={{
          cursor: 'pointer',
          fontWeight: 700,
          color: 'white',
          listStyle: 'none',
        }}
      >
        {pregunta}
      </summary>

      <p
        style={{
          margin: '12px 0 0 0',
          color: '#D0D0D0',
          lineHeight: '1.8',
          fontSize: '14px',
        }}
      >
        {respuesta}
      </p>
    </details>
  )
}

const paragraph: React.CSSProperties = {
  margin: '16px 0',
  color: '#E0E0E0',
  lineHeight: '1.9',
  fontSize: '15px',
}

const sectionTitle: React.CSSProperties = {
  margin: '0 0 12px 0',
  fontFamily: "'Times New Roman', serif",
  fontSize: 'clamp(34px, 5vw, 56px)',
  lineHeight: 1,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  background: '#080808',
  border: '1px solid #262626',
  borderRadius: '14px',
  padding: '14px 16px',
  color: 'white',
  outline: 'none',
}

const submitButton: React.CSSProperties = {
  background: 'white',
  color: 'black',
  borderRadius: '14px',
  padding: '14px 18px',
  fontWeight: 700,
  border: 'none',
  cursor: 'pointer',
  marginTop: '4px',
}

const ghostButton: React.CSSProperties = {
  background: '#111',
  color: 'white',
  border: '1px solid #262626',
  borderRadius: '14px',
  padding: '14px 18px',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const primaryButton: React.CSSProperties = {
  background: 'white',
  color: 'black',
  borderRadius: '14px',
  padding: '14px 18px',
  fontWeight: 700,
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
}
