import assert from 'node:assert/strict';
import {mkdir,access,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
import {openBrowser} from './browser.mjs';
import sharp from 'sharp';
import {film,scenes,assetPaths,casts} from '../src/config.js';
for(let i=0;i<scenes.length;i++){assert.equal(scenes[i].start,i?scenes[i-1].end:0);assert(scenes[i].end>scenes[i].start)}assert.equal(scenes.at(-1).end,film.duration);
for(const path of Object.values(assetPaths))await access('public'+path);
for(const a of JSON.parse(await readFile('docs/runtime-assets.json','utf8'))){const bytes=await readFile(a.path);assert.equal(createHash('sha256').update(bytes).digest('hex'),a.sha256)}
const server=await createServer({server:{host:'127.0.0.1'}});await server.listen();let browser;
try{
 browser=await openBrowser();const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
 await page.goto(server.resolvedUrls.local[0]+'?export=1');await page.waitForFunction(()=>window.__film?.ready||window.__film?.error,{},{timeout:60000});assert.equal(await page.evaluate(()=>window.__film.error),undefined);
 await mkdir('output/qa',{recursive:true});
 for(let i=0;i<scenes.length;i++){const s=scenes[i],time=s.start+2;assert.equal((await page.evaluate(t=>window.__film.seek(t),time)).scene,s.kind);await page.screenshot({path:`output/qa/${i+1}-${s.kind}.png`})}
 // A non-monotonic seek must reproduce the same raster, including camera and particles.
 await page.evaluate(()=>window.__film.seek(10));const first=await sharp(await page.screenshot()).raw().toBuffer();await page.evaluate(()=>window.__film.seek(30));await page.evaluate(()=>window.__film.seek(10));const second=await sharp(await page.screenshot()).raw().toBuffer();
 // Allow 1/255 GPU edge rounding on at most 0.1% of channels; any larger change fails.
 let changed=0,maxDelta=0;for(let i=0;i<first.length;i++){const d=Math.abs(first[i]-second[i]);if(d)changed++;maxDelta=Math.max(maxDelta,d)}assert(maxDelta<=1&&changed<=first.length*.001,`Non-deterministic frame: ${changed} channels, max delta ${maxDelta}`);
 for(const s of scenes.filter(s=>casts[s.kind]))for(let k=0;k<casts[s.kind].length;k++){
  const t=s.start+k*4+1.6,state=await page.evaluate(t=>window.__film.seek(t),t);assert.equal(state.active.asset,casts[s.kind][k].asset);assert(state.visible.some(v=>v.asset===state.active.asset&&v.opacity>.9));await page.screenshot({path:`output/qa/hero-${s.kind}-${k+1}.png`});
 }
 const near=await page.evaluate(()=>window.__film.seek(7.2)),far=await page.evaluate(()=>window.__film.seek(6.2));assert(near.visible[0].z-far.visible[0].z>10,'Missing depth travel');
 for(const s of scenes.slice(1)){assert.equal((await page.evaluate(t=>window.__film.seek(t),s.start)).scene,s.kind)}
 assert.equal(errors.length,0,errors.join('\n'));console.log('PASS: assets, sources, timeline, scene transitions, deterministic seek, browser errors.');
}finally{await browser?.close();await server.close()}
