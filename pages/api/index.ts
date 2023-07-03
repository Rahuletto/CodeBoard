// Edge Function
export const config = {
  runtime: 'edge'
};

export default async function Index() {
  return new Response(JSON.stringify(
    {
      info: 'Welcome to CodeBoard API. You have 1 endpoint to use with CodeBoard',
      get: [
        { endpoint: '/fetch', usage: '/fetch?id={key}' },
        { endpoint: '/teapot', usage: '/teapot' },
      ],
    }
  ),
    {
      status: 303,
      headers: {
        'content-type': 'application/json',
      }
    }
  )
}
