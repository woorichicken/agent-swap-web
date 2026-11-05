"use client"

import { ScrollVideo } from "./scroll-video"

type Media = { type: "image" | "video"; src: string; alt: string }

/**
 * 설정의 media 를 받아 이미지든 영상이든 같은 틀로 그린다.
 *
 * 이게 없으면 페이지마다 `media.type === "video" ? <ScrollVideo/> : <img/>` 삼항이
 * 흩어지고, 새 미디어 종류(gif·iframe)를 넣을 때 전수로 고쳐야 한다.
 */
export function MediaFrame({ media, className = "" }: { media: Media; className?: string }) {
  if (media.type === "video") {
    return <ScrollVideo src={media.src} alt={media.alt} className={className} />
  }
  return <img src={media.src} alt={media.alt} className={className} loading="lazy" />
}
