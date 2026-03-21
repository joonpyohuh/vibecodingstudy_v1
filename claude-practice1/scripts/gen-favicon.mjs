import sharp from 'sharp';
import toIco from 'to-ico';
import { writeFileSync } from 'fs';

const SRC = 'src/assets/ajou-logo.png';

// 16x16, 32x32, 48x48 멀티 해상도 ICO
const sizes = [16, 32, 48];
const buffers = await Promise.all(
  sizes.map(s => sharp(SRC).resize(s, s).png().toBuffer())
);
const ico = await toIco(buffers);
writeFileSync('public/favicon.ico', ico);
console.log('✓ public/favicon.ico 생성 완료');

// 180x180 Apple Touch Icon
await sharp(SRC).resize(180, 180).png().toFile('public/apple-touch-icon.png');
console.log('✓ public/apple-touch-icon.png 생성 완료');
