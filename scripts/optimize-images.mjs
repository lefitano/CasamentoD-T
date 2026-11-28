/**
 * Otimiza as imagens dos noivos para o site: `npm run fotos`
 *
 * Lê os originais em fotos-originais/ (fora do Git) e grava as versões otimizadas
 * em public/images/ (no Git). Para uma foto nova, acrescente uma entrada em JOBS.
 *
 * - Fotos: WebP em várias larguras (o navegador baixa só a que a tela precisa),
 *   com tratamento de cor opcional e sem metadados (câmera, localização).
 * - Monograma: retira o fundo claro e pinta o traço de marfim, com fundo transparente.
 * - Prévia do link (WhatsApp): cartão 1200×630 com o monograma sobre o marinho.
 * - Presentes e história: fotos-originais/<pasta>/<nome>.jpg → public/images/<pasta>/<nome>.webp (4:5).
 *   Aceita JPG, PNG, WebP e HEIC (fotos do iPhone), convertido antes por heic-convert.
 */
import { mkdir, readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import heicConvert from 'heic-convert'
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
  {
    // Imagem da prévia do link (WhatsApp, redes): monograma sobre o marinho.
    // Usa o monograma gerado acima, por isso vem depois dele.
    kind: 'social',
    input: 'monograma.webp',
    name: 'og-monograma',
  },
  {
    // Ícone da aba do navegador (favicon) e da tela inicial do celular.
    kind: 'favicon',
    input: 'monograma.webp',
    sizes: [
      { size: 32, file: 'favicon-32.png' },
      { size: 180, file: 'apple-touch-icon.png' },
      { size: 192, file: 'icon-192.png' },
      { size: 512, file: 'icon-512.png' },
    ],
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

/**
 * Cartão de prévia do link: 1200×630 (formato grande do WhatsApp), em JPG,
 * com o monograma centralizado. O centro também funciona no recorte quadrado.
 */
async function social({ input, name }) {
  const W = 1200
  const H = 630
  const background = Buffer.from(
    `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs><radialGradient id="g" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stop-color="#1b2c4f"/><stop offset="100%" stop-color="${NAVY_950}"/>
      </radialGradient></defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
    </svg>`,
  )
  const mark = await sharp(path.join(OUTPUT, input)).resize({ height: 380 }).toBuffer()
  const file = path.join(OUTPUT, `${name}.jpg`)
  const info = await sharp(background)
    .composite([{ input: mark, gravity: 'center' }])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(file)
  return [`${file} (${info.width}×${info.height}, ${Math.round(info.size / 1024)} KB)`]
}

/**
 * Favicon: monograma marfim num quadrado marinho de cantos arredondados
 * (marfim puro sumiria numa aba clara). Nos tamanhos pequenos, os traços finos
 * são reforçados para não desaparecerem.
 * Os arquivos vão para public/ (raiz do site), onde navegadores e celulares os procuram.
 */
async function favicon({ input, sizes }) {
  const written = []
  for (const { size, file } of sizes) {
    const radius = Math.round(size * 0.22)
    const tile = Buffer.from(
      `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${size}" height="${size}" rx="${radius}" fill="#14213d"/>
      </svg>`,
    )
    const markWidth = Math.round(size * (size <= 48 ? 0.9 : 0.82))
    let mark = await sharp(path.join(OUTPUT, input))
      .resize({ width: markWidth })
      .raw()
      .toBuffer({ resolveWithObject: true })
    if (size <= 48) {
      // reforça os traços: aumenta a opacidade das bordas suaves do desenho
      const { data } = mark
      for (let i = 3; i < data.length; i += 4) data[i] = Math.min(255, data[i] * 2.6)
    }
    const markPng = await sharp(mark.data, { raw: mark.info }).png().toBuffer()
    const target = path.join('public', file)
    const info = await sharp(tile)
      .composite([{ input: markPng, gravity: 'center' }])
      .png({ compressionLevel: 9 })
      .toFile(target)
    written.push(`${target} (${info.width}×${info.height}, ${Math.round(info.size / 1024)} KB)`)
  }
  return written
}

const RUNNERS = { photo, monogram, social, favicon }

for (const job of JOBS) {
  const written = await RUNNERS[job.kind](job)
  console.log(`✓ ${job.input}`)
  for (const line of written) console.log(`   → ${line}`)
}

/**
 * Pastas processadas automaticamente: tudo o que estiver em fotos-originais/<pasta>/
 * vira public/images/<pasta>/<nome>.webp, recortado no formato usado no site (4:5).
 * O nome sai do nome do arquivo, em minúsculas e sem acentos (ex.: "Pedido.JPG" → pedido.webp).
 * - presentes: o nome deve bater com o `src` em src/content/gifts.ts
 * - historia: fotos dos momentos (src/content/moments.ts); maiores, porque aparecem grandes
 */
const FOLDERS = [
  { folder: 'presentes', width: 640, height: 800 },
  { folder: 'historia', width: 800, height: 1000 },
]

function slug(file) {
  return path
    .parse(file)
    .name.toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // tira os acentos
    .replace(/[^a-z0-9-]+/g, '-')
}

/**
 * O sharp não lê HEIC (formato padrão das fotos do iPhone): convertemos antes para JPEG
 * em qualidade máxima, e o resto do processo segue igual. A orientação já vem aplicada.
 */
async function readPhoto(file) {
  if (!/\.hei[cf]$/i.test(file)) return file
  const jpeg = await heicConvert({ buffer: await readFile(file), format: 'JPEG', quality: 1 })
  return Buffer.from(jpeg)
}

for (const { folder, width, height } of FOLDERS) {
  const sourceDir = path.join(SOURCE, folder)
  const outputDir = path.join(OUTPUT, folder)
  const files = await readdir(sourceDir).catch(() => [])
  const photos = files.filter((f) => /\.(jpe?g|png|webp|tiff?|hei[cf])$/i.test(f))
  const ignored = files.filter((f) => !photos.includes(f) && !f.startsWith('.'))

  if (photos.length > 0) {
    await mkdir(outputDir, { recursive: true })
    console.log(`✓ ${folder} (${photos.length})`)
    for (const file of photos) {
      const target = path.join(outputDir, `${slug(file)}.webp`)
      const info = await sharp(await readPhoto(path.join(sourceDir, file)))
        .rotate() // respeita a orientação da foto do celular
        .resize({ width, height, fit: 'cover', position: sharp.strategy.attention })
        .webp({ quality: 80, effort: 6 })
        .toFile(target)
      console.log(
        `   → ${target} (${info.width}×${info.height}, ${Math.round(info.size / 1024)} KB)`,
      )
    }
  }
  for (const file of ignored) {
    console.log(`   ! ignorado: ${folder}/${file} (use JPG, PNG, WebP ou HEIC)`)
  }
}
