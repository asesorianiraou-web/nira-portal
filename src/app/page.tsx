'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const SITE_URL = 'https://niralegalgroup.es'
const BRAND_NAME = 'NIRA LEGAL GROUP'
const BRAND_ALT = 'Nira Legal Group'
const WHATSAPP_URL = 'https://wa.me/34684741648'
const INSTAGRAM_URL = 'https://www.instagram.com/niralegalgroup'
const LOGO_URL = `${SITE_URL}/images/nira_logo.png`

function upsertMetaByName(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertMetaByProperty(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('property', property)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export default function HomePage() {
  const router = useRouter()

  const [codigo, setCodigo] = useState('')
  const [nombre, setNombre] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const title =
      'NIRA LEGAL GROUP | Extranjería, laboral, civil, consumo, renta y portal cliente'
    const description =
      'NIRA LEGAL GROUP es un despacho jurídico con servicios en extranjería, laboral, civil, consumo, renta y portal cliente para enviar documentación y seguir tu caso.'

    document.title = title
    upsertMetaByName('description', description)
    upsertMetaByName('robots', 'index,follow,max-image-preview:large')
    upsertMetaByProperty('og:title', title)
    upsertMetaByProperty('og:description', description)
    upsertMetaByProperty('og:type', 'website')
    upsertMetaByProperty('og:url', SITE_URL)
    upsertMetaByProperty('og:site_name', BRAND_NAME)
    upsertMetaByProperty('og:image', LOGO_URL)
    upsertMetaByName('twitter:card', 'summary_large_image')
    upsertMetaByName('twitter:title', title)
    upsertMetaByName('twitter:description', description)
    upsertMetaByName('twitter:image', LOGO_URL)
    upsertLink('canonical', SITE_URL)
  }, [])

  const websiteSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: BRAND_NAME,
      alternateName: [BRAND_ALT, 'NIRA', 'niralegalgroup'],
      url: SITE_URL,
      inLanguage: 'es-ES',
    }),
    []
  )

  const legalServiceSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'LegalService',
      '@id': `${SITE_URL}/#legalservice`,
      name: BRAND_NAME,
      alternateName: [BRAND_ALT, 'NIRA'],
      url: SITE_URL,
      logo: LOGO_URL,
      image: LOGO_URL,
      areaServed: 'España',
      availableLanguage: ['es', 'en'],
      sameAs: [INSTAGRAM_URL],
      serviceType: [
        'Extranjería',
        'Arraigo social',
        'Arraigo sociolaboral',
        'Nacionalidad española',
        'Regularización',
        'Derecho laboral',
        'Derecho civil',
        'Consumo',
        'Declaración de la renta',
        'Consulta jurídica online',
      ],
      description:
        'Despacho jurídico con orientación clara y seria. Servicios en extranjería, arraigo, nacionalidad, regularización, laboral, civil, consumo, renta y portal cliente.',
    }),
    []
  )

  const faqSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '¿Qué es NIRA LEGAL GROUP?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'NIRA LEGAL GROUP es un despacho jurídico con enfoque práctico y cercano, especialmente en extranjería, laboral, civil, consumo, renta y orientación jurídica.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Lleváis temas de extranjería?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sí. Entre otros, trabajamos temas de arraigo, nacionalidad, regularización, residencia y expedientes de extranjería.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Puedo enviar documentación por internet?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sí. Si ya eres cliente y tienes acceso, puedes entrar al portal y subir documentación de forma rápida.',
          },
        },
        {
          '@type': 'Question',
          name: '¿También trabajáis laboral, civil o consumo?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sí. Además de extranjería, también trabajamos asuntos laborales, civiles, de consumo y otras consultas jurídicas.',
          },
        },
      ],
    }),
    []
  )

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(legalServiceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="page">
        <section className="wrap">
          <header className="topbar">
            <div className="brand">
              <div className="brandLogo">
                <Image
                  src="/images/nira_logo.png"
                  alt="NIRA LEGAL GROUP"
                  width={60}
                  height={60}
                />
              </div>

              <div className="brandCopy">
                <div className="brandTitle">{BRAND_NAME}</div>
                <div className="brandSub">Asesoría y defensa jurídica</div>
              </div>
            </div>

            <div className="topActions">
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="ghostButton">
                WhatsApp
              </a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="ghostButton">
                Instagram
              </a>
            </div>
          </header>

          <section className="hero">
            <div className="heroLeft">
              <p className="eyebrow">DESPACHO JURÍDICO • EXTRANJERÍA • LABORAL • PORTAL CLIENTE</p>

              <h1 className="heroTitle">Defensa jurídica clara, cercana y seria</h1>

              <p className="heroText">
                En <strong>{BRAND_NAME}</strong> ayudamos a ordenar el problema,
                explicar el camino y acompañarte durante todo el expediente.
                Trabajamos especialmente asuntos de <strong>extranjería</strong>,
                <strong> laboral</strong>, <strong>civil</strong>,
                <strong> consumo</strong> y <strong>renta</strong>, con una forma
                de trabajar directa y útil.
              </p>

              <div className="heroButtons">
                <a href="#portal" className="primaryButton">
                  Acceso cliente
                </a>
                <a href="#servicios" className="ghostButton">
                  Áreas que llevamos
                </a>
              </div>
            </div>

            <div className="heroRight">
              <div className="loginCard">
                <h2 className="cardHeading">Acceso cliente</h2>
                <p className="cardText">
                  Entra con el código que te dio el despacho, junto con tu nombre y apellidos.
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

                  <button type="submit" disabled={loading} className="submitButton">
                    {loading ? 'Comprobando...' : 'Entrar al portal'}
                  </button>
                </form>

                {mensaje ? <div className="message">{mensaje}</div> : null}
              </div>
            </div>
          </section>

          <section className="cards3">
            <article className="infoCard">
              <h2 className="infoTitle">Quiénes somos</h2>
              <p className="infoText">
                Somos un despacho que busca explicar bien, actuar con estrategia y
                no vender humo. La idea es sencilla: que tu derecho no dependa de tu bolsillo.
              </p>
            </article>

            <article className="infoCard">
              <h2 className="infoTitle">Cómo trabajamos</h2>
              <p className="infoText">
                Ordenamos el expediente, pedimos lo necesario, resolvemos dudas y
                mantenemos un seguimiento claro. Si ya eres cliente, puedes usar el
                portal para enviar documentación y seguir tu caso.
              </p>
            </article>

            <article className="infoCard">
              <h2 className="infoTitle">Portal cliente</h2>
              <p className="infoText">
                Tu expediente, tus documentos y tu acceso privado en un solo sitio.
                Útil para subir papeles, revisar datos y mantener el caso más ordenado.
              </p>
            </article>
          </section>

          <section className="contentSection">
            <h2 className="sectionTitle">Extranjería sin tecnicismos y con estrategia</h2>

            <div className="contentCard">
              <p className="longText">
                En nuestra comunicación diaria tratamos temas de <strong>extranjería</strong>
                como <strong>arraigo social</strong>, <strong>arraigo sociolaboral</strong>,
                <strong> arraigo familiar</strong>, <strong>nacionalidad española</strong>,
                <strong> regularización</strong>, <strong>residencia</strong>,
                <strong> autorización de trabajo</strong>, <strong>residencia temporal</strong>,
                <strong> renovación de papeles</strong> y situaciones reales que muchas
                personas viven cuando no saben por dónde empezar.
              </p>

              <p className="longText">
                También explicamos asuntos como <strong>requisitos reales del arraigo 2026</strong>,
                <strong> expediente de extranjería</strong>,
                <strong> resolución favorable</strong>,
                <strong> denegaciones</strong>, <strong>cómo preparar documentación</strong>,
                <strong> errores frecuentes en regularización</strong> y formas de enfocar
                cada caso sin promesas vacías.
              </p>

              <p className="longText">
                La idea es que cuando alguien busque información sobre
                <strong> nacionalidad</strong>, <strong>arraigo</strong>,
                <strong> regularización</strong>, <strong>residencia</strong>,
                <strong> extranjería en España</strong> o
                <strong> ayuda para papeles</strong>, encuentre una página clara,
                seria y conectada con un despacho real.
              </p>
            </div>
          </section>

          <section id="servicios" className="areas">
            <h2 className="sectionTitle">Áreas que llevamos</h2>

            <div className="areasGrid">
              <article className="infoCard">
                <h3 className="smallTitle">Extranjería</h3>
                <p className="infoText">
                  Arraigo, nacionalidad, regularización, residencia, trabajo y seguimiento de expedientes.
                </p>
              </article>

              <article className="infoCard">
                <h3 className="smallTitle">Laboral</h3>
                <p className="infoText">
                  Despidos, finiquito, indemnización, horas extra, reclamaciones y defensa del trabajador.
                </p>
              </article>

              <article className="infoCard">
                <h3 className="smallTitle">Civil</h3>
                <p className="infoText">
                  Reclamaciones, conflictos y acompañamiento jurídico cuando hace falta orden y estrategia.
                </p>
              </article>

              <article className="infoCard">
                <h3 className="smallTitle">Consumo</h3>
                <p className="infoText">
                  Micropréstamos, intereses abusivos, reclamaciones y conflictos con empresas o contratos.
                </p>
              </article>

              <article className="infoCard">
                <h3 className="smallTitle">Renta</h3>
                <p className="infoText">
                  Ayuda con la declaración de la renta, revisión de dudas y apoyo documental.
                </p>
              </article>

              <article className="infoCard">
                <h3 className="smallTitle">Orientación jurídica</h3>
                <p className="infoText">
                  Cuando no sabes por dónde empezar, te ayudamos a convertir el caos en pasos concretos.
                </p>
              </article>
            </div>
          </section>

          <section className="contentSection">
            <h2 className="sectionTitle">Contenido útil sobre casos reales</h2>

            <div className="contentCard">
              <p className="longText">
                Además de extranjería, también trabajamos y explicamos cuestiones de
                <strong> despido</strong>, <strong>finiquito</strong>,
                <strong> indemnización</strong>, <strong>horas extra</strong>,
                <strong> consumo</strong>, <strong>micropréstamos</strong> y
                <strong> declaración de la renta</strong>. La intención no es llenar
                la web de ruido, sino explicar mejor y ayudar a que una persona entienda
                si necesita reclamar, esperar, aportar documentos o actuar rápido.
              </p>
            </div>
          </section>

          <section className="contentSection">
            <h2 className="sectionTitle">Qué puedes hacer aquí</h2>

            <div className="featureGrid">
              <div className="featureCard">
                <div className="featureNumber">01</div>
                <h3 className="featureTitle">Consultar</h3>
                <p className="infoText">
                  Entender si tu problema es de extranjería, laboral, civil, consumo o renta.
                </p>
              </div>

              <div className="featureCard">
                <div className="featureNumber">02</div>
                <h3 className="featureTitle">Contactar</h3>
                <p className="infoText">
                  Escribir por WhatsApp y recibir una orientación inicial clara.
                </p>
              </div>

              <div className="featureCard">
                <div className="featureNumber">03</div>
                <h3 className="featureTitle">Acceder</h3>
                <p className="infoText">
                  Entrar al portal cliente si ya tienes un código activo.
                </p>
              </div>

              <div className="featureCard">
                <div className="featureNumber">04</div>
                <h3 className="featureTitle">Enviar</h3>
                <p className="infoText">
                  Subir documentación y mantener el caso más ordenado.
                </p>
              </div>
            </div>
          </section>

          <section className="faqSection">
            <h2 className="sectionTitle">Preguntas frecuentes</h2>

            <div className="faqList">
              <details className="faqItem">
                <summary>¿Qué es NIRA LEGAL GROUP?</summary>
                <p>
                  Es un despacho jurídico con enfoque práctico y cercano. Trabaja
                  especialmente asuntos de extranjería, laboral, civil, consumo,
                  renta y orientación jurídica.
                </p>
              </details>

              <details className="faqItem">
                <summary>¿Lleváis temas de extranjería?</summary>
                <p>
                  Sí. Entre otros, trabajamos temas de arraigo, nacionalidad,
                  regularización, residencia y expedientes de extranjería.
                </p>
              </details>

              <details className="faqItem">
                <summary>¿Qué tipo de temas de extranjería tratáis?</summary>
                <p>
                  Arraigo social, arraigo sociolaboral, residencia, nacionalidad,
                  regularización y otras situaciones relacionadas con papeles y trámites.
                </p>
              </details>

              <details className="faqItem">
                <summary>¿Puedo enviar documentación por internet?</summary>
                <p>
                  Sí. Si ya eres cliente y tienes acceso, puedes entrar al portal
                  y subir documentación de forma rápida.
                </p>
              </details>

              <details className="faqItem">
                <summary>¿También trabajáis laboral, civil o consumo?</summary>
                <p>
                  Sí. Además de extranjería, también trabajamos asuntos laborales,
                  civiles, de consumo y otras consultas jurídicas.
                </p>
              </details>
            </div>
          </section>

          <section className="ctaSection">
            <div className="ctaCard">
              <h2 className="ctaTitle">Tu derecho no debería depender del bolsillo de nadie</h2>
              <p className="ctaText">
                Si necesitas una primera orientación, si tienes dudas sobre un expediente
                o si ya eres cliente y quieres acceder al portal, aquí tienes una puerta
                clara para empezar.
              </p>

              <div className="ctaButtons">
                <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="primaryButton">
                  Hablar por WhatsApp
                </a>
                <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="ghostButton">
                  Ver Instagram
                </a>
              </div>
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
          padding: 24px 20px 60px;
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

        .brandLogo {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brandCopy {
          min-width: 0;
        }

        .brandTitle {
          font-family: 'Times New Roman', serif;
          font-size: 34px;
          line-height: 1;
        }

        .brandSub {
          color: #b0b0b0;
          font-size: 14px;
          margin-top: 4px;
        }

        .topActions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .hero {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(320px, 420px);
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

        .eyebrow {
          margin: 0 0 12px 0;
          color: #d6c29a;
          font-size: 12px;
          letter-spacing: 1.5px;
        }

        .heroTitle {
          margin: 0;
          font-family: 'Times New Roman', serif;
          font-size: clamp(42px, 6vw, 76px);
          line-height: 0.98;
        }

        .heroText {
          color: #d0d0d0;
          font-size: clamp(15px, 2vw, 18px);
          line-height: 1.75;
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

        .areas,
        .contentSection,
        .faqSection,
        .ctaSection {
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

        .contentCard,
        .ctaCard,
        .infoCard,
        .featureCard {
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

        .smallTitle,
        .featureTitle {
          margin: 0 0 10px 0;
          font-family: 'Times New Roman', serif;
          font-size: 24px;
        }

        .infoText {
          margin: 0;
          color: #b0b0b0;
          line-height: 1.7;
          font-size: 15px;
        }

        .longText {
          margin: 0 0 14px 0;
          color: #d0d0d0;
          line-height: 1.8;
          font-size: 16px;
        }

        .longText:last-child {
          margin-bottom: 0;
        }

        .featureGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        .featureNumber {
          color: #d6c29a;
          font-size: 14px;
          margin-bottom: 8px;
        }

        .faqList {
          display: grid;
          gap: 12px;
        }

        .faqItem {
          background: #0b0b0b;
          border: 1px solid #171717;
          border-radius: 18px;
          padding: 18px;
        }

        .faqItem summary {
          cursor: pointer;
          font-weight: 700;
          font-size: 18px;
          list-style: none;
        }

        .faqItem summary::-webkit-details-marker {
          display: none;
        }

        .faqItem p {
          margin: 12px 0 0 0;
          color: #c9c9c9;
          line-height: 1.75;
        }

        .ctaTitle {
          margin: 0 0 12px 0;
          font-family: 'Times New Roman', serif;
          font-size: clamp(30px, 4vw, 48px);
          line-height: 1.05;
        }

        .ctaText {
          margin: 0;
          color: #d0d0d0;
          line-height: 1.8;
          font-size: 16px;
        }

        .ctaButtons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 18px;
        }

        @media (max-width: 1024px) {
          .hero {
            grid-template-columns: 1fr;
          }

          .cards3 {
            grid-template-columns: 1fr;
          }

          .areasGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .featureGrid {
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

          .brandTitle {
            font-size: 24px;
          }

          .brandSub {
            font-size: 12px;
          }

          .topActions {
            width: 100%;
          }

          .topActions a {
            flex: 1 1 auto;
          }

          .hero {
            padding: 18px;
            border-radius: 22px;
          }

          .heroButtons,
          .ctaButtons {
            flex-direction: column;
          }

          .heroButtons a,
          .ctaButtons a {
            width: 100%;
            box-sizing: border-box;
          }

          .loginCard {
            padding: 18px;
          }

          .areasGrid,
          .featureGrid {
            grid-template-columns: 1fr;
          }

          .infoCard,
          .contentCard,
          .ctaCard,
          .featureCard {
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
