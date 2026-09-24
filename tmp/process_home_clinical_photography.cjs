const fs = require('fs')
const path = require('path')
const { chromium } = require('C:/Users/acer/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')

const root = process.cwd()
const source = (name) => path.join(root, 'tmp', 'home-clinical-sources', name)

/*
  Slot audit encoded in the output plan:
  Hero 3:4; inset 1:1; mission 4:3/3:4/1:1; voices 5:4;
  software 4:5; partner and journal 4:3. Copy is outside every image.
  Focus values keep the interaction or display inside the mobile safe area.
  Crop + resize + WebP compression only: no grade, overlay, retouch, or AI.
*/
const jobs = [
  ['1719492-mihewo4724.jpg', 'hero-960.webp', 960, 1200, .50, .50],
  ['1719492-mihewo4724.jpg', 'hero-1600.webp', 1600, 2000, .50, .50],
  ['1708392-mihewo4724.jpg', 'hero-moment-480.webp', 480, 480, .50, .48],
  ['1708392-mihewo4724.jpg', 'hero-moment-720.webp', 720, 720, .50, .48],
  ['1708382-mihewo4724.jpg', 'mission-consultation-960.webp', 960, 720, .50, .50],
  ['1700518-gebakax.jpg', 'mission-recovery-840.webp', 840, 1120, .46, .50],
  ['1430845-rawpixel.com.jpg', 'mission-digital-care-720.webp', 720, 720, .56, .50],
  ['1708612-SnapNest03.jpg', 'voice-listening-900.webp', 900, 720, .58, .48],
  ['1727378-mihewo4724.jpg', 'voice-senior-care-900.webp', 900, 720, .50, .48],
  ['1708394-mihewo4724.jpg', 'voice-checkup-900.webp', 900, 720, .50, .50],
  ['1708594-SnapNest03.jpg', 'voice-monitoring-900.webp', 900, 720, .48, .50],
  ['1605139-secildegirmenciler.jpg', 'voice-clinical-review-900.webp', 900, 720, .52, .48],
  ['1682242-cooper1629.jpg', 'software-data-1000.webp', 1000, 1250, .55, .50],
  ['1444737-rawpixel.com.jpg', 'software-tablet-1000.webp', 1000, 1250, .28, .55],
  ['1659676-MedPoint24.jpg', 'software-remote-care-1000.webp', 1000, 1250, .50, .48],
  ['1719488-mihewo4724.jpg', 'partner-team-960.webp', 960, 720, .50, .48],
  ['1719488-mihewo4724.jpg', 'partner-team-1600.webp', 1600, 1200, .50, .48],
  ['1446883-rawpixel.com.jpg', 'journal-care-plan-800.webp', 800, 600, .50, .50],
  ['1571895-rawpixel.com.jpg', 'journal-records-800.webp', 800, 600, .50, .50],
  ['1708614-SnapNest03.jpg', 'journal-consultation-800.webp', 800, 600, .50, .48],
]

async function main() {
  const outputDirectory = path.join(root, 'public', 'images', 'home-clinical')
  fs.mkdirSync(outputDirectory, { recursive: true })
  const browser = await chromium.launch({ channel: 'chrome', headless: true })
  const page = await browser.newPage()

  for (const [inputName, outputName, width, height, focusX, focusY] of jobs) {
    const input = fs.readFileSync(source(inputName))
    const dataUrl = `data:image/jpeg;base64,${input.toString('base64')}`
    const result = await page.evaluate(async ({ dataUrl, width, height, focusX, focusY }) => {
      const image = new Image()
      image.src = dataUrl
      await image.decode()
      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight)
      const cropWidth = width / scale
      const cropHeight = height / scale
      const cropX = Math.max(0, image.naturalWidth - cropWidth) * focusX
      const cropY = Math.max(0, image.naturalHeight - cropHeight) * focusY
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d').drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, width, height)
      return canvas.toDataURL('image/webp', .86)
    }, { dataUrl, width, height, focusX, focusY })
    fs.writeFileSync(path.join(outputDirectory, outputName), Buffer.from(result.split(',')[1], 'base64'))
  }
  await browser.close()
}

main().catch(error => { console.error(error); process.exitCode = 1 })
