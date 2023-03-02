import { Inter } from 'next/font/google'

import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()
  return (
    <>
      <button
        onClick={() => {
          router.push('/test')
        }}
        className='text-zinc-300'>
        Test Route
      </button>
    </>
  )
}
