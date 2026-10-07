// Dựng các đoạn montage từ footage nguồn: node scripts/montage.mjs [act1 act2 ...]
// Mỗi đoạn là clip 1280x720 30fps, không tiếng, đúng độ dài trong src/montage.js; chữ/logo/hiệu ứng được thêm ở preview/render.
import {spawnSync} from 'node:child_process';
import {mkdir,access} from 'node:fs/promises';
import {acts,sources,actDuration} from '../src/montage.js';
const W=1280,H=720,FPS=30,out='public/assets/montage';
const grades={'':'',tech:',colorbalance=bs=.14:bm=.08:rs=-.05,eq=saturation=.9:contrast=1.08',warm:',colorbalance=rs=.06:bs=-.05,eq=saturation=1.08'};
// Vùng gameplay của video giải đấu: bỏ bảng tỉ số, minimap, danh sách và camera tuyển thủ.
const crops={apl:'crop=1229:691:346:124,'};
const inputs=[],filters=[];
function shotChain(s,i,label,idx,width){
 // Mỗi cú cắt đẩy vào hoặc kéo ra nhẹ để có cảm giác camera chuyển động.
 inputs.push('-ss',String(s.at),'-t',String((s.dur*s.speed+.05).toFixed(3)),'-i',sources[s.src]);const n=inputs.filter(x=>x==='-i').length-1;
 const z=idx%2?`(1.07-.07*t/${s.dur})`:`(1+.07*t/${s.dur})`;
 filters.push(`[${n}:v]${crops[s.src]||''}scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},setpts=(PTS-STARTPTS)/${s.speed},fps=${FPS},trim=duration=${s.dur},setpts=PTS-STARTPTS,scale=w='trunc(${W}*${z}/2)*2':h=-2:eval=frame,crop=${width}:${H},setsar=1,format=yuv420p[${label}]`);
}
function build(name,a){
 inputs.length=0;filters.length=0;const D=actDuration(a);
 if(a.triptych){
  const pw=424;
  a.triptych.forEach((shots,p)=>{shots.forEach((s,i)=>shotChain(s,i,`p${p}s${i}`,i+p,pw));filters.push(`${shots.map((_,i)=>`[p${p}s${i}]`).join('')}concat=n=${shots.length}:v=1:a=0[p${p}]`)});
  filters.push(`color=c=#02050a:s=${W}x${H}:r=${FPS}:d=${D}[bg]`);
  let prev='bg';a.triptych.forEach((_,p)=>{filters.push(`[${prev}][p${p}]overlay=x=${p*(pw+4)}:y='-${H}*pow(1-min(1,max(0,(t-${p*.15})/.6)),3)':shortest=0[o${p}]`);prev=`o${p}`});
  filters.push(`[${prev}]trim=duration=${D},setpts=PTS-STARTPTS[v]`);
 }else{
  a.shots.forEach((s,i)=>shotChain(s,i,`s${i}`,i,W));
  filters.push(`${a.shots.map((_,i)=>`[s${i}]`).join('')}concat=n=${a.shots.length}:v=1:a=0${grades[a.grade||'']}[v]`);
 }
 return ['-y','-v','error',...inputs,'-filter_complex',filters.join(';'),'-map','[v]','-t',String(D),'-an','-c:v','libx264','-preset','slow','-crf','21','-g','15','-pix_fmt','yuv420p','-movflags','+faststart',`${out}/${name}.mp4`];
}
await mkdir(out,{recursive:true});
for(const f of new Set(Object.values(sources)))await access(f).catch(()=>{throw new Error(`Thiếu footage nguồn: ${f}`)});
const wanted=process.argv.slice(2),names=Object.keys(acts).filter(n=>!wanted.length||wanted.includes(n));
for(const name of names){
 const a=acts[name];console.log(`Dựng ${name}: ${actDuration(a)}s`);
 const r=spawnSync('ffmpeg',build(name,a),{stdio:'inherit'});if(r.status!==0)throw new Error(`ffmpeg lỗi ở ${name}`);
}
console.log('Xong, clip nằm ở',out);
