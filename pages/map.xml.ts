const EXTERNAL_DATA_URL = 'https://codeboard.tech/bin';

function generateSiteMap(boards) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>https://codeboard.tech/home</loc>
       <priority>1.00</priority>
     </url>
     <url>
     <loc>https://codeboard.tech</loc>
       <priority>0.90</priority>
     </url>
     <url>
       <loc>https://codeboard.tech/privacy</loc>
       <priority>0.85</priority>
     </url>
     <url>
       <loc>https://codeboard.tech/docs</loc>
       <priority>0.80</priority>
     </url>
     <url>
       <loc>https://codeboard.tech/docs/ping</loc>
       <priority>0.80</priority>
     </url>
     <url>
       <loc>https://codeboard.tech/docs/teapot</loc>
       <priority>0.80</priority>
     </url>
     <url>
       <loc>https://codeboard.tech/docs/save</loc>
       <priority>0.80</priority>
     </url>
     <url>
       <loc>https://codeboard.tech/docs/fetch</loc>
       <priority>0.80</priority>
     </url>
     <url>
       <loc>https://codeboard.tech/map.xml</loc>
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
  const request = await fetch('https://codeboard.tech/api/mass-fetch', {
    headers: {
      Authorization: process.env.KEY,
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

export default SiteMap;
