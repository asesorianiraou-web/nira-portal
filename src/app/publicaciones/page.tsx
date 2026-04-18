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
          maxWidth: '1220px',
          margin: '0 auto',
          padding: '28px 18px 60px',
          boxSizing: 'border-box',
        }}
      >
        <header
          style={{
            background: '#0b0b0b',
            border: '1px solid #171717',
            borderRadius: '28px',
            padding: '28px',
            marginBottom: '22px',
          }}
        >
          <p
            style={{
              margin: '0 0 10px 0',
              color: '#d6c29a',
              fontSize: '12px',
              letterSpacing: '1.5px',
            }}
          >
            NIRA LEGAL GROUP
          </p>

          <h1
            style={{
              margin: 0,
              fontFamily: "'Times New Roman', serif",
              fontSize: 'clamp(42px, 6vw, 74px)',
              lineHeight: '0.98',
            }}
          >
            Publicaciones
          </h1>

          <p
            style={{
              margin: '16px 0 0 0',
              color: '#cfcfcf',
              lineHeight: '1.7',
              maxWidth: '720px',
              fontSize: '16px',
            }}
          >
            Noticias, resoluciones, sentencias, vídeos y contenido útil del despacho.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              marginTop: '20px',
            }}
          >
            <Link
              href="/"
              style={{
                background: '#111',
                color: 'white',
                border: '1px solid #262626',
                borderRadius: '14px',
                padding: '14px 18px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Volver al inicio
            </Link>

            <a
              href="https://wa.me/34684741648"
              target="_blank"
              rel="noreferrer"
              style={{
                background: 'white',
                color: 'black',
                borderRadius: '14px',
                padding: '14px 18px',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              WhatsApp
            </a>
          </div>
        </header>

        {publicaciones.length === 0 ? (
          <section
            style={{
              background: '#0b0b0b',
              border: '1px solid #171717',
              borderRadius: '24px',
              padding: '24px',
            }}
          >
            <h2
              style={{
                margin: '0 0 10px 0',
                fontFamily: "'Times New Roman', serif",
                fontSize: '34px',
              }}
            >
              No hay publicaciones públicas todavía
            </h2>

            <p
              style={{
                margin: 0,
                color: '#b0b0b0',
                lineHeight: '1.7',
              }}
            >
              Cuando activéis una publicación en la app con “publicar en web”, aparecerá aquí.
            </p>
          </section>
        ) : (
          <section
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '18px',
            }}
          >
            {publicaciones.map((item) => {
              const resumenVisible =
                item.resumen?.trim() ||
                item.descripcion?.trim() ||
                'Sin resumen disponible.'

              return (
                <article
                  key={item.id}
                  style={{
                    background: '#0b0b0b',
                    border: '1px solid #171717',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {item.imagen_portada_url ? (
                    <div
                      style={{
                        width: '100%',
                        aspectRatio: '16 / 9',
                        background: '#080808',
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src={item.imagen_portada_url}
                        alt={item.titulo}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    </div>
                  ) : null}

                  <div
                    style={{
                      padding: '18px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        gap: '8px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <span
                        style={{
                          borderRadius: '999px',
                          padding: '6px 10px',
                          fontSize: '12px',
                          border: '1px solid #262626',
                          background: '#111',
                          color: 'white',
                          width: 'fit-content',
                        }}
                      >
                        {formatearTipo(item.tipo)}
                      </span>

                      {item.destacado ? (
                        <span
                          style={{
                            borderRadius: '999px',
                            padding: '6px 10px',
                            fontSize: '12px',
                            border: '1px solid #3b3423',
                            background: '#111',
                            color: '#d6c29a',
                            width: 'fit-content',
                          }}
                        >
                          Destacado
                        </span>
                      ) : null}
                    </div>

                    <h2
                      style={{
                        margin: 0,
                        fontFamily: "'Times New Roman', serif",
                        fontSize: '34px',
                        lineHeight: '1.05',
                      }}
                    >
                      {item.titulo}
                    </h2>

                    <div
                      style={{
                        color: '#9f9f9f',
                        fontSize: '14px',
                        lineHeight: '1.5',
                      }}
                    >
                      <span>{formatearFecha(item.fecha_publicacion)}</span>
                      {item.lugar?.trim() ? <span> · {item.lugar}</span> : null}
                    </div>

                    <p
                      style={{
                        margin: 0,
                        color: '#d0d0d0',
                        lineHeight: '1.75',
                        fontSize: '15px',
                        flex: 1,
                      }}
                    >
                      {resumenVisible}
                    </p>

                    <Link
                      href={`/publicaciones/${item.slug}`}
                      style={{
                        background: 'white',
                        color: 'black',
                        borderRadius: '14px',
                        padding: '14px 18px',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 'fit-content',
                      }}
                    >
                      Abrir publicación
                    </Link>
                  </div>
                </article>
              )
            })}
          </section>
        )}
      </div>
    </main>
  )
}
