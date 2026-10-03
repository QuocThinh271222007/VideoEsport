import assert from 'node:assert/strict';
import {mkdir,access,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
import {openBrowser} from './browser.mjs';
import {film,scenes,assetPaths} from '../src/config.js';
for(let i=0;i<scenes.length;i++){assert.equal(scenes[i].start,i?scenes[i-1].end:0);assert(scenes[i].end>scenes[i].start)}assert.equal(scenes.at(-1).end,film.duration);
for(const path of Object.values(assetPaths))await access('public'+path);
for(const a of JSON.parse(await readFile('docs/asset-sources.json','utf8'))){const bytes=await readFile('public/assets/'+a.file);assert.equal(createHash('sha256').update(bytes).digest('hex'),a.sha256)}
const server=await createServer({server:{host:'127.0.0.1'}});await server.listen();let browser;
try{
 browser=await openBrowser();const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
 await page.goto(server.resolvedUrls.local[0]+'?export=1');await page.waitForFunction(()=>window.__film?.ready||window.__film?.error,{},{timeout:60000});assert.equal(await page.evaluate(()=>window.__film.error),undefined);
 await mkdir('output/qa',{recursive:true});
 for(let i=0;i<scenes.length;i++){const s=scenes[i],time=s.start+2;assert.equal((await page.evaluate(t=>window.__film.seek(t),time)).scene,s.kind);await page.screenshot({path:`output/qa/${i+1}-${s.kind}.png`})}
 // A non-monotonic seek must reproduce the same raster, including camera and particles.
 await page.evaluate(()=>window.__film.seek(10));const first=await page.screenshot();await page.evaluate(()=>window.__film.seek(30));await page.evaluate(()=>window.__film.seek(10));assert((await page.screenshot()).equals(first),'Non-deterministic frame');
 for(const s of scenes.slice(1)){assert.equal((await page.evaluate(t=>window.__film.seek(t),s.start)).scene,s.kind)}
 assert.equal(errors.length,0,errors.join('\n'));console.log('PASS: assets, sources, timeline, scene transitions, deterministic seek, browser errors.');
}finally{await browser?.close();await server.close()}
