const tabs = await fetch('http://127.0.0.1:9333/json').then((response) => response.json())
const tab = tabs.find((entry) => entry.url.includes('127.0.0.1:5190/life-in-motion'))
const socket = new WebSocket(tab.webSocketDebuggerUrl)

const expression = `JSON.stringify({
  innerWidth,
  scrollWidth: document.documentElement.scrollWidth,
  bodyWidth: document.body.scrollWidth,
  main: document.querySelector('.life-motion')?.getBoundingClientRect().toJSON(),
  hero: document.querySelector('.motion-hero')?.getBoundingClientRect().toJSON(),
  heroImage: {
    complete: document.querySelector('.hero-photo img')?.complete,
    naturalWidth: document.querySelector('.hero-photo img')?.naturalWidth,
    currentSrc: document.querySelector('.hero-photo img')?.currentSrc,
  },
  images: [...document.querySelectorAll('.life-motion img')].map((image) => ({
    src: image.currentSrc,
    loading: image.loading,
    complete: image.complete,
    naturalWidth: image.naturalWidth,
    rect: image.getBoundingClientRect().toJSON(),
  })),
})`

await new Promise((resolve, reject) => {
  socket.onopen = () => {
    socket.send(JSON.stringify({
      id: 1,
      method: 'Runtime.evaluate',
      params: { expression, returnByValue: true },
    }))
  }

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data)
    if (message.id !== 1) return
    console.log(message.result.result.value)
    socket.close()
    resolve()
  }

  socket.onerror = reject
})
