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

async function obtenerPublicaciones(q?: string): Promise<PublicacionCard[]> {
  let query = supabase
    .from('noticias')
    .select(
      'id, titulo, resumen, descripcion, lugar, fecha_publicacion, slug, tipo, imagen_portada_url, destacado, orden_visual'
    )
    .eq('publicado_en_web', true)
    .order('destacado', { ascending: false })
    .order('orden_visual', { ascending: true })
    .order('fecha_publicacion', { ascending: false })

  if (q?.trim()) {
    query = query.ilike('titulo', `%${q.trim()}%`)
  }

  const { data, error } = await query

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

export default async function PublicacionesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const busqueda = q?.trim() ?? ''
  const publicaciones = await obtenerPublicaciones(busqueda)

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
          maxWidth: '1180px',
          margin: '0 auto',
          padding: '20px 14px 46px',
          boxSizing: 'border-box',
        }}
      >
        <header
          style={{
            background: '#0b0b0b',
            border: '1px solid #171717',
            borderRadius: '24px',
            padding: '22px',
            marginBottom: '18px',
          }}
        >
          <p
            style={{
              margin: '0 0 8px 0',
              color: '#d6c29a',
              fontSize: '11px',
              letterSpacing: '1.4px',
            }}
          >
            NIRA LEGAL GROUP
          </p>

          <h1
            style={{
              margin: 0,
              fontFamily: "'Times New Roman', serif",
              fontSize: 'clamp(38px, 5.2vw, 64px)',
              lineHeight: '0.95',
            }}
          >
            Publicaciones
          </h1>

          <p
            style={{
              margin: '14px 0 0 0',
              color: '#cfcfcf',
              lineHeight: '1.7',
              maxWidth: '760px',
              fontSize: '15px',
            }}
          >
            Noticias, resoluciones, sentencias, vídeos y contenido útil del despacho.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              marginTop: '18px',
            }}
          >
            <Link
              href="/"
              style={{
                background: '#111',
                color: 'white',
                border: '1px solid #262626',
                borderRadius: '14px',
                padding: '12px 16px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
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
                padding: '12px 16px',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
              }}
            >
              WhatsApp
            </a>
          </div>
        </header>

        <section
          style={{
            background: '#0b0b0b',
            border: '1px solid #171717',
            borderRadius: '22px',
            padding: '16px',
            marginBottom: '18px',
          }}
        >
          <form
            method="GET"
            action="/publicaciones"
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr)',
              gap: '10px',
            }}
          >
            <label
              htmlFor="q"
              style={{
                color: '#d6c29a',
                fontSize: '13px',
                fontWeight: 700,
              }}
            >
              Buscar por título
            </label>

            <input
              id="q"
              name="q"
              defaultValue={busqueda}
              placeholder="Ej: despido, arraigo, nacionalidad, sentencia..."
              style={{
                width: '100%',
                boxSizing: 'border-box',
                background: '#080808',
                border: '1px solid #262626',
                borderRadius: '14px',
                padding: '14px 16px',
                color: 'white',
                outline: 'none',
                fontSize: '15px',
              }}
            />

            <div
              style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
              }}
            >
              <button
                type="submit"
                style={{
                  background: 'white',
                  color: 'black',
                  borderRadius: '14px',
                  padding: '12px 16px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Buscar
              </button>

              <Link
                href="/publicaciones"
                style={{
                  background: '#111',
                  color: 'white',
                  border: '1px solid #262626',
                  borderRadius: '14px',
                  padding: '12px 16px',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                }}
              >
                Limpiar
              </Link>
            </div>
          </form>

          {busqueda ? (
            <p
              style={{
                margin: '12px 0 0 0',
                color: '#bcbcbc',
                fontSize: '14px',
                lineHeight: '1.7',
              }}
            >
              Buscando: <strong>{busqueda}</strong>
            </p>
          ) : null}
        </section>

        {publicaciones.length === 0 ? (
          <section
            style={{
              background: '#0b0b0b',
              border: '1px solid #171717',
              borderRadius: '22px',
              padding: '22px',
            }}
          >
            <h2
              style={{
                margin: '0 0 10px 0',
                fontFamily: "'Times New Roman', serif",
                fontSize: 'clamp(28px, 4vw, 40px)',
              }}
            >
              No hay resultados
            </h2>

            <p
              style={{
                margin: 0,
                color: '#b0b0b0',
                lineHeight: '1.8',
                fontSize: '15px',
              }}
            >
              {busqueda
                ? 'No hemos encontrado publicaciones con ese título.'
                : 'Todavía no hay publicaciones públicas activas.'}
            </p>
          </section>
        ) : (
          <section
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
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
                    minHeight: '100%',
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
                        fontSize: 'clamp(24px, 3vw, 42px)',
                        lineHeight: '0.98',
                        display: '-webkit-box',
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
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
                        lineHeight: '1.8',
                        fontSize: '15px',
                        flex: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 5,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
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
                        padding: '13px 16px',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 'fit-content',
                        fontSize: '14px',
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
