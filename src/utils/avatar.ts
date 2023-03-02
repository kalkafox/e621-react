import { useEffect, useState } from 'react'

const fetchAvatar = async (name: string) => {
  const response = await fetch(
    `https://api.adorable.io/avatars/285/${name}.png`,
  )
  return response.url
}

export const useAvatar = (name: string) => {
  const [avatar, setAvatar] = useState<string | null>(null)

  useEffect(() => {
    const getAvatar = async () => {
      const avatar = await fetchAvatar(name)
      setAvatar(avatar)
    }

    getAvatar()
  }, [name])

  return avatar
}
