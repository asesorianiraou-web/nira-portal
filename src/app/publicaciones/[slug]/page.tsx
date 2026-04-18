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
        <h3 key={index} className="mdH3">
          {parseInline(lineas[0].slice(4))}
        </h3>
      )
    }

    if (lineas.length === 1 && lineas[0].startsWith('## ')) {
      return (
        <h2 key={index} className="mdH2">
          {parseInline(lineas[0].slice(3))}
        </h2>
      )
    }

    if (lineas.length === 1 && lineas[0].startsWith('# ')) {
      return (
        <h1 key={index} className="mdH1">
          {parseInline(lineas[0].slice(2))}
        </h1>
      )
    }

    if (lineas.every((x) => x.startsWith('- '))) {
      return (
        <ul key={index} className="mdUl">
          {lineas.map((linea, i) => (
            <li key={i}>{parseInline(linea.slice(2))}</li>
          ))}
        </ul>
      )
    }

    return (
      <p key={index} className="mdP">
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
    <main className="page">
      <div className="wrap">
        <div className="topActions">
          <Link href="/publicaciones" className="ghostButton">
            Volver a publicaciones
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

        <article className="articleCard">
          <div className="metaTop">
            <span className="badge">{formatearTipo(publicacion.tipo)}</span>
            {publicacion.destacado ? <span className="badgeGold">Destacado</span> : null}
          </div>

          <h1 className="title">{publicacion.titulo}</h1>

          <div className="metaLine">
            <span>{formatearFecha(publicacion.fecha_publicacion)}</span>
            {publicacion.lugar?.trim() ? <span>· {publicacion.lugar}</span> : null}
          </div>

          {publicacion.resumen?.trim() ? (
            <p className="summary">{publicacion.resumen}</p>
          ) : null}

          {publicacion.imagen_portada_url ? (
            <div className="imageWrap">
              <img
                src={publicacion.imagen_portada_url}
                alt={publicacion.titulo}
                className="image"
              />
            </div>
          ) : null}

          <section className="content">
            {renderMarkdownLite(contenidoVisible)}
          </section>

          <div className="assetButtons">
            {publicacion.video_url?.trim() ? (
              <a
                href={publicacion.video_url}
                target="_blank"
                rel="noreferrer"
                className="ghostButton"
              >
                Ver vídeo
              </a>
            ) : null}

            {publicacion.pdf_url?.trim() ? (
              <a
                href={publicacion.pdf_url}
                target="_blank"
                rel="noreferrer"
                className="primaryButton"
              >
                Descargar PDF
              </a>
            ) : null}
          </div>
        </article>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #050505;
          color: white;
        }

        .wrap {
          width: 100%;
          max-width: 980px;
          margin: 0 auto;
          padding: 28px 18px 60px;
          box-sizing: border-box;
        }

        .topActions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 20px;
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

        .articleCard {
          background: #0b0b0b;
          border: 1px solid #171717;
          border-radius: 28px;
          padding: 26px;
        }

        .metaTop {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 14px;
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

        .title {
          margin: 0;
          font-family: 'Times New Roman', serif;
          font-size: clamp(42px, 6vw, 72px);
          line-height: 0.98;
        }

        .metaLine {
          color: #9f9f9f;
          font-size: 14px;
          line-height: 1.5;
          margin-top: 16px;
        }

        .summary {
          margin: 18px 0 0 0;
          color: #d6c29a;
          line-height: 1.8;
          font-size: 18px;
        }

        .imageWrap {
          width: 100%;
          margin-top: 22px;
          border-radius: 22px;
          overflow: hidden;
          background: #080808;
          border: 1px solid #171717;
        }

        .image {
          width: 100%;
          display: block;
          object-fit: cover;
        }

        .content {
          margin-top: 24px;
        }

        .mdH1,
        .mdH2,
        .mdH3 {
          font-family: 'Times New Roman', serif;
          line-height: 1.08;
          margin: 0 0 14px 0;
        }

        .mdH1 {
          font-size: 42px;
        }

        .mdH2 {
          font-size: 34px;
        }

        .mdH3 {
          font-size: 28px;
        }

        .mdP {
          margin: 0 0 16px 0;
          color: #e0e0e0;
          line-height: 1.9;
          font-size: 17px;
        }

        .mdUl {
          margin: 0 0 18px 0;
          padding-left: 22px;
          color: #e0e0e0;
          line-height: 1.9;
          font-size: 17px;
        }

        .assetButtons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 24px;
        }

        @media (max-width: 640px) {
          .wrap {
            padding: 18px 14px 40px;
          }

          .articleCard {
            padding: 20px;
            border-radius: 22px;
          }

          .topActions,
          .assetButtons {
            flex-direction: column;
          }

          .topActions a,
          .assetButtons a {
            width: 100%;
            box-sizing: border-box;
          }

          .mdH1 {
            font-size: 34px;
          }

          .mdH2 {
            font-size: 28px;
          }

          .mdH3 {
            font-size: 24px;
          }

          .mdP,
          .mdUl {
            font-size: 16px;
          }

          .summary {
            font-size: 16px;
          }
        }
      `}</style>
    </main>
  )
}
