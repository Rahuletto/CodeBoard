// Edge Function
export const config = {
  runtime: 'edge'
};

export default async function Index() {
  
  return new Response(JSON.stringify(
    {
      info: 'Welcome to CodeBoard API. You have 4 endpoint to use with CodeBoard',
      endpoints: [
        { endpoint: '/ping', usage: '/ping', method: "GET" },
        { endpoint: '/teapot', usage: '/teapot', method: "GET" },
        { endpoint: '/save', usage: '/save', method: "POST" },
        { endpoint: '/fetch', usage: '/fetch?id={key}', method: "GET" }, 
      ],
      documentation: "/docs/",
      package: "/docs/npm"
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
