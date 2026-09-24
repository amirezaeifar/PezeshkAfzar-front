const fs = require('fs')
const path = require('path')
const { chromium } = require('C:/Users/acer/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')

const root = process.cwd()
const sourceDir = path.join(root, 'tmp', 'image-recovery')

const jobs = [
  // Home: high-resolution real medical photography with restrained orange interface cues.
  ['doctor-care-candidate.jpg', 'public/images/home-real/hero-960.webp', 960, 1200, .48, .50, 'dashboard'],
  ['doctor-care-candidate.jpg', 'public/images/home-real/hero-1600.webp', 1600, 2000, .48, .50, 'dashboard'],
  ['equip-photo-1683727027478-5df5f0c89d27.jpg', 'public/images/home-real/hero-moment-720.webp', 720, 900, .52, .58, 'timeline'],
  ['doctor-patient-premium.jpg', 'public/images/home-real/mission-care-960.webp', 960, 1140, .52, .48, 'care'],
  ['nurse-patient-premium.jpg', 'public/images/home-real/mission-clinical-840.webp', 840, 960, .56, .45, 'timeline'],
  ['equip-pexels-9951397.jpg', 'public/images/home-real/mission-vision-840.webp', 840, 960, .48, .50, 'scan'],
  ['doctor-care-candidate.jpg', 'public/images/home-real/care-partner-960.webp', 960, 720, .48, .48, 'dashboard'],
  ['doctor-care-candidate.jpg', 'public/images/home-real/care-partner-1600.webp', 1600, 1200, .48, .48, 'dashboard'],
  ['doctor-patient-premium.jpg', 'public/images/home-real/voice-consultation-720.webp', 720, 900, .52, .48, 'care'],
  ['doctor-care-candidate.jpg', 'public/images/home-real/voice-clinicians-720.webp', 720, 900, .48, .48, 'dashboard'],
  ['nurse-patient-premium.jpg', 'public/images/home-real/voice-bedside-720.webp', 720, 900, .56, .45, 'timeline'],
  ['equip-photo-1683727027478-5df5f0c89d27.jpg', 'public/images/home-real/voice-monitoring-720.webp', 720, 900, .52, .58, 'timeline'],
  ['equip-pexels-9951397.jpg', 'public/images/home-real/voice-vision-720.webp', 720, 900, .48, .50, 'scan'],
  ['doctor-patient-premium.jpg', 'public/images/home-real/software-pathway-1000.webp', 1000, 1250, .52, .48, 'timeline'],
  ['doctor-care-candidate.jpg', 'public/images/home-real/software-imaging-1000.webp', 1000, 1250, .48, .49, 'scan'],
  ['sunrise-original.jpg', 'public/images/home-real/software-medication-1000.webp', 1000, 1250, .48, .52, 'dashboard'],

  // Journal: clinical AI, medical software, governance, and human review.
  ['doctor-care-candidate.jpg', 'public/images/journal/clinical-boundaries-800.webp', 800, 500, .48, .48, 'dashboard'],
  ['doctor-care-candidate.jpg', 'public/images/journal/clinical-boundaries-1600.webp', 1600, 1000, .48, .48, 'dashboard'],
  ['sunrise-original.jpg', 'public/images/journal/interoperable-workflows-800.webp', 800, 500, .48, .52, 'timeline'],
  ['sunrise-original.jpg', 'public/images/journal/interoperable-workflows-1600.webp', 1600, 1000, .48, .52, 'timeline'],
  ['nurse-patient-premium.jpg', 'public/images/journal/human-in-loop-800.webp', 800, 500, .56, .46, 'care'],
  ['nurse-patient-premium.jpg', 'public/images/journal/human-in-loop-1600.webp', 1600, 1000, .56, .46, 'care'],
  ['nurse-patient-premium.jpg', 'public/images/journal/clinical-privacy-800.webp', 800, 500, .56, .46, 'triage'],
  ['nurse-patient-premium.jpg', 'public/images/journal/clinical-privacy-1600.webp', 1600, 1000, .56, .46, 'triage'],
  ['equip-pexels-9951397.jpg', 'public/images/journal/real-world-validation-800.webp', 800, 500, .48, .50, 'scan'],
  ['equip-pexels-9951397.jpg', 'public/images/journal/real-world-validation-1600.webp', 1600, 1000, .48, .50, 'scan'],
  ['equip-photo-1683727027478-5df5f0c89d27.jpg', 'public/images/journal/transparent-ai-800.webp', 800, 500, .52, .58, 'timeline'],
  ['equip-photo-1683727027478-5df5f0c89d27.jpg', 'public/images/journal/transparent-ai-1600.webp', 1600, 1000, .52, .58, 'timeline'],

  // Violence Detection: documentary care scenes with explicit review-only triage graphics.
  ['nurse-patient-premium.jpg', 'public/images/software/violence-detection-hero.webp', 1200, 1500, .56, .46, 'triage'],
  ['nurse-patient-premium.jpg', 'public/images/software/violence-detection-review.webp', 1400, 900, .54, .46, 'triage'],
  ['doctor-care-candidate.jpg', 'public/images/software/violence-detection-output.webp', 1400, 900, .48, .50, 'dashboard'],
]

async function main() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  })
  const page = await browser.newPage()

  for (const [source, output, width, height, focusX, focusY, overlay] of jobs) {
    const input = fs.readFileSync(path.join(sourceDir, source))
    const mime = source.endsWith('.png') ? 'image/png' : 'image/jpeg'
    const dataUrl = `data:${mime};base64,${input.toString('base64')}`
    const result = await page.evaluate(async ({ dataUrl, width, height, focusX, focusY, overlay }) => {
      const image = new Image()
      image.src = dataUrl
      await image.decode()

      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight)
      const sourceWidth = width / scale
      const sourceHeight = height / scale
      const maxX = Math.max(0, image.naturalWidth - sourceWidth)
      const maxY = Math.max(0, image.naturalHeight - sourceHeight)
      const sourceX = maxX * focusX
      const sourceY = maxY * focusY

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const context = canvas.getContext('2d')
      context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, height)

      // A consistent warm photographic grade; the underlying scene stays documentary.
      context.save()
      context.globalCompositeOperation = 'soft-light'
      context.fillStyle = 'rgba(255, 146, 92, 0.16)'
      context.fillRect(0, 0, width, height)
      context.restore()

      const orange = '#ff925c'
      const deep = 'rgba(0, 41, 0, .82)'
      const cream = '#f5f5e6'
      const unit = Math.max(width, height) / 1000
      const line = Math.max(2, 2.4 * unit)
      const roundedPanel = (x, y, w, h, radius = 18 * unit) => {
        context.beginPath()
        context.roundRect(x, y, w, h, radius)
        context.fillStyle = deep
        context.fill()
        context.strokeStyle = 'rgba(255, 146, 92, .72)'
        context.lineWidth = line
        context.stroke()
      }
      const label = (text, x, y, size = 14 * unit) => {
        context.font = `700 ${Math.max(10, size)}px Inter, Segoe UI, sans-serif`
        context.fillStyle = cream
        context.fillText(text, x, y)
      }

      if (overlay === 'dashboard') {
        const x = width * .07
        const y = height * .73
        const w = width * .86
        const h = height * .18
        roundedPanel(x, y, w, h)
        label('CLINICAL REVIEW', x + w * .06, y + h * .28, 15 * unit)
        context.strokeStyle = orange
        context.lineWidth = line * 1.5
        context.beginPath()
        for (let i = 0; i <= 7; i += 1) {
          const px = x + w * (.06 + i * .125)
          const py = y + h * (.72 - [0, .12, .05, .31, .18, .46, .33, .55][i])
          if (i === 0) context.moveTo(px, py)
          else context.lineTo(px, py)
        }
        context.stroke()
      }

      if (overlay === 'timeline') {
        const x = width * .08
        const y = height * .82
        const w = width * .84
        roundedPanel(x, y, w, height * .1, 999)
        context.strokeStyle = orange
        context.lineWidth = line
        context.beginPath()
        context.moveTo(x + w * .12, y + height * .05)
        context.lineTo(x + w * .88, y + height * .05)
        context.stroke()
        for (const step of [.18, .42, .67, .86]) {
          context.beginPath()
          context.arc(x + w * step, y + height * .05, 7 * unit, 0, Math.PI * 2)
          context.fillStyle = orange
          context.fill()
        }
      }

      if (overlay === 'scan' || overlay === 'triage') {
        const boxes = overlay === 'triage'
          ? [[.10, .16, .34, .62, 'TRACK 12'], [.48, .12, .39, .68, 'TRACK 27']]
          : [[.16, .20, .62, .55, 'REVIEW REGION']]
        context.lineWidth = line * 1.6
        context.strokeStyle = orange
        for (const [bx, by, bw, bh, text] of boxes) {
          context.strokeRect(width * bx, height * by, width * bw, height * bh)
          context.fillStyle = orange
          context.fillRect(width * bx, height * by, Math.min(width * bw, 140 * unit), 25 * unit)
          context.font = `800 ${12 * unit}px Inter, Segoe UI, sans-serif`
          context.fillStyle = '#002900'
          context.fillText(text, width * bx + 7 * unit, height * by + 17 * unit)
        }
        if (overlay === 'triage') {
          const x = width * .10
          const y = height * .84
          const w = width * .8
          roundedPanel(x, y, w, height * .095, 13 * unit)
          label('possible_physical_contact  ·  HUMAN REVIEW REQUIRED', x + 18 * unit, y + height * .057, 13 * unit)
        }
      }

      if (overlay === 'care') {
        const gradient = context.createRadialGradient(width * .82, height * .16, 0, width * .82, height * .16, width * .34)
        gradient.addColorStop(0, 'rgba(255, 146, 92, .42)')
        gradient.addColorStop(1, 'rgba(255, 146, 92, 0)')
        context.fillStyle = gradient
        context.fillRect(0, 0, width, height)
        context.strokeStyle = orange
        context.lineWidth = line
        context.beginPath()
        context.arc(width * .84, height * .17, width * .09, 0, Math.PI * 1.55)
        context.stroke()
      }

      return canvas.toDataURL('image/webp', 0.9)
    }, { dataUrl, width, height, focusX, focusY, overlay })

    const outputPath = path.join(root, output)
    fs.mkdirSync(path.dirname(outputPath), { recursive: true })
    fs.writeFileSync(outputPath, Buffer.from(result.split(',')[1], 'base64'))
  }

  await browser.close()
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
