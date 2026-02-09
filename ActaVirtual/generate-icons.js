const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const logoPath = './assets/logo.png';

// Configuración de iconos Android
const androidSizes = [
  { size: 48, folder: 'mipmap-mdpi' },
  { size: 72, folder: 'mipmap-hdpi' },
  { size: 96, folder: 'mipmap-xhdpi' },
  { size: 144, folder: 'mipmap-xxhdpi' },
  { size: 192, folder: 'mipmap-xxxhdpi' },
];

// Configuración de iconos iOS
const iosSizes = [
  { size: 20, scale: 1, name: 'Icon-20.png' },
  { size: 40, scale: 2, name: 'Icon-20@2x.png' },
  { size: 60, scale: 3, name: 'Icon-20@3x.png' },
  { size: 29, scale: 1, name: 'Icon-29.png' },
  { size: 58, scale: 2, name: 'Icon-29@2x.png' },
  { size: 87, scale: 3, name: 'Icon-29@3x.png' },
  { size: 40, scale: 1, name: 'Icon-40.png' },
  { size: 80, scale: 2, name: 'Icon-40@2x.png' },
  { size: 120, scale: 3, name: 'Icon-40@3x.png' },
  { size: 120, scale: 2, name: 'Icon-60@2x.png' },
  { size: 180, scale: 3, name: 'Icon-60@3x.png' },
  { size: 76, scale: 1, name: 'Icon-76.png' },
  { size: 152, scale: 2, name: 'Icon-76@2x.png' },
  { size: 167, scale: 2, name: 'Icon-83.5@2x.png' },
  { size: 1024, scale: 1, name: 'Icon-1024.png' },
];

async function generateAndroidIcons() {
  console.log('Generando iconos para Android...');
  
  for (const config of androidSizes) {
    // Icono normal
    const outputPath = path.join(__dirname, 'android', 'app', 'src', 'main', 'res', config.folder, 'ic_launcher.png');
    await sharp(logoPath)
      .resize(config.size, config.size)
      .png()
      .toFile(outputPath);
    console.log(`✓ Generado ${config.folder}/ic_launcher.png (${config.size}x${config.size})`);
    
    // Icono round (mismo tamaño)
    const outputPathRound = path.join(__dirname, 'android', 'app', 'src', 'main', 'res', config.folder, 'ic_launcher_round.png');
    await sharp(logoPath)
      .resize(config.size, config.size)
      .png()
      .toFile(outputPathRound);
    console.log(`✓ Generado ${config.folder}/ic_launcher_round.png (${config.size}x${config.size})`);
  }
}

async function generateiOSIcons() {
  console.log('\nGenerando iconos para iOS...');
  
  const iosPath = path.join(__dirname, 'ios', 'AlignMe', 'Images.xcassets', 'AppIcon.appiconset');
  
  if (!fs.existsSync(iosPath)) {
    fs.mkdirSync(iosPath, { recursive: true });
  }
  
  for (const config of iosSizes) {
    const outputPath = path.join(iosPath, config.name);
    await sharp(logoPath)
      .resize(config.size, config.size)
      .png()
      .toFile(outputPath);
    console.log(`✓ Generado ${config.name} (${config.size}x${config.size})`);
  }
  
  // Generar Contents.json para iOS
  const contentsJson = {
    images: [
      { size: '20x20', idiom: 'iphone', filename: 'Icon-20@2x.png', scale: '2x' },
      { size: '20x20', idiom: 'iphone', filename: 'Icon-20@3x.png', scale: '3x' },
      { size: '29x29', idiom: 'iphone', filename: 'Icon-29@2x.png', scale: '2x' },
      { size: '29x29', idiom: 'iphone', filename: 'Icon-29@3x.png', scale: '3x' },
      { size: '40x40', idiom: 'iphone', filename: 'Icon-40@2x.png', scale: '2x' },
      { size: '40x40', idiom: 'iphone', filename: 'Icon-40@3x.png', scale: '3x' },
      { size: '60x60', idiom: 'iphone', filename: 'Icon-60@2x.png', scale: '2x' },
      { size: '60x60', idiom: 'iphone', filename: 'Icon-60@3x.png', scale: '3x' },
      { size: '20x20', idiom: 'ipad', filename: 'Icon-20.png', scale: '1x' },
      { size: '20x20', idiom: 'ipad', filename: 'Icon-20@2x.png', scale: '2x' },
      { size: '29x29', idiom: 'ipad', filename: 'Icon-29.png', scale: '1x' },
      { size: '29x29', idiom: 'ipad', filename: 'Icon-29@2x.png', scale: '2x' },
      { size: '40x40', idiom: 'ipad', filename: 'Icon-40.png', scale: '1x' },
      { size: '40x40', idiom: 'ipad', filename: 'Icon-40@2x.png', scale: '2x' },
      { size: '76x76', idiom: 'ipad', filename: 'Icon-76.png', scale: '1x' },
      { size: '76x76', idiom: 'ipad', filename: 'Icon-76@2x.png', scale: '2x' },
      { size: '83.5x83.5', idiom: 'ipad', filename: 'Icon-83.5@2x.png', scale: '2x' },
      { size: '1024x1024', idiom: 'ios-marketing', filename: 'Icon-1024.png', scale: '1x' }
    ],
    info: {
      version: 1,
      author: 'xcode'
    }
  };
  
  fs.writeFileSync(
    path.join(iosPath, 'Contents.json'),
    JSON.stringify(contentsJson, null, 2)
  );
  console.log('✓ Generado Contents.json');
}

async function main() {
  try {
    await generateAndroidIcons();
    await generateiOSIcons();
    console.log('\n✅ Todos los iconos generados correctamente!');
    console.log('\nPróximos pasos:');
    console.log('- Para Android: Ejecuta "cd android && ./gradlew clean"');
    console.log('- Para iOS: Abre Xcode y limpia el build (Cmd+Shift+K)');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();
