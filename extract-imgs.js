const fs = require('fs');
const html = fs.readFileSync('brm-leds-v4.html', 'utf8');

const imgRegex = /src="(data:image\/[^"]+)"/g;
let m, i = 1;
const names = ['brm-overview', 'brm-upper', 'brm-lower'];

if (!fs.existsSync('public')) fs.mkdirSync('public');

while ((m = imgRegex.exec(html)) !== null) {
  const dataUrl = m[1];
  const ext = dataUrl.match(/data:image\/(\w+)/)[1];
  const b64 = dataUrl.split(',')[1];
  const buf = Buffer.from(b64, 'base64');
  const name = (names[i - 1] || 'brm-img' + i) + '.' + (ext === 'jpeg' ? 'jpg' : ext);
  fs.writeFileSync('public/' + name, buf);
  console.log('Saved:', name, buf.length, 'bytes');
  i++;
}
console.log('Done — total images:', i - 1);
