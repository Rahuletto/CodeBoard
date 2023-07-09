// Edge Function
export const config = {
    runtime: 'edge' 
  };
   
   
  export default async function Ping() {
    return new Response("Pong !",
      {
        status: 200,
      }
    )
  }
  