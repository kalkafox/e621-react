import { api } from '@/utils/api'
import { loadProgressAtom } from '@/utils/atoms'
import { useSpring, animated as a } from '@react-spring/web'
import { readFile } from 'fs'
import { useSetAtom } from 'jotai'
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

  const [postSpring, setPostSpring] = useSpring(() => ({
    opacity: 0,
    scale: 0.9,
    config: {
      friction: 25,
    },
  }))

  useEffect(() => {
    if (ref.current) {
      if (post.data?.file.ext === 'webm') {
        setLoadProgress(100)
        setPostSpring.start({
          opacity: 1,
          scale: 1,
        })
      }
    }
  }, [post.data?.file.ext, setLoadProgress])

  return (
    <a.div
      style={postSpring}
      className='my-4 grid justify-center overflow-hidden'>
      {post.data && post.data.file.ext === 'webm' ? (
        <video
          ref={ref}
          width={post.data.file.width + 20}
          height={post.data.file.height + 20}
          className='rounded-lg'
          autoPlay
          controls
          muted>
          {post.data.file.ext === 'webm' ? (
            <source src={post.data.file.url} type='video/webm' />
          ) : (
            <source src={post.data.file.url} type='video/mp4' />
          )}
        </video>
      ) : (
        post.data && (
          <Image
            width={post.data?.file.width - 100}
            height={post.data?.file.height - 100}
            alt={post.data?.tags.general.join(' ')}
            onLoadingComplete={() => {
              setLoadProgress(100)
              setPostSpring.start({
                opacity: 1,
                scale: 1,
              })
            }}
            src={post.data?.file.url as string}
          />
        )
      )}
      <button
        onClick={() => {
          setLoadProgress(0)
          router.push('/posts')
        }}>
        Return back
      </button>
    </a.div>
  )
}

export default PostComponent
