const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
(async ()=>{
  try{
    const svgPath = path.join(__dirname, '..', 'public', 'screenshot.svg');
    const outPath = path.join(__dirname, '..', 'public', 'screenshot.png');
    if(!fs.existsSync(svgPath)){
      console.error('SVG not found at', svgPath); process.exit(1);
    }
    const svg = fs.readFileSync(svgPath);
    // render at 2x for high quality
    await sharp(svg).png({ compressionLevel: 9 }).resize(720, 1560).toFile(outPath);
    console.log('Wrote PNG to', outPath);
  }catch(e){
    console.error(e);
    process.exit(2);
  }
})();
