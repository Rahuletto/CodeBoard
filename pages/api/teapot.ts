// Edge Function
export const config = {
  runtime: 'edge' 
};
 
 
export default async function GET() {
  return new Response("Im a teapot now",
    {
      status: 418,
    }
  )
}
