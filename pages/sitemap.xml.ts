const EXTERNAL_DATA_URL = 'https://cdeboard.vercel.app/bin';

function generateSiteMap(boards) {
  console.log(boards);
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>https://cdeboard.vercel.app</loc>
     </url>
     <url>
       <loc>https://cdeboard.vercel.app/home</loc>
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
  console.log('im here')
  const request = await fetch('https://3000--main--codeboard--rahuletto--oe34ia8bl7m1u.pit-1.try.coder.app/api/fetchAll', {
    headers: {
      Authorization: process.env.NEXT_PUBLIC_KEY,
      'Content-Type': 'application/json'
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
