export default async function handler(req, res) {
  const r = await fetch('http://127.0.0.1:3000/api/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Wn9Kt18v9UlsrvDPkKEc',
    },
    body: JSON.stringify({
      name: 'test',
      description: 'e',
      files: [
        {
          name: 'unt.js',
          language: 'javascript',
          value: 'console.log("hello")',
        },
        {
            name: 'unt.js',
            language: 'javascript',
            value: 'console.log("hello")',
          },
          {
            name: 'unt.js',
            language: 'javascript',
            value: 'console.log("hello")',
          },
      ],
    }),
  });

  const re = await r.text();
  res.status(200).send(re);
}
