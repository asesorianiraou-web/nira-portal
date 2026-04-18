import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

type PublicacionCard = {
  id: string
  titulo: string
  resumen: string | null
  descripcion: string | null
  lugar: string | null
  fecha_publicacion: string
  slug: string
  tipo: string
  imagen_portada_url: string | null
  destacado: boolean
  orden_visual: number
}

async function obtenerPublicaciones(): Promise<PublicacionCard[]> {
  const { data, error } = await supabase
    .from('noticias')
    .select(
      'id, titulo, resumen, descripcion, lugar, fecha_publicacion, slug, tipo, imagen_portada_url, destacado, orden_visual'
    )
    .eq('publicado_en_web', true)
    .order('destacado', { ascending: false })
    .order('orden_visual', { ascending: true })
    .order('fecha_publicacion', { ascending: false })

  if (error) {
    console.error('Error cargando publicaciones:', error)
    return []
  }

  return (data as PublicacionCard[]) ?? []
}

function formatearFecha(fecha: string) {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(fecha))
}

function formatearTipo(tipo: string | null | undefined) {
  if (!tipo?.trim()) return 'Noticia'

  const limpio = tipo.trim().toLowerCase()

  switch (limpio) {
    case 'publicidad':
      return 'Publicidad'
    case 'video':
      return 'Vídeo'
    case 'sentencia':
      return 'Sentencia'
    case 'resolucion':
      return 'Resolución'
    case 'articulo':
      return 'Artículo'
    default:
      return 'Noticia'
  }
}

export default async function PublicacionesPage() {
  const publicaciones = await obtenerPublicaciones()

  return (
    <main className="page">
      <div className="wrap">
        <header className="hero">
          <p className="eyebrow">NIRA LEGAL GROUP</p>
          <h1 className="title">Publicaciones</h1>
          <p className="subtitle">
            Noticias, resoluciones, sentencias, vídeos y contenido útil del despacho.
          </p>

          <div className="actions">
            <Link href="/" className="ghostButton">
              Volver al inicio
            </Link>
            <a
              href="https://wa.me/34684741648"
              target="_blank"
              rel="noreferrer"
              className="primaryButton"
            >
              WhatsApp
            </a>
          </div>
        </header>

        {publicaciones.length === 0 ? (
          <section className="emptyCard">
            <h2>No hay publicaciones públicas todavía</h2>
            <p>
              Cuando activéis una publicación en la app con “publicar en web”, aparecerá aquí.
            </p>
          </section>
        ) : (
          <section className="grid">
            {publicaciones.map((item) => {
              const resumenVisible =
                item.resumen?.trim() ||
                item.descripcion?.trim() ||
                'Sin resumen disponible.'

              return (
                <article key={item.id} className="card">
                  {item.imagen_portada_url ? (
                    <div className="imageWrap">
                      <img
                        src={item.imagen_portada_url}
                        alt={item.titulo}
                        className="image"
                      />
                    </div>
                  ) : null}

                  <div className="cardBody">
                    <div className="metaTop">
                      <span className="badge">{formatearTipo(item.tipo)}</span>
                      {item.destacado ? <span className="badgeGold">Destacado</span> : null}
                    </div>

                    <h2 className="cardTitle">{item.titulo}</h2>

                    <div className="metaLine">
                      <span>{formatearFecha(item.fecha_publicacion)}</span>
                      {item.lugar?.trim() ? <span>· {item.lugar}</span> : null}
                    </div>

                    <p className="resume">{resumenVisible}</p>

                    <Link href={`/publicaciones/${item.slug}`} className="readButton">
                      Abrir publicación
                    </Link>
                  </div>
                </article>
              )
            })}
          </section>
        )}
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #050505;
          color: white;
        }

        .wrap {
          width: 100%;
          max-width: 1220px;
          margin: 0 auto;
          padding: 28px 18px 60px;
          box-sizing: border-box;
        }

        .hero {
          background: #0b0b0b;
          border: 1px solid #171717;
          border-radius: 28px;
          padding: 28px;
          margin-bottom: 22px;
        }

        .eyebrow {
          margin: 0 0 10px 0;
          color: #d6c29a;
          font-size: 12px;
          letter-spacing: 1.5px;
        }

        .title {
          margin: 0;
          font-family: 'Times New Roman', serif;
          font-size: clamp(42px, 6vw, 74px);
          line-height: 0.98;
        }

        .subtitle {
          margin: 16px 0 0 0;
          color: #cfcfcf;
          line-height: 1.7;
          max-width: 720px;
          font-size: 16px;
        }

        .actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 20px;
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

        .emptyCard {
          background: #0b0b0b;
          border: 1px solid #171717;
          border-radius: 24px;
          padding: 24px;
        }

        .emptyCard h2 {
          margin: 0 0 10px 0;
          font-family: 'Times New Roman', serif;
          font-size: 34px;
        }

        .emptyCard p {
          margin: 0;
          color: #b0b0b0;
          line-height: 1.7;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .card {
          background: #0b0b0b;
          border: 1px solid #171717;
          border-radius: 24px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .imageWrap {
          width: 100%;
          aspect-ratio: 16 / 9;
          background: #080808;
          overflow: hidden;
        }

        .image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .cardBody {
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;
        }

        .metaTop {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .badge,
        .badgeGold {
          border-radius: 999px;
          padding: 6px 10px;
          font-size: 12px;
          border: 1px solid #262626;
          background: #111;
          color: white;
          width: fit-content;
        }

        .badgeGold {
          color: #d6c29a;
          border-color: #3b3423;
        }

        .cardTitle {
          margin: 0;
          font-family: 'Times New Roman', serif;
          font-size: 34px;
          line-height: 1.05;
        }

        .metaLine {
          color: #9f9f9f;
          font-size: 14px;
          line-height: 1.5;
        }

        .resume {
          margin: 0;
          color: #d0d0d0;
          line-height: 1.75;
          font-size: 15px;
          flex: 1;
        }

        .readButton {
          background: white;
          color: black;
          border-radius: 14px;
          padding: 14px 18px;
          font-weight: 700;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: fit-content;
        }

        @media (max-width: 900px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .wrap {
            padding: 18px 14px 40px;
          }

          .hero {
            padding: 20px;
            border-radius: 22px;
          }

          .actions {
            flex-direction: column;
          }

          .actions a,
          .readButton {
            width: 100%;
            box-sizing: border-box;
          }

          .cardTitle {
            font-size: 28px;
          }
        }
      `}</style>
    </main>
  )
}