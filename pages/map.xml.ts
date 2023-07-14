const EXTERNAL_DATA_URL = 'https://board.is-an.app/bin';

function generateSiteMap(boards) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>https://board.is-an.app/home</loc>
       <priority>1.00</priority>
     </url>
     <url>
     <loc>https://board.is-an.app</loc>
       <priority>0.90</priority>
     </url>
     <url>
       <loc>https://board.is-an.app/privacy</loc>
       <priority>0.85</priority>
     </url>
     <url>
       <loc>https://board.is-an.app/docs</loc>
       <priority>0.80</priority>
     </url>
     <url>
       <loc>https://board.is-an.app/docs/ping</loc>
       <priority>0.80</priority>
     </url>
     <url>
       <loc>https://board.is-an.app/docs/teapot</loc>
       <priority>0.80</priority>
     </url>
     <url>
       <loc>https://board.is-an.app/docs/save</loc>
       <priority>0.80</priority>
     </url>
     <url>
       <loc>https://board.is-an.app/docs/fetch</loc>
       <priority>0.80</priority>
     </url>
     <url>
       <loc>https://board.is-an.app/map.xml</loc>
       <priority>0.70</priority>
     </url>
     ${boards
       .map((key) => {
         return `
       <url>
           <loc>${`${EXTERNAL_DATA_URL}/${key}`}</loc>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  // We make an API call to gather the URLs for our site
  const request = await fetch('https://board.is-an.app/api/mass-fetch', {
    headers: {
      Authorization: process.env.NEXT_PUBLIC_KEY,
      'Content-Type': 'application/json',
    },
  });

  const boards = await request.json();

  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap(boards.keys);

  res.setHeader('Content-Type', 'text/xml');
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export const runtime = 'experimental-edge';

export default SiteMap;
