import {readFile,writeFile,mkdir,access} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {film,cues,audioConfig} from '../src/config.js';
const rate=48000;
function ffmpeg(args){const r=spawnSync('ffmpeg',['-hide_banner','-loglevel','error','-y',...args],{encoding:'utf8',maxBuffer:16*1024*1024});if(r.error)throw r.error;if(r.status!==0)throw new Error(r.stderr)}
export async function prepareAudio(){
 await mkdir('public/assets/audio',{recursive:true});
 const meta=JSON.parse(await readFile('docs/music-source.json','utf8'));
 let bytes;try{bytes=await readFile(audioConfig.source)}catch{
  const r=await fetch(meta.url,{signal:AbortSignal.timeout(120000)});if(!r.ok)throw new Error(`Music download HTTP ${r.status}`);bytes=Buffer.from(await r.arrayBuffer());
 }
 if(createHash('sha256').update(bytes).digest('hex')!==meta.sha256)throw new Error('Music source checksum changed; inspect the source before replacing it.');
 await writeFile(audioConfig.source,bytes);
 // Original procedural transition effects, deterministic and without external samples.
 const data=new Float32Array(rate*film.duration*2);let seed=93531;
 const noise=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return (seed>>>0)/4294967295*2-1};
 for(const cue of cues){
  for(let j=0;j<rate*1.3;j++){
   const t=j/rate,frame=Math.floor(cue*rate)+j;if(frame>=rate*film.duration)break;
   const bass=Math.sin(2*Math.PI*(62*t-17*t*t))*Math.exp(-t*6)*.25;
   const hit=noise()*Math.exp(-t*23)*.11;
   const v=(bass+hit);data[frame*2]+=v;data[frame*2+1]+=v;
  }
  const duration=.7;
  for(let j=0;j<rate*duration;j++){
   const frame=Math.floor((cue-duration)*rate)+j;if(frame<0||frame>=rate*film.duration)continue;
   const p=j/(rate*duration),env=Math.sin(Math.PI*p)**2*.065,n=noise()*env;
   data[frame*2]+=n*(1-p*.75);data[frame*2+1]+=n*(.25+p*.75);
  }
 }
 const pcm=Buffer.alloc(data.length*2);for(let i=0;i<data.length;i++)pcm.writeInt16LE(Math.round(Math.max(-1,Math.min(1,data[i]))*32767),i*2);
 await writeFile('public/assets/audio/sfx.pcm',pcm);
 ffmpeg(['-f','s16le','-ar',String(rate),'-ac','2','-i','public/assets/audio/sfx.pcm','-c:a','pcm_s16le','public/assets/audio/sfx.wav']);
 ffmpeg(['-i',audioConfig.source,'-i','public/assets/audio/sfx.wav','-filter_complex',`[0:a]atrim=start=${audioConfig.start}:duration=${film.duration},asetpts=PTS-STARTPTS,volume=1.0,afade=t=in:d=1.0,afade=t=out:st=${film.duration-2.2}:d=2.2[m];[m][1:a]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.89:level=0,asetpts=PTS-STARTPTS,apad,atrim=duration=${film.duration}[a]`,'-map','[a]','-t',String(film.duration),'-ar','48000','-ac','2','-c:a','libmp3lame','-b:a','192k',audioConfig.soundtrack]);
 const analysis=spawnSync('ffmpeg',['-v','error','-i',audioConfig.soundtrack,'-f','f32le','-ac','1','-ar','12000','pipe:1'],{maxBuffer:8*1024*1024});if(analysis.status!==0)throw new Error('Audio envelope decode failed');
 const values=[];for(let i=0;i<film.duration*60;i++){let sum=0;for(let j=0;j<200;j++){const offset=(i*200+j)*4;if(offset+4<=analysis.stdout.length){const x=analysis.stdout.readFloatLE(offset);sum+=x*x}}values.push(Number(Math.min(1,Math.sqrt(sum/200)*3.5).toFixed(4)))}
 await writeFile('public/assets/audio/envelope.json',JSON.stringify({fps:60,duration:film.duration,values}));
 console.log(`Prepared ${film.duration}s music + stereo transitions; credit in docs/MUSIC_CREDITS.md.`);
}
export async function mixVoice(voice,start=0,output='output/voice-mix.wav'){
 if(!Number.isFinite(start)||start<0||start>=film.duration)throw new Error('Invalid voice start');await access(voice);await access(audioConfig.soundtrack);await mkdir('output',{recursive:true});
 const probe=spawnSync('ffprobe',['-v','error','-show_entries','format=duration','-of','json',voice],{encoding:'utf8'});if(probe.status!==0)throw new Error('Cannot inspect voice file');
 const duration=Number(JSON.parse(probe.stdout).format.duration);if(!Number.isFinite(duration)||start+duration>film.duration-.5)throw new Error(`Voice ends at ${(start+duration).toFixed(2)}s; shorten/re-time the narration or extend the timeline. No silent truncation.`);
 ffmpeg(['-i',audioConfig.soundtrack,'-i',voice,'-filter_complex',`[1:a]aresample=48000,highpass=f=85,loudnorm=I=-16:TP=-2:LRA=7,asetpts=PTS-STARTPTS,adelay=${Math.round(start*1000)}:all=1,apad,atrim=duration=${film.duration},asplit=2[v][sc];[0:a]asetpts=PTS-STARTPTS[music];[music][sc]sidechaincompress=threshold=0.018:ratio=8:attack=20:release=350:makeup=1[duck];[duck][v]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.89:level=0,asetpts=PTS-STARTPTS,apad,atrim=duration=${film.duration}[a]`,'-map','[a]','-t',String(film.duration),'-ar','48000','-ac','2',output]);return output;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))await prepareAudio();
