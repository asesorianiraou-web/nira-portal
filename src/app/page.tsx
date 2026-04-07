'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type PortalResumen = {
  cliente_id: string
  caso_id: string
  nombre: string
  apellidos: string
  codigo_hint: string | null
  codigo_activo: boolean
}

function coincideConHint(codigoUsuario: string, hint: string | null) {
  if (!hint) return false

  const codigo = codigoUsuario.trim().toLowerCase()
  const pista = hint.trim().toLowerCase()

  if (!codigo || !pista) return false

  const partes = pista.split('*').filter(Boolean)

  if (partes.length === 0) return false
  if (partes.length === 1) return codigo === partes[0]

  const prefijo = partes[0]
  const sufijo = partes[partes.length - 1]

  return codigo.startsWith(prefijo) && codigo.endsWith(sufijo)
}

export default function Home() {
  const router = useRouter()

  const [codigo, setCodigo] = useState('')
  const [nombre, setNombre] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  const entrar = async () => {
    try {
      setCargando(true)
      setMensaje('')

      const codigoLimpio = codigo.trim()
      const nombreLimpio = nombre.trim()
      const apellidosLimpio = apellidos.trim()

      if (!codigoLimpio || !nombreLimpio || !apellidosLimpio) {
        setMensaje('Completa código, nombre y apellidos.')
        return
      }

      const { data, error } = await supabase
        .from('vw_portal_cliente_resumen')
        .select('cliente_id, caso_id, nombre, apellidos, codigo_hint, codigo_activo')
        .eq('codigo_activo', true)
        .ilike('nombre', nombreLimpio)
        .ilike('apellidos', apellidosLimpio)

      if (error) {
        console.error(error)
        setMensaje('No se pudo consultar el acceso del cliente.')
        return
      }

      const registros = (data ?? []) as PortalResumen[]

      if (registros.length === 0) {
        setMensaje('No se encontró ningún acceso con esos datos.')
        return
      }

      const acceso = registros.find((x) => coincideConHint(codigoLimpio, x.codigo_hint))

      if (!acceso) {
        setMensaje('Código o datos incorrectos.')
        return
      }

      localStorage.setItem(
        'nira_portal_cliente',
        JSON.stringify({
          cliente_id: acceso.cliente_id,
          caso_id: acceso.caso_id,
          nombre: acceso.nombre,
          apellidos: acceso.apellidos,
        })
      )

      router.push('/portal')
    } catch (e) {
      console.error(e)
      setMensaje('Ha ocurrido un error al iniciar sesión.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="page">
      <header className="topbar">
        <div className="container topbar-inner">
          <div className="brand">
            <Image
              src="/images/nira_logo.png"
              alt="NIRA Legal Group"
              width={58}
              height={58}
              className="brand-logo"
            />
            <div>
              <h1 className="brand-name">NIRA LEGAL GROUP</h1>
              <p className="brand-tagline">Justicia, ética y compromiso social</p>
            </div>
          </div>

          <div className="top-links">
            <a className="link-pill" href="#quienes-somos">
              Quiénes somos
            </a>

            <a className="link-pill" href="#areas">
              Áreas que llevamos
            </a>

            <a
              className="link-pill"
              href="https://www.instagram.com/niralegalgroup?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>

            <a
              className="cta-pill"
              href="https://wa.me/34684741648"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-card">
              <span className="eyebrow">Asesoría jurídica con vocación real</span>

              <h2 className="hero-title">
                La justicia no debería depender del bolsillo de nadie
              </h2>

              <p className="hero-subtitle">
                En Nira Legal Group trabajamos para acercar el derecho a quienes más lo necesitan.
              </p>

              <p className="hero-copy">
                Somos una asesoría comprometida con una idea sencilla pero firme:
                la justicia tiene que llegar a todas partes. Creemos en el trabajo serio,
                en la ética profesional y en el compromiso social. Por eso buscamos resultados,
                acompañamiento real y una atención humana para personas que muchas veces llegan
                con miedo, dudas o con la sensación de que pedir ayuda legal está fuera de su alcance.
              </p>

              <p className="hero-copy">
                Queremos romper esa barrera. Queremos construir un despacho en el que el motor
                no sea vender miedo, sino ofrecer orientación, defensa y dignidad. Esto no es un
                escaparate. Es el comienzo de un proyecto que aspira a convertir el acceso a la justicia
                en algo más cercano, más honesto y más útil.
              </p>

              <div className="hero-cta-row">
                <a
                  className="hero-main-btn"
                  href="https://wa.me/34684741648"
                  target="_blank"
                  rel="noreferrer"
                >
                  Hablar por WhatsApp
                </a>

                <a
                  className="hero-secondary-btn"
                  href="https://www.instagram.com/niralegalgroup?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                  target="_blank"
                  rel="noreferrer"
                >
                  Ver Instagram
                </a>
              </div>

              <div className="hero-points">
                <div className="point-box">
                  <h3 className="point-title">Justicia</h3>
                  <p className="point-text">
                    Defendemos el derecho como herramienta real para proteger a las personas.
                  </p>
                </div>

                <div className="point-box">
                  <h3 className="point-title">Ética</h3>
                  <p className="point-text">
                    Transparencia, claridad y trabajo honesto. Sin disfraces.
                  </p>
                </div>

                <div className="point-box">
                  <h3 className="point-title">Compromiso social</h3>
                  <p className="point-text">
                    Nuestro objetivo es acercarnos cada vez más a un modelo jurídico más accesible.
                  </p>
                </div>
              </div>
            </div>

            <aside className="login-card">
              <h2 className="login-title">Acceso clientes</h2>
              <p className="login-subtitle">Consulta tu expediente de forma segura</p>

              <div className="form-stack">
                <input
                  className="input"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  placeholder="Código"
                />

                <input
                  className="input"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Nombre"
                />

                <input
                  className="input"
                  value={apellidos}
                  onChange={(e) => setApellidos(e.target.value)}
                  placeholder="Apellidos"
                />

                <button onClick={entrar} className="login-btn">
                  {cargando ? 'Entrando...' : 'Entrar'}
                </button>
              </div>

              <p className="login-note">
                Este acceso está reservado para clientes con código activo facilitado por la Asesoria.
              </p>

              {mensaje ? <div className="message">{mensaje}</div> : null}
            </aside>
          </div>
        </section>

        <section className="section" id="quienes-somos">
          <div className="container">
            <div className="section-card">
              <h2 className="section-title">Quiénes somos</h2>
              <p className="section-text">
                Nira Legal Group nace con una vocación clara: que la justicia no se quede solo al alcance
                de unos pocos. Creemos que ninguna dificultad económica, personal o social debería impedir
                la defensa efectiva de un derecho. Por eso trabajamos con intensidad, con visión humana y con
                la idea de que escuchar, orientar y acompañar bien también forma parte de hacer justicia.
              </p>

              <div className="quote-box">
                <p>
                  “No queremos ser solo un despacho más. Queremos convertirnos en un equipo reconocido
                  por su ética, por su compromiso social y por su manera de defender a las personas.”
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="areas">
          <div className="container">
            <div className="section-card">
              <h2 className="section-title">Áreas que llevamos</h2>
              <p className="section-text">
                Trabajamos en materias donde muchas personas necesitan orientación clara, defensa firme
                y acompañamiento constante.
              </p>

              <div className="practice-grid">
                <div className="practice-item">
                  <h3>Laboral</h3>
                  <p>Despidos, reclamaciones, conflictos laborales y defensa de derechos del trabajador.</p>
                </div>

                <div className="practice-item">
                  <h3>Extranjería</h3>
                  <p>Solicitudes, regularización, procedimientos y seguimiento de expedientes.</p>
                </div>

                <div className="practice-item">
                  <h3>Micropréstamos</h3>
                  <p>Orientación y defensa frente a situaciones abusivas o reclamaciones desproporcionadas.</p>
                </div>

                <div className="practice-item">
                  <h3>Orientación jurídica</h3>
                  <p>Cuando no sabes por dónde empezar, tener una guía clara ya cambia el escenario.</p>
                </div>

                <div className="practice-item">
                  <h3>Acompañamiento</h3>
                  <p>No solo tramitamos. También explicamos, escuchamos y ordenamos el camino contigo.</p>
                </div>

                <div className="practice-item">
                  <h3>Compromiso social</h3>
                  <p>Queremos seguir avanzando hacia un modelo cada vez más accesible y útil para quien lo necesita.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="footer">
          <div className="container">
            <div className="footer-card">
              <div className="footer-left">
                <h3>Nira Legal Group</h3>
                <p>Tu equipo. Tu aliado. Tu espacio para defender tus derechos.</p>
              </div>

              <div className="footer-actions">
                <a
                  className="link-pill"
                  href="https://www.instagram.com/niralegalgroup?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>

                <a
                  className="cta-pill"
                  href="https://wa.me/34684741648"
                  target="_blank"
                  rel="noreferrer"
                >
                  Contactar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}