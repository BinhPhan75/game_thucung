import fs from 'node:fs';
const path='src/data/pictureAssets.json';
const assets=JSON.parse(fs.readFileSync(path,'utf8'));
const fullAnimals={'🐰':'1f407','🐱':'1f408','🐶':'1f415','🐭':'1f401','🐷':'1f416','🐮':'1f404','🐵':'1f412','🐯':'1f405','🐴':'1f40e'};
for(const [symbol,file] of Object.entries(fullAnimals)) {
  const target=`public/pictures/${file}.svg`;
  if(!fs.existsSync(target)) {
    const response=await fetch(`https://raw.githubusercontent.com/jdecked/twemoji/v16.0.1/assets/svg/${file}.svg`);
    if(!response.ok) throw Error(`${file}: ${response.status}`);
    const svg=await response.text();
    if(!svg.includes('<svg')) throw Error('Invalid illustration');
    fs.writeFileSync(target,svg);
  }
  assets[symbol]=file;
}
// For species without a full-body emoji, add a matching body to the original head.
for(const [symbol,head,color,limb] of [
  ['🐼','1f43c','#f8fafc','#292f33'],['🐨','1f428','#aab8c2','#8899a6'],
  ['🦁','1f981','#ffcc4d','#c1694f'],['🐻','1f43b','#c1694f','#8b5039'],
  ['🐸','1f438','#77b255','#5c913b'],
]) {
  const original=fs.readFileSync(`public/pictures/${head}.svg`,'utf8');
  const face=original.replace(/^.*?<svg[^>]*>/s,'').replace(/<\/svg>\s*$/,'');
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 110"><g stroke="${limb}" stroke-width="2"><ellipse cx="50" cy="73" rx="25" ry="26" fill="${color}"/><ellipse cx="24" cy="71" rx="9" ry="19" fill="${limb}" transform="rotate(20 24 71)"/><ellipse cx="76" cy="71" rx="9" ry="19" fill="${limb}" transform="rotate(-20 76 71)"/><ellipse cx="34" cy="98" rx="15" ry="9" fill="${limb}"/><ellipse cx="66" cy="98" rx="15" ry="9" fill="${limb}"/></g><ellipse cx="50" cy="76" rx="15" ry="17" fill="#fff" opacity=".45"/><g transform="translate(17 2) scale(1.83)">${face}</g></svg>`;
  const file=`whole-${head}`;
  fs.writeFileSync(`public/pictures/${file}.svg`,svg);assets[symbol]=file;
}
for(const [symbol,color,center] of [['🌸','#f9a8d4','#fbbf24'],['🌼','#fef08a','#f59e0b'],['🌻','#fbbf24','#92400e'],['🌷','#f472b6','#fbcfe8'],['🌹','#ef4444','#be123c']]) {
  const petals=symbol === '🌷'
    ? `<path d="M24 12Q37 14 43 24L50 5 57 24Q65 14 76 12V36Q76 61 50 61Q24 61 24 36Z" fill="${color}"/><path d="M50 58V29" stroke="#db2777" stroke-width="2"/>`
    : symbol === '🌹'
      ? `<path d="M50 4Q70 0 74 19Q94 28 79 45Q76 65 55 60Q30 69 22 49Q7 33 23 20Q25 1 50 4Z" fill="${color}"/><path d="M31 29Q50 11 69 28Q72 49 48 51Q33 49 35 33Q44 22 58 30Q64 40 49 42" fill="none" stroke="${center}" stroke-width="5" stroke-linecap="round"/>`
      : Array.from({length:8},(_,i)=>`<ellipse cx="50" cy="18" rx="12" ry="17" fill="${color}" transform="rotate(${i*45} 50 35)"/>`).join('');
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 110"><path d="M50 39V104" stroke="#15803d" stroke-width="7" stroke-linecap="round"/><path d="M49 87Q14 88 12 62Q43 59 49 87Z" fill="#22c55e"/><path d="M51 76Q86 77 88 51Q58 50 51 76Z" fill="#16a34a"/><path d="M19 68 48 86M80 58 52 75" stroke="#15803d" stroke-width="2"/>${petals}<circle cx="50" cy="35" r="13" fill="${center}"/></svg>`;
  const file=`flower-${[...symbol][0].codePointAt(0).toString(16)}`;
  fs.writeFileSync(`public/pictures/${file}.svg`,['🌷','🌹'].includes(symbol) ? svg.replace(`<circle cx="50" cy="35" r="13" fill="${center}"/>`,'') : svg);assets[symbol]=file;
}
fs.writeFileSync(path,JSON.stringify(assets,null,2)+'\n');
fs.appendFileSync('public/pictures/ATTRIBUTION.txt','\nwhole-*.svg: adapted from Twemoji heads with added bodies, limbs and feet. CC BY 4.0. flower-*.svg: original stem-and-leaf illustrations created for this game.\n');
console.log('Full-body animals and stem-and-leaf flowers updated.');
