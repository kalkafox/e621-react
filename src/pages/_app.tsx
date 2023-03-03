import '@/styles/globals.css'
import type { AppProps } from 'next/app'

import { Icon } from '@iconify/react'
import { api } from '@/utils/api'
import { useSpring, useSprings, animated as a } from '@react-spring/web'
import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import {
  loadProgressAtom,
  postAtom,
  postSizeAtom,
  postSpringPropsAtom,
} from '@/utils/atoms'
import Warning from '@/components/Warning'
import { Partytown } from '@builder.io/partytown/react'
import Head from 'next/head'
import CountUp from 'react-countup'

import Image from 'next/image'
import { useRouter } from 'next/router'

function App({ Component, pageProps }: AppProps) {
  const [post, setPost] = useAtom(postAtom)
  const [ready, setReady] = useState(false)
  const router = useRouter()
  const [loadBgSpring, setLoadBgSpring] = useSpring(() => ({
    opacity: 1,
  }))

  const [loadSpring, setLoadSpring] = useSpring(() => ({
    width: '0%',
    opacity: 1,
  }))

  const [postSpringProps, setPostSpringProps] = useAtom(postSpringPropsAtom)

  const [postSpring, setPostSpring] = useSpring(() => ({
    ...postSpringProps,
    config: {
      friction: 25,
    },
  }))

  const [progress, setProgress] = useAtom(loadProgressAtom)

  const [postSize, setPostSize] = useAtom(postSizeAtom)

  useEffect(() => {
    if (progress === 0) {
      setLoadSpring.set({
        width: '0%',
      })

      // This is separate because we want to animate the opacity, but reset the width immediately
      setLoadSpring.start({
        opacity: 1,
      })

      setLoadBgSpring.start({
        opacity: 1,
      })
    }
    setLoadSpring.start({
      width: `${progress}%`,
      onChange: (props) => {
        if (props.value.width === '100%') {
          setLoadSpring.start({
            opacity: 0,
            delay: 500,
          })
          setLoadBgSpring.start({
            opacity: 0,
            delay: 1000,
          })
        }
      },
    })
  }, [progress, setLoadSpring, setLoadBgSpring])

  useEffect(() => {
    if (!post) {
      setPostSpring.start({ opacity: 0 })
      return
    }
    if (post.tags.artist.includes('taga')) {
      router.push('/posts')
      return
    }
    if (post.file.ext === 'webm') {
      setProgress(100)
      setPostSpring.start({
        opacity: 1,
        scale: 1,
      })
    }
  }, [post, setProgress, setPostSpring, router])

  return (
    <>
      <Head>
        <Partytown />
      </Head>
      <div className='bg-gray-900 w-full h-full fixed' />
      {ready && (
        <>
          <a.div
            style={loadBgSpring}
            className='bg-gray-800/50 backdrop-blur-lg w-full h-2 fixed z-10'>
            <a.div style={loadSpring} className='bg-gray-600 h-full' />
          </a.div>
          <div className='absolute w-full h-16'>
            <span className='fixed z-10'>
              <button
                className='bg-gray-800/50 backdrop-blur-lg p-2 top-4 left-2 rounded-xl absolute'
                onClick={(e) => {
                  // TODO: Make the back button work with the back button on the element
                  setProgress(0)
                  setPostSpring.start({
                    scale: 0.5,
                    onRest: () => router.push('/posts'),
                    onChange: (props) => {
                      // setPostSize to the center of the screen viewport using the width  and height of the post, and the width and height of the screen, and the element scale
                      post &&
                        setPostSize({
                          width: postSpring.scale.get() * post.sample.width,
                          height: postSpring.scale.get() * post.sample.height,
                        })
                    },
                  })
                }}>
                <Icon
                  className='text-gray-300'
                  icon='material-symbols:arrow-back'
                />
              </button>
              <Icon
                className='absolute top-[25px] left-[58px] text-gray-300 z-10'
                icon='material-symbols:search-rounded'
              />
              <input
                type='text'
                className='bg-gray-800/60 backdrop-blur-lg text-gray-300 w-48 h-8 grid justify-center items-center rounded-lg pl-8 mt-4 ml-12'
                placeholder='Search...'
              />
            </span>
            {post && (
              <a.div
                style={postSpring}
                className='my-4 grid justify-center overflow-hidden'>
                {post && post.file.ext === 'webm' ? (
                  <video
                    width={post.file.width + 20}
                    height={post.file.height + 20}
                    className='rounded-lg'
                    autoPlay
                    controls
                    muted>
                    {post.file.ext === 'webm' ? (
                      <source src={post.file.url} type='video/webm' />
                    ) : (
                      <source src={post.file.url} type='video/mp4' />
                    )}
                  </video>
                ) : (
                  post && (
                    <Image
                      unoptimized
                      width={postSize.width - 100}
                      height={postSize.height - 100}
                      alt={post.tags.general.join(' ')}
                      onLoadingComplete={() => {
                        setProgress(100)
                        setPostSize({
                          width: post.file.width,
                          height: post.file.height,
                        })
                        setPostSpring.start({
                          opacity: 1,
                          scale: 1,
                        })
                      }}
                      src={post.file.url as string}
                      priority
                    />
                  )
                )}
              </a.div>
            )}
            <Component {...pageProps} />
          </div>
        </>
      )}
      <Warning setReady={setReady} />
    </>
  )
}

export default api.withTRPC(App)
