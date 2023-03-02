import { E621Post } from '@/e621'
import { atom } from 'jotai'

export const loadProgressAtom = atom(0)

export const postAtom = atom<E621Post | null>(null)

export const postSizeAtom = atom({
  width: 0,
  height: 0,
})

export const postSpringPropsAtom = atom({
  opacity: 0,
  scale: 0.9,
})
