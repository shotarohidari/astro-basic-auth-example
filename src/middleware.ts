import { defineMiddleware } from "astro:middleware"

export const onRequest = defineMiddleware(async ({ request }, next) => {
  const { pathname } = new URL(request.url)
  const { headers } = request

  if (/\/secret\/?/.test(pathname)) {
    const credentials = headers.get("authorization")
    if (!credentials) {
      return new Response("Unauthorized", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="safe-space"',
        },
      })
    }
    const idPassPair = credentials.split(" ")[1]

    if (!idPassPair) {
      return new Response("Unauthorized", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="safe-space"',
        },
      })
    }

    const [username, password] = atob(idPassPair).split(":");

    if (username !== "username" || password !== "password") {
      return new Response("Unauthorized", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="realm"',
        },
      })
    }
  }
  return next()
})
