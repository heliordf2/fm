const pages = [
  'https://onlineradiobox.com/br/89-a-radio-rock/',
  'https://onlineradiobox.com/br/89aradiorocksp/',
  'https://onlineradiobox.com/br/891fm/',
  'https://onlineradiobox.com/br/radiorocksp/',
  'https://onlineradiobox.com/br/89fm-saopaulo/',
]

for (const page of pages) {
  try {
    const res = await fetch(page)
    const html = await res.text()
    const og = html.match(/property="og:image" content="([^"]+)"/)
    const title = html.match(/<title>([^<]+)<\/title>/)
    if (!title?.[1] || title[1].includes('Free online')) continue
    console.log(page)
    console.log(' ', title[1].slice(0, 100))
    console.log(' ', og?.[1])
    console.log('')
  } catch (err) {
    console.log('FAIL', page)
  }
}

fetch('https://de1.api.radio-browser.info/json/stations/byname/89%20FM%20A%20Radio%20Rock')
  .then((r) => r.json())
  .then((d) => console.log('RB', JSON.stringify(d, null, 2)))
