import { api } from '@/utils/api'
import { inter } from '@/utils/font'
import { Icon } from '@iconify/react'

import { useAtom, useSetAtom } from 'jotai'

import CountUp from 'react-countup'

import Image from 'next/image'

import { useSprings, animated as a, useTransition } from '@react-spring/web'
import { E621Post } from '@/e621'
import {
  loadProgressAtom,
  postAtom,
  postSizeAtom,
  postSpringPropsAtom,
} from '@/utils/atoms'
import { createRef, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

function Posts() {
  const posts = api.posts.useQuery(
    {},
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchInterval: false,
    },
  )

  const router = useRouter()

  // Get the route query (aka after the ? in the url)
  const { query } = router.query

  const progress = useSetAtom(loadProgressAtom)
  const [springs, set] = useSprings(
    posts.data ? posts.data.length : 0,
    (i) => ({
      opacity: 0,
      scale: 0.9,
      x: 0,
      y: 0,
      width: posts.data ? posts.data[i].preview.width + 20 : 0,
      height: posts.data ? posts.data[i].preview.height : 0,
      config: {
        friction: 10,
      },
    }),
  )

  const [hovered, setHovered] = useState(-1)
  // useEffect(() => {
  //   set((i) => ({
  //     opacity: 1,
  //     scale: 1,
  //     delay: i * 50,
  //   }))
  // }, [posts.data])

  const [postA, setPostAtom] = useAtom(postAtom)
  const [postSize, setPostSize] = useAtom(postSizeAtom)
  const [postSpringProps, setPostSpringProps] = useAtom(postSpringPropsAtom)
  return (
    <>
      <button
        className='bg-gray-800/50 backdrop-blur-lg p-2 top-14 left-2 rounded-xl fixed'
        onClick={(e) => {
          posts.refetch()
        }}>
        <Icon
          className='text-gray-300'
          icon='fontisto:spinner-rotate-forward'
        />
      </button>
      <div className='gap-y-14 grid portrait:grid-cols-2 min-[500px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 grid-cols-7 left-0 right-0 my-4 w-full justify-center items-center justify-items-center'>
        {posts.data &&
          springs.map((props, i, p) => {
            if (!posts.data) return <></>
            const post = posts.data[i] as E621Post
            if (postA && post.id === postA.id) {
              props.opacity.start(0)
              props.scale.start(0.9)
              return <></>
            }
            const colorValue = (post.score.up % post.score.down) * 255
            const ref = createRef<HTMLImageElement>()
            return (
              <a.div
                key={post.id}
                onMouseEnter={() => {
                  props.scale.start(1.05)
                  setHovered(i)
                }}
                onMouseLeave={() => {
                  props.scale.start(1)
                  setHovered(-1)
                }}
                onClick={() => {
                  progress((p) => 0)
                  setPostAtom(post)
                  props.opacity.start(0, {
                    config: {
                      friction: 26,
                    },
                  })
                  props.scale.start(1.8, {
                    config: {
                      friction: 26,
                    },
                    onRest: () => {
                      router.push(`/posts/${post.id}`)
                    },
                  })

                  setPostSize({
                    width: 0,
                    height: 0,
                  })

                  p.map((p) => {
                    if (p === props) return
                    p.opacity.start(0, {
                      config: {
                        friction: 26,
                      },
                    })
                  })
                }}
                style={{
                  //border: `2px solid rgba(${colorValue}, ${colorValue}, 0, 1)`,
                  ...props,
                  width: post.preview.width + 20,
                  height: post.preview.height,
                }}
                ref={ref}
                className={`bg-gray-900 rounded-lg`}>
                <>
                  {hovered === i && post.file.ext === 'webm' ? (
                    <video
                      width={post.preview.width + 20}
                      height={post.preview.height + 20}
                      className='rounded-lg'
                      autoPlay
                      muted>
                      {post.file.ext === 'webm' ? (
                        <source src={post.file.url} type='video/webm' />
                      ) : (
                        <source src={post.file.url} type='video/mp4' />
                      )}
                    </video>
                  ) : (
                    <Image
                      src={post.preview.url}
                      className='rounded-lg'
                      style={{
                        width: post.preview.width + 20,
                        maxHeight: 200,
                      }}
                      onLoadingComplete={() => {
                        progress((prev) => {
                          if (prev >= 15) return 100
                          return prev + 1
                        })
                        props.scale.start(1)
                        props.opacity.start(1)
                      }}
                      alt=''
                      width={post.preview.width + 20}
                      height={post.preview.height}
                    />
                  )}
                </>
                {/* {viewTransition((style, item) => {
                    if (item === -1)
                      return (
                        <Image
                          src={post.preview.url}
                          className='w-48 h-26 rounded-lg'
                          onLoadingComplete={() => {
                            progress((prev) => {
                              if (prev >= 15) return 100
                              return prev + 1
                            })
                          }}
                          alt=''
                          width={post.preview.width + 20}
                          height={post.preview.height}
                        />
                      )

                    if (hovered === i) {
                      return (
                        <video
                          width={post.preview.width + 20}
                          height={post.preview.height}
                          className='w-48 h-26 rounded-lg'
                          autoPlay
                          muted>
                          {post.file.ext === 'webm' ? (
                            <source src={post.file.url} type='video/webm' />
                          ) : (
                            <source src={post.file.url} type='video/mp4' />
                          )}
                        </video>
                      )
                    }
                    return (
                      <Image
                        src={post.preview.url}
                        className='w-48 h-26 rounded-lg'
                        onLoadingComplete={() => {
                          progress((prev) => {
                            if (prev >= 15) return 100
                            return prev + 1
                          })
                        }}
                        alt=''
                        width={post.preview.width + 20}
                        height={post.preview.height}
                      />
                    )
                  })} */}
                <div className='relative'>
                  <div
                    className={`bg-zinc-900 h-5 ${inter.className} text-xs text-center`}>
                    <span className='text-zinc-300 m-2'>
                      <Icon
                        icon='codicon:thumbsup'
                        inline={true}
                        className='inline text-emerald-400'
                      />
                      <CountUp
                        start={0}
                        end={
                          post.score.up > 1000
                            ? post.score.up / 1000
                            : post.score.up
                        }
                        suffix={post.score.up > 1000 ? 'k' : ''}
                        useEasing={true}
                        delay={0}>
                        {({ countUpRef }) => (
                          <span className='text-emerald-400' ref={countUpRef} />
                        )}
                      </CountUp>
                    </span>
                    <span className='text-zinc-300 m-2'>
                      <Icon
                        icon='codicon:thumbsdown'
                        inline={true}
                        className='inline text-red-400'
                      />
                      <CountUp
                        start={0}
                        end={
                          post.score.down > 1000
                            ? post.score.down / 1000
                            : Math.abs(post.score.down)
                        }
                        suffix={post.score.down > 1000 ? 'k' : ''}
                        useEasing={true}
                        delay={0}>
                        {({ countUpRef }) => (
                          <span className='text-red-400' ref={countUpRef} />
                        )}
                      </CountUp>
                    </span>

                    <span className='text-cyan-400 m-2'>
                      <Icon
                        icon='codicon:comment'
                        inline={true}
                        className='inline'
                      />
                      <CountUp
                        start={0}
                        end={
                          post.comment_count > 1000
                            ? post.comment_count / 1000
                            : post.comment_count
                        }
                        suffix={post.comment_count > 1000 ? 'k' : ''}
                        useEasing={true}
                        delay={0}>
                        {({ countUpRef }) => <span ref={countUpRef} />}
                      </CountUp>
                    </span>
                  </div>
                </div>
              </a.div>
            )
          })}
      </div>
    </>
  )
}

export default Posts
