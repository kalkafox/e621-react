import { z } from 'zod'
import { publicProcedure, router } from '@/server/trpc'
import { E621Post } from '@/e621'
export const appRouter = router({
  hello: publicProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query(({ input }) => {
      return {
        greeting: `hello ${input.text || 'world'}`,
      }
    }),
  post: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const res = await fetch('https://e621.net/posts/' + input.id + '.json', {
        headers: {
          'User-Agent': 'e621-trpc/1.0 (by @kalkaio)',
        },
      })
      if (!res.ok) throw new Error('failed to fetch post' + res.statusText)
      const json = (await res.json()) as { post: E621Post }

      if (
        typeof json === 'object' &&
        json &&
        'post' in json &&
        typeof json.post === 'object' &&
        json.post
      ) {
        return json.post
      }
    }),
  posts: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
      }),
    )
    .query(async ({ input }) => {
      const res = await fetch(
        'https://e621.net/posts.json?tags=order:score+m/m+-female&limit=' + 25,
        {
          headers: {
            'User-Agent': 'e621-trpc/1.0 (by @kalkaio)',
          },
        },
      )
      if (!res.ok) throw new Error('failed to fetch posts' + res.statusText)
      const json = (await res.json()) as { posts: E621Post[] }

      if (
        typeof json === 'object' &&
        json &&
        'posts' in json &&
        Array.isArray(json.posts)
      ) {
        return json.posts
      }
    }),
})
// export type definition of API
export type AppRouter = typeof appRouter
