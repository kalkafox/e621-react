import '@/styles/globals.css'
import type { AppProps } from 'next/app'

import { Icon } from '@iconify/react'
import { api } from '@/utils/api'
import { useSpring, animated as a } from '@react-spring/web'
import { useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'
import { loadProgressAtom } from '@/utils/atoms'
import Warning from '@/components/Warning'

function App({ Component, pageProps }: AppProps) {
  const [ready, setReady] = useState(false)
  const [loadBgSpring, setLoadBgSpring] = useSpring(() => ({
    opacity: 1,
  }))

  const [loadSpring, setLoadSpring] = useSpring(() => ({
    width: '0%',
    opacity: 1,
  }))

  const progress = useAtomValue(loadProgressAtom)

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
          setTimeout(() => {
            setLoadSpring.start({
              opacity: 0,
            })
            setLoadBgSpring.start({
              opacity: 0,
            })
          }, 1000)
        }
      },
    })
  }, [progress])

  return (
    <>
      <div className='bg-gray-900 w-full h-full fixed' />
      {ready && (
        <>
          <a.div
            style={loadBgSpring}
            className='bg-gray-800/50 backdrop-blur-lg w-full h-2 fixed z-10'>
            <a.div style={loadSpring} className='bg-gray-600 h-full' />
          </a.div>
          <div className='absolute w-full'>
            <Icon
              className='absolute top-[17px] left-6 text-gray-300'
              icon='material-symbols:search-rounded'
            />
            <input
              type='text'
              className='bg-gray-800 text-gray-300 w-48 h-8 grid justify-center items-center rounded-lg pl-8 mt-2 ml-4'
              placeholder='Search...'
            />
            <Component {...pageProps} />
          </div>
        </>
      )}
      <Warning setReady={setReady} />
    </>
  )
}

export default api.withTRPC(App)
