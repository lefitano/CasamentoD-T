/**
 * Otimiza as imagens dos noivos para o site: `npm run fotos`
 *
 * Lê os originais em fotos-originais/ (fora do Git) e grava as versões otimizadas
 * em public/images/ (no Git). Para uma foto nova, acrescente uma entrada em JOBS.
 *
 * - Fotos: WebP em várias larguras (o navegador baixa só a que a tela precisa),
 *   com tratamento de cor opcional e sem metadados (câmera, localização).
 * - Monograma: retira o fundo claro e pinta o traço de marfim, com fundo transparente.
 */
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const SOURCE = 'fotos-originais'
const OUTPUT = 'public/images'

/** Cores da paleta (src/styles/tokens.css) */
const NAVY_950 = '#0a1222'
const ROYAL_600 = { r: 46, g: 74, b: 125 }
const IVORY_50 = { r: 251, g: 250, b: 247 }

/**
 * Tratamento de cor que aproxima a foto da paleta marinho:
 * menos saturação, um pouco menos de brilho e um véu azul real em "luz suave".
 * Aprovado em 23/11 (versão do meio da comparação).
 */
const NAVY_GRADE = { saturation: 0.72, brightness: 0.95, overlayAlpha: 0.5 }

const JOBS = [
  {
    kind: 'photo',
    input: 'imagem-igreja.PNG',
    name: 'home/igreja',
    widths: [640, 960, 1280],
    grade: NAVY_GRADE,
  },
  {
    kind: 'monogram',
    input: 'monograma.JPG',
    name: 'monograma',
    width: 640,
  },
]

async function photo({ input, name, widths, grade }) {
  const source = path.join(SOURCE, input)
  const { width: originalWidth } = await sharp(source).metadata()
  // Não amplia além do original: a maior versão fica no tamanho real da foto
  const targets = [...new Set(widths.map((w) => Math.min(w, originalWidth)))]

  const written = []
  for (const width of targets) {
    let image = sharp(source).flatten({ background: NAVY_950 }).resize({ width })
    if (grade) {
      const { height } = await image
        .clone()
        .toBuffer({ resolveWithObject: true })
        .then((r) => r.info)
      const overlay = await sharp({
        create: {
          width,
          height,
          channels: 4,
          background: { ...ROYAL_600, alpha: grade.overlayAlpha },
        },
      })
        .png()
        .toBuffer()
      image = sharp(
        await image
          .modulate({ saturation: grade.saturation, brightness: grade.brightness })
          .toBuffer(),
      ).composite([{ input: overlay, blend: 'soft-light' }])
    }
    const file = path.join(OUTPUT, `${name}-${width}.webp`)
    await mkdir(path.dirname(file), { recursive: true })
    // sem .withMetadata(): o sharp descarta EXIF/GPS por padrão
    const info = await image.webp({ quality: 80, effort: 6 }).toFile(file)
    written.push(`${file} (${info.width}×${info.height}, ${Math.round(info.size / 1024)} KB)`)
  }
  return written
}

async function monogram({ input, name, width }) {
  const source = path.join(SOURCE, input)

  // Recorta as margens brancas e reduz para o tamanho final
  const grey = await sharp(source)
    .greyscale()
    .trim({ threshold: 30 })
    .resize({ width })
    .raw()
    .toBuffer({ resolveWithObject: true })

  // Opacidade a partir do tom: fundo (~254) vira transparente, traço (~41) vira opaco;
  // os tons intermediários mantêm as bordas suaves das curvas
  const BACKGROUND = 250
  const INK = 45
  const alpha = Buffer.alloc(grey.data.length)
  for (let i = 0; i < grey.data.length; i++) {
    const t = (BACKGROUND - grey.data[i]) / (BACKGROUND - INK)
    alpha[i] = Math.round(Math.min(Math.max(t, 0), 1) * 255)
  }

  const { width: w, height: h } = grey.info
  const file = path.join(OUTPUT, `${name}.webp`)
  await mkdir(path.dirname(file), { recursive: true })
  const info = await sharp({ create: { width: w, height: h, channels: 3, background: IVORY_50 } })
    .joinChannel(alpha, { raw: { width: w, height: h, channels: 1 } })
    .webp({ quality: 90, alphaQuality: 100, effort: 6 })
    .toFile(file)
  return [`${file} (${info.width}×${info.height}, ${Math.round(info.size / 1024)} KB)`]
}

for (const job of JOBS) {
  const written = job.kind === 'photo' ? await photo(job) : await monogram(job)
  console.log(`✓ ${job.input}`)
  for (const line of written) console.log(`   → ${line}`)
}
