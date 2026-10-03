import {readdir,mkdir} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import sharp from 'sharp';
const source=process.argv[2];if(!source)throw new Error('Usage: npm run import:valorant -- "directory containing extracted PNG files"');
const output=resolve('public/assets/valorant');await mkdir(output,{recursive:true});
let count=0;
for(const name of await readdir(source)){
  if(!/^[A-Za-z0-9_-]+_cropped_transparent\.png$/i.test(name))continue;
  const dst=join(output,name.replace('_cropped_transparent.png','.webp'));
  await sharp(join(source,name)).resize({height:1500,withoutEnlargement:true}).webp({quality:88}).toFile(dst);count++;
}
if(!count)throw new Error('No matching PNG files found. Extract files.zip first.');
console.log(`Imported ${count} character images; originals unchanged.`);
