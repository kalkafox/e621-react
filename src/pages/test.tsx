import { useRouter } from 'next/router'

export default function Test() {
  const router = useRouter()
  return (
    <>
      <button
        onClick={() => {
          router.push('/')
        }}
        className='text-zinc-300'>
        Main Menu
      </button>
    </>
  )
}
