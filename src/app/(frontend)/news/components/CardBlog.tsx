'use client'
import { FC } from 'react'
import Link from 'next/link'
import style from '../styles.module.css'
import { Blog } from '@/payload-types'

interface Props {
  post: Blog
  imgUrl: string
  cat: {
    bg: string
    color: string
    label: string
  }
}

export const CardBlog: FC<Props> = ({ post, imgUrl, cat }) => {
  return (
    <Link href={`/news/${post.slug ?? post.id}`} className={style.card}>
      <div className={style.cardImgWrapper}>
        <img src={imgUrl} alt={post.title} className={style.cardImg} />
        {cat && (
          <span className={style.categoryBadge} style={{ background: cat.bg, color: cat.color }}>
            {cat.label}
          </span>
        )}
      </div>
      <div className={style.cardBody}>
        <h2 className={style.cardTitle}>{post.title}</h2>
        <time className={style.cardDate}>
          {new Date(post.createdAt).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
      </div>
    </Link>
  )
}
