// Edge Function
export const config = {
  runtime: 'edge' 
};
 
 
export default async function Teapot() {
  return new Response("Im a teapot now",
    {
      status: 418,
    }
  )
}
