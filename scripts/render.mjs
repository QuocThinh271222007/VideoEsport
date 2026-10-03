import {mkdir,rename,unlink,access} from 'node:fs/promises';
import {resolve} from 'node:path';
import {spawn,spawnSync} from 'node:child_process';
import {once} from 'node:events';
import {createServer} from 'vite';
import {openBrowser} from './browser.mjs';
import {film,audioConfig} from '../src/config.js';
import {mixVoice} from './audio.mjs';

// Usage: npm run render -- --width=1920 --fps=60 --audio=/path/music.wav
const options=Object.fromEntries(process.argv.slice(2).map(x=>{const i=x.indexOf('=');return [x.slice(2,i),x.slice(i+1)]}));
const width=Number(options.width||1920),fps=Number(options.fps||60),height=width*9/16;
const from=Number(options.from||0),to=Number(options.to||film.duration),duration=to-from;
if(!Number.isFinite(from)||!Number.isFinite(to)||from<0||to>film.duration||duration<=0)throw new Error('Invalid render range');
if(!Number.isInteger(height)||width%2||height%2||!Number.isInteger(fps)||fps<1||fps>120)throw new Error('Use even 16:9 sizes (960,1280,1920) and fps 1–120.');
if(spawnSync('ffmpeg',['-version'],{stdio:'ignore'}).status!==0)throw new Error('Install FFmpeg and add it to PATH.');
let audio=options.audio||audioConfig.soundtrack;
if(options.voice)audio=await mixVoice(options.voice,Number(options['voice-start']||0));
await access(audio).catch(()=>{throw new Error('Soundtrack missing. Run npm run audio first.');});
const out=resolve(options.out||`output/VideoEsport-${width}x${height}-${fps}fps.mp4`),temp=out.replace(/\.mp4$/,'.partial.mp4');
if(!out.endsWith('.mp4'))throw new Error('Output must end in .mp4');
await mkdir(resolve(out,'..'),{recursive:true});
const server=await createServer({server:{port:5173,strictPort:false,host:'127.0.0.1',hmr:false,watch:null}});await server.listen();
let browser,encoder,successful=false;
try{
 browser=await openBrowser();const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
 page.on('pageerror',e=>console.error(e));await page.goto(server.resolvedUrls.local[0]+'?export=1');
 await page.waitForFunction(()=>window.__film?.ready||window.__film?.error,{},{timeout:60000});
 const error=await page.evaluate(()=>window.__film.error);if(error)throw new Error(error);
 const args=['-y','-f','image2pipe','-vcodec','mjpeg','-framerate',String(fps),'-i','pipe:0'];
 args.push('-ss',String(from),'-i',resolve(audio));
 args.push('-map','0:v:0','-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p');
 args.push('-map','1:a:0','-af','apad','-c:a','aac','-b:a','192k');
 args.push('-t',String(duration),'-movflags','+faststart',temp);
 encoder=spawn('ffmpeg',args,{stdio:['pipe','ignore','pipe']});let stderr='';encoder.stderr.on('data',d=>stderr=(stderr+d).slice(-6000));
 let failure;encoder.on('error',e=>failure=e);encoder.stdin.on('error',e=>failure=e);const exit=once(encoder,'close');
 for(let frame=0;frame<Math.round(duration*fps);frame++){
  if(failure)throw failure;await page.evaluate(t=>window.__film.seek(t),from+frame/fps);
  const bytes=await page.screenshot({type:'jpeg',quality:94});
  if(!encoder.stdin.write(bytes))await once(encoder.stdin,'drain');
  if(frame%(fps*4)===0)console.log(`Render ${frame/fps}s / ${duration}s`);
 }
 encoder.stdin.end();const [code]=await exit;if(code!==0)throw new Error(stderr);
 await rename(temp,out);successful=true;console.log('Saved',out);
}finally{if(!successful){encoder?.kill();await unlink(temp).catch(()=>{})}await browser?.close();await server.close()}
