'use client'

import Image from 'next/image'
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
    <>
      <main className="page">
        <section className="wrap">
          <header className="topbar">
            <div className="brand">
              <div className="brand-logo">
                <Image
                  src="/images/nira_logo.png"
                  alt="NIRA Legal Group"
                  width={60}
                  height={60}
                />
              </div>

              <div className="brand-copy">
                <div className="brand-title">NIRA LEGAL GROUP</div>
                <div className="brand-subtitle">Asesoría y defensa jurídica</div>
              </div>
            </div>

            <div className="top-actions">
              <a
                href="https://wa.me/34684741648"
                target="_blank"
                rel="noreferrer"
                className="ghostButton"
              >
                WhatsApp
              </a>

              <a
                href="https://www.instagram.com/niralegalgroup"
                target="_blank"
                rel="noreferrer"
                className="ghostButton"
              >
                Instagram
              </a>
            </div>
          </header>

          <section className="hero">
            <div className="heroLeft">
              <h1 className="heroTitle">Defensa jurídica clara, cercana y seria</h1>

              <p className="heroText">
                En NIRA Legal Group ayudamos a ordenar el problema, explicar el
                camino y acompañarte durante todo el expediente.
              </p>

              <div className="heroButtons">
                <a href="#portal" className="primaryButton">
                  Acceso cliente
                </a>

                <a href="#areas" className="ghostButton">
                  Áreas que llevamos
                </a>
              </div>
            </div>

            <div className="heroRight">
              <div className="loginCard">
                <h2 className="cardHeading">Acceso cliente</h2>

                <p className="cardText">
                  Entra con el código que te dio el despacho, junto con tu nombre y
                  apellidos.
                </p>

                <form id="portal" onSubmit={entrarPortal} className="form">
                  <input
                    type="text"
                    placeholder="Código"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    className="input"
                  />

                  <input
                    type="text"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="input"
                  />

                  <input
                    type="text"
                    placeholder="Apellidos"
                    value={apellidos}
                    onChange={(e) => setApellidos(e.target.value)}
                    className="input"
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="submitButton"
                  >
                    {loading ? 'Comprobando...' : 'Entrar al portal'}
                  </button>
                </form>

                {mensaje ? <div className="message">{mensaje}</div> : null}
              </div>
            </div>
          </section>

          <section className="cards3">
            <article className="infoCard">
              <h3 className="infoTitle">Quiénes somos</h3>
              <p className="infoText">
                Un despacho que busca explicar bien, actuar con estrategia y no vender humo.
              </p>
            </article>

            <article className="infoCard">
              <h3 className="infoTitle">Cómo trabajamos</h3>
              <p className="infoText">
                Ordenamos el expediente, pedimos lo necesario y mantenemos un seguimiento claro.
              </p>
            </article>

            <article className="infoCard">
              <h3 className="infoTitle">Portal cliente</h3>
              <p className="infoText">
                Consulta tu expediente y sube documentos desde cualquier dispositivo.
              </p>
            </article>
          </section>

          <section id="areas" className="areas">
            <h3 className="sectionTitle">Áreas que llevamos</h3>

            <div className="areasGrid">
              <article className="infoCard">
                <h4 className="smallTitle">Laboral</h4>
                <p className="infoText">
                  Despidos, reclamaciones y defensa del trabajador.
                </p>
              </article>

              <article className="infoCard">
                <h4 className="smallTitle">Extranjería</h4>
                <p className="infoText">
                  Regularización, solicitudes y expedientes.
                </p>
              </article>

              <article className="infoCard">
                <h4 className="smallTitle">Civil</h4>
                <p className="infoText">
                  Reclamaciones, conflictos y acompañamiento jurídico.
                </p>
              </article>

              <article className="infoCard">
                <h4 className="smallTitle">Consumo</h4>
                <p className="infoText">
                  Defensa frente a abusos y reclamaciones desproporcionadas.
                </p>
              </article>

              <article className="infoCard">
                <h4 className="smallTitle">Orientación jurídica</h4>
                <p className="infoText">
                  Guía clara cuando no sabes por dónde empezar.
                </p>
              </article>

              <article className="infoCard">
                <h4 className="smallTitle">Acompañamiento</h4>
                <p className="infoText">
                  Explicamos, escuchamos y ordenamos el camino.
                </p>
              </article>
            </div>
          </section>
        </section>
      </main>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #050505;
          color: white;
        }

        .wrap {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: 24px 20px 56px;
          box-sizing: border-box;
        }

        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
        }

        .brand-logo {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brand-copy {
          min-width: 0;
        }

        .brand-title {
          font-family: 'Times New Roman', serif;
          font-size: 34px;
          line-height: 1;
        }

        .brand-subtitle {
          color: #b0b0b0;
          font-size: 14px;
          margin-top: 4px;
        }

        .top-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .hero {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(320px, 420px);
          gap: 24px;
          background: #0b0b0b;
          border: 1px solid #171717;
          border-radius: 28px;
          padding: 26px;
        }

        .heroLeft {
          min-width: 0;
        }

        .heroRight {
          display: flex;
          align-items: stretch;
        }

        .heroTitle {
          margin: 0;
          font-family: 'Times New Roman', serif;
          font-size: clamp(42px, 6vw, 76px);
          line-height: 0.98;
        }

        .heroText {
          color: #b0b0b0;
          font-size: clamp(15px, 2vw, 18px);
          line-height: 1.7;
          margin-top: 18px;
          max-width: 760px;
        }

        .heroButtons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 22px;
        }

        .loginCard {
          width: 100%;
          background: #080808;
          border: 1px solid #171717;
          border-radius: 24px;
          padding: 22px;
          box-sizing: border-box;
        }

        .cardHeading {
          margin: 0 0 10px 0;
          font-family: 'Times New Roman', serif;
          font-size: clamp(28px, 4vw, 40px);
        }

        .cardText {
          color: #b0b0b0;
          line-height: 1.6;
          margin: 0 0 16px 0;
          font-size: 14px;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .input {
          width: 100%;
          background: #050505;
          color: white;
          border: 1px solid #262626;
          border-radius: 14px;
          padding: 14px 16px;
          outline: none;
          box-sizing: border-box;
        }

        .input::placeholder {
          color: #7f7f7f;
        }

        .submitButton {
          background: white;
          color: black;
          border: none;
          border-radius: 14px;
          padding: 14px 18px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 4px;
        }

        .submitButton:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .primaryButton {
          background: white;
          color: black;
          border-radius: 14px;
          padding: 14px 18px;
          font-weight: 700;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .ghostButton {
          background: #111;
          color: white;
          border: 1px solid #262626;
          border-radius: 14px;
          padding: 14px 18px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .message {
          margin-top: 14px;
          color: #d6c29a;
          line-height: 1.5;
          font-size: 14px;
        }

        .cards3 {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin-top: 20px;
        }

        .areas {
          margin-top: 28px;
        }

        .sectionTitle {
          font-family: 'Times New Roman', serif;
          font-size: clamp(38px, 5vw, 60px);
          margin: 0 0 22px 0;
        }

        .areasGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .infoCard {
          background: #0b0b0b;
          border: 1px solid #171717;
          border-radius: 24px;
          padding: 22px;
          min-width: 0;
        }

        .infoTitle {
          margin: 0 0 10px 0;
          font-family: 'Times New Roman', serif;
          font-size: 28px;
        }

        .smallTitle {
          margin: 0 0 10px 0;
          font-family: 'Times New Roman', serif;
          font-size: 24px;
        }

        .infoText {
          margin: 0;
          color: #b0b0b0;
          line-height: 1.6;
          font-size: 15px;
        }

        @media (max-width: 1024px) {
          .hero {
            grid-template-columns: 1fr;
          }

          .heroRight {
            display: block;
          }

          .cards3 {
            grid-template-columns: 1fr;
          }

          .areasGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .wrap {
            padding: 18px 14px 40px;
          }

          .brand {
            gap: 10px;
          }

          .brand-title {
            font-size: 24px;
          }

          .brand-subtitle {
            font-size: 12px;
          }

          .top-actions {
            width: 100%;
          }

          .top-actions a {
            flex: 1 1 auto;
          }

          .hero {
            padding: 18px;
            border-radius: 22px;
          }

          .heroButtons {
            flex-direction: column;
          }

          .heroButtons a {
            width: 100%;
            box-sizing: border-box;
          }

          .loginCard {
            padding: 18px;
          }

          .areasGrid {
            grid-template-columns: 1fr;
          }

          .infoCard {
            padding: 18px;
          }

          .primaryButton,
          .ghostButton,
          .submitButton {
            min-height: 50px;
          }
        }
      `}</style>
    </>
  )
}
