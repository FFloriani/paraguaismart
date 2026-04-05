const fs = require('fs');

const harRaw = fs.readFileSync('_reverse_engineering/buser.har', 'utf8');
const har = JSON.parse(harRaw);
const entries = har.log.entries;

let out = "";
entries.forEach((e) => {
  const url = e.request.url;
  if (url.includes('api/search') || url.includes('origem') || url.includes('slug')) {
    out += `\n\n=== URL: ${url} ===\n`;
    out += `METHOD: ${e.request.method}\n`;
    if (e.request.postData && e.request.postData.text) {
       out += `PAYLOAD:\n${e.request.postData.text}\n`;
    }
    const text = e.response.content.text;
    if (text) out += `RESPONSE:\n${text.substring(0, 1000)}\n`;
  }
});

fs.writeFileSync('buser_debug.txt', out, 'utf8');
console.log("Written to buser_debug.txt");
