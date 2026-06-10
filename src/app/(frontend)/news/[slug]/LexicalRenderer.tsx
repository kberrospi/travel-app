import type { Blog } from '@/payload-types'

type LexicalNode = {
  type: string
  version?: number
  text?: string
  format?: number | string
  tag?: string
  children?: LexicalNode[]
  url?: string
  newTab?: boolean
  listType?: string
  value?: number
  [k: string]: unknown
}

function renderText(node: LexicalNode): React.ReactNode {
  let el: React.ReactNode = node.text ?? ''
  if (!el) return null

  const fmt = typeof node.format === 'number' ? node.format : 0
  if (fmt & 1) el = <strong>{el}</strong>
  if (fmt & 2) el = <em>{el}</em>
  if (fmt & 8) el = <u>{el}</u>
  if (fmt & 4) el = <s>{el}</s>
  if (fmt & 16) el = <code className="richtext-code">{el}</code>

  return el
}

function renderNode(node: LexicalNode, idx: number): React.ReactNode {
  switch (node.type) {
    case 'text':
      return <span key={idx}>{renderText(node)}</span>

    case 'linebreak':
      return <br key={idx} />

    case 'paragraph':
      return (
        <p key={idx} className="richtext-paragraph">
          {node.children?.map((child, i) => renderNode(child, i))}
        </p>
      )

    case 'heading': {
      const Tag = (node.tag ?? 'h2') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
      return (
        <Tag key={idx} className={`richtext-${node.tag}`}>
          {node.children?.map((child, i) => renderNode(child, i))}
        </Tag>
      )
    }

    case 'list': {
      const ListTag = node.listType === 'number' ? 'ol' : 'ul'
      return (
        <ListTag key={idx} className={`richtext-list richtext-list-${node.listType}`}>
          {node.children?.map((child, i) => renderNode(child, i))}
        </ListTag>
      )
    }

    case 'listitem':
      return (
        <li key={idx} className="richtext-listitem">
          {node.children?.map((child, i) => renderNode(child, i))}
        </li>
      )

    case 'link': {
      const href = (node.fields as { url?: string } | undefined)?.url ?? (node.url as string) ?? '#'
      const target = (node.fields as { newTab?: boolean } | undefined)?.newTab
        ? '_blank'
        : undefined
      return (
        <a
          key={idx}
          href={href}
          target={target}
          rel={target ? 'noopener noreferrer' : undefined}
          className="richtext-link"
        >
          {node.children?.map((child, i) => renderNode(child, i))}
        </a>
      )
    }

    case 'quote':
      return (
        <blockquote key={idx} className="richtext-quote">
          {node.children?.map((child, i) => renderNode(child, i))}
        </blockquote>
      )

    case 'horizontalrule':
      return <hr key={idx} className="richtext-hr" />

    default:
      if (node.children?.length) {
        return <div key={idx}>{node.children.map((child, i) => renderNode(child, i))}</div>
      }
      return null
  }
}

interface Props {
  content: Blog['content']
  className?: string
}

export const LexicalRenderer = ({ content, className }: Props) => {
  const root = content?.root
  if (!root?.children?.length) return null

  return (
    <div className={className}>
      {(root.children as LexicalNode[]).map((node, i) => renderNode(node, i))}
    </div>
  )
}
