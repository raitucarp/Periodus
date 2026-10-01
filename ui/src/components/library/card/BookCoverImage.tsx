import React from 'react'
import { Image } from '@chakra-ui/react'

export interface BookCoverImageProps {
  coverPath: string
  title: string
}

export function BookCoverImage({ coverPath, title }: BookCoverImageProps) {
  return (
    <Image
      src={coverPath}
      alt={title}
      w="full"
      h="full"
      objectFit="cover"
    />
  )
}
