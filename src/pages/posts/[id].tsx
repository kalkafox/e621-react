import { api } from '@/utils/api'
import {
  loadProgressAtom,
  postSizeAtom,
  postAtom as postA,
} from '@/utils/atoms'
import { useSpring, animated as a } from '@react-spring/web'
import { useAtom, useSetAtom } from 'jotai'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import Posts from '.'

function PostComponent() {
  const router = useRouter()
  const { id } = router.query
  const post = api.post.useQuery({ id: parseInt(id as string) })
  const ref = useRef<HTMLVideoElement>(null)
  const setLoadProgress = useSetAtom(loadProgressAtom)
  const setPostSize = useSetAtom(postSizeAtom)

  const [postAtom, setPostAtom] = useAtom(postA)

  useEffect(() => {
    if (post.data?.tags.artist?.includes('taga')) {
      router.push('/posts')
      return
    }
    const interval = setInterval(() => {
      setLoadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        } else {
          return prev + 5
        }
      })
    }, 100)
    // if (ref.current) {
    //   if (post.data?.file.ext === 'webm') {
    //     setLoadProgress(100)
    //     setPostSpring.start({
    //       opacity: 1,
    //       scale: 1,
    //     })
    //   }
    // }
    if (post.data) {
      setPostAtom(post.data)
    }
    return () => {
      clearInterval(interval)
    }
  }, [post.data, setLoadProgress, setPostAtom, router, setPostSize])

  return <></>
}

export default PostComponent
