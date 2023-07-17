// Edge Function
export const config = {
    runtime: 'edge' 
  };
   
   
  export default async function GET() {
    return new Response("Pong !",
      {
        status: 200,
      }
    )
  }
  