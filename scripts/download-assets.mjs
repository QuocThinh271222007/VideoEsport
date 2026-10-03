import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {createHash} from 'node:crypto';
const rows=JSON.parse(await readFile(new URL('../docs/asset-sources.json',import.meta.url),'utf8'));
for(const a of rows){
  const p=resolve('public/assets',a.file);await mkdir(dirname(p),{recursive:true});
  const r=await fetch(a.url,{signal:AbortSignal.timeout(45000)});if(!r.ok)throw new Error(`${a.id}: HTTP ${r.status}`);
  const b=Buffer.from(await r.arrayBuffer());const hash=createHash('sha256').update(b).digest('hex');
  if(a.sha256&&hash!==a.sha256)throw new Error(`${a.id}: source changed; inspect before accepting new bytes`);
  await writeFile(p,b);console.log(a.file,b.length);
}
