import type { Metadata } from 'next'
import Link from 'next/link'
import { Fragment } from 'react'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

type PublicacionDetalle = {
  id: string
  titulo: string
  descripcion: string | null
  lugar: string | null
  resumen: string | null
  fecha_publicacion: string
  slug: string
  tipo: string
  imagen_portada_url: string | null
  video_url: string | null
  pdf_url: string | null
  contenido_markdown: string | null
  seo_title: string | null
  seo_description: string | null
  destacado: boolean
}

async function obtenerPublicacion(slug: string): Promise<PublicacionDetalle | null> {
  const { data, error } = await supabase
    .from('noticias')
    .select(
      'id, titulo, descripcion, lugar, resumen, fecha_publicacion, slug, tipo, imagen_portada_url, video_url, pdf_url, contenido_markdown, seo_title, seo_description, destacado'
    )
    .eq('publicado_en_web', true)
    .eq('slug', slug)
    .maybeSingle()

  if (error) {
    console.error('Error cargando publicación:', error)
    return null
  }

  return (data as PublicacionDetalle | null) ?? null
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

function parseInline(text: string) {
  const trozos = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean)

  return trozos.map((trozo, index) => {
    if (trozo.startsWith('**') && trozo.endsWith('**')) {
      return <strong key={index}>{trozo.slice(2, -2)}</strong>
    }

    return <Fragment key={index}>{trozo}</Fragment>
  })
}

function renderMarkdownLite(texto: string) {
  const bloques = texto
    .split(/\n\s*\n/)
    .map((x) => x.trim())
    .filter(Boolean)

  return bloques.map((bloque, index) => {
    const lineas = bloque
      .split('\n')
      .map((x) => x.trim())
      .filter(Boolean)

    if (lineas.length === 1 && lineas[0].startsWith('### ')) {
      return (
        <h3
          key={index}
          style={{
            fontFamily: "'Times New Roman', serif",
            lineHeight: '1.08',
            margin: '0 0 14px 0',
            fontSize: '28px',
          }}
        >
          {parseInline(lineas[0].slice(4))}
        </h3>
      )
    }

    if (lineas.length === 1 && lineas[0].startsWith('## ')) {
      return (
        <h2
          key={index}
          style={{
            fontFamily: "'Times New Roman', serif",
            lineHeight: '1.08',
            margin: '0 0 14px 0',
            fontSize: '34px',
          }}
        >
          {parseInline(lineas[0].slice(3))}
        </h2>
      )
    }

    if (lineas.length === 1 && lineas[0].startsWith('# ')) {
      return (
        <h1
          key={index}
          style={{
            fontFamily: "'Times New Roman', serif",
            lineHeight: '1.08',
            margin: '0 0 14px 0',
            fontSize: '42px',
          }}
        >
          {parseInline(lineas[0].slice(2))}
        </h1>
      )
    }

    if (lineas.every((x) => x.startsWith('- '))) {
      return (
        <ul
          key={index}
          style={{
            margin: '0 0 18px 0',
            paddingLeft: '22px',
            color: '#e0e0e0',
            lineHeight: '1.9',
            fontSize: '17px',
          }}
        >
          {lineas.map((linea, i) => (
            <li key={i}>{parseInline(linea.slice(2))}</li>
          ))}
        </ul>
      )
    }

    return (
      <p
        key={index}
        style={{
          margin: '0 0 16px 0',
          color: '#e0e0e0',
          lineHeight: '1.9',
          fontSize: '17px',
        }}
      >
        {lineas.map((linea, i) => (
          <Fragment key={i}>
            {i > 0 ? <br /> : null}
            {parseInline(linea)}
          </Fragment>
        ))}
      </p>
    )
  })
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const publicacion = await obtenerPublicacion(slug)

  if (!publicacion) {
    return {
      title: 'Publicación no encontrada | NIRA LEGAL GROUP',
    }
  }

  const title =
    publicacion.seo_title?.trim() ||
    `${publicacion.titulo} | NIRA LEGAL GROUP`

  const description =
    publicacion.seo_description?.trim() ||
    publicacion.resumen?.trim() ||
    publicacion.descripcion?.trim() ||
    'Publicación de NIRA LEGAL GROUP.'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: publicacion.imagen_portada_url
        ? [publicacion.imagen_portada_url]
        : undefined,
      type: 'article',
    },
  }
}

export default async function PublicacionDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const publicacion = await obtenerPublicacion(slug)

  if (!publicacion) {
    notFound()
  }

  const contenidoVisible =
    publicacion.contenido_markdown?.trim() ||
    publicacion.descripcion?.trim() ||
    'Sin contenido disponible.'

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
          maxWidth: '980px',
          margin: '0 auto',
          padding: '28px 18px 60px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '20px',
          }}
        >
          <Link
            href="/publicaciones"
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
            Volver a publicaciones
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

        <article
          style={{
            background: '#0b0b0b',
            border: '1px solid #171717',
            borderRadius: '28px',
            padding: '26px',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              marginBottom: '14px',
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
              {formatearTipo(publicacion.tipo)}
            </span>

            {publicacion.destacado ? (
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

          <h1
            style={{
              margin: 0,
              fontFamily: "'Times New Roman', serif",
              fontSize: 'clamp(42px, 6vw, 72px)',
              lineHeight: '0.98',
            }}
          >
            {publicacion.titulo}
          </h1>

          <div
            style={{
              color: '#9f9f9f',
              fontSize: '14px',
              lineHeight: '1.5',
              marginTop: '16px',
            }}
          >
            <span>{formatearFecha(publicacion.fecha_publicacion)}</span>
            {publicacion.lugar?.trim() ? <span> · {publicacion.lugar}</span> : null}
          </div>

          {publicacion.resumen?.trim() ? (
            <p
              style={{
                margin: '18px 0 0 0',
                color: '#d6c29a',
                lineHeight: '1.8',
                fontSize: '18px',
              }}
            >
              {publicacion.resumen}
            </p>
          ) : null}

          {publicacion.imagen_portada_url ? (
            <div
              style={{
                width: '100%',
                marginTop: '22px',
                borderRadius: '22px',
                overflow: 'hidden',
                background: '#080808',
                border: '1px solid #171717',
              }}
            >
              <img
                src={publicacion.imagen_portada_url}
                alt={publicacion.titulo}
                style={{
                  width: '100%',
                  display: 'block',
                  objectFit: 'cover',
                }}
              />
            </div>
          ) : null}

          <section style={{ marginTop: '24px' }}>
            {renderMarkdownLite(contenidoVisible)}
          </section>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              marginTop: '24px',
            }}
          >
            {publicacion.video_url?.trim() ? (
              <a
                href={publicacion.video_url}
                target="_blank"
                rel="noreferrer"
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
                Ver vídeo
              </a>
            ) : null}

            {publicacion.pdf_url?.trim() ? (
              <a
                href={publicacion.pdf_url}
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
                Descargar PDF
              </a>
            ) : null}
          </div>
        </article>
      </div>
    </main>
  )
}
