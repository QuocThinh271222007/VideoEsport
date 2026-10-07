// Cắt clip highlight Liên Quân (video bạn có quyền dùng) thành public/assets/trailers/lien-quan-highlight.mp4.
// Dùng: npm run import:lienquan -- --src=<file hoặc URL mp4/webm> [--in=0] [--duration=8]
import {spawnSync} from 'node:child_process';
import {mkdir,writeFile,rm} from 'node:fs/promises';
import {existsSync} from 'node:fs';
const opt=Object.fromEntries(process.argv.slice(2).map(a=>{const [k,...v]=a.replace(/^--/,'').split('=');return [k,v.join('=')]}));
const src=opt.src,start=Number(opt.in||0),duration=Number(opt.duration||8),out='public/assets/trailers/lien-quan-highlight.mp4';
if(!src||!Number.isFinite(start)||!Number.isFinite(duration)||duration<8)throw new Error('Cần --src=<file|URL> và --duration>=8 (cảnh dài 8 giây).');
let input=src;
if(/^https?:\/\//.test(src)){
 const r=await fetch(src);if(!r.ok)throw new Error(`Không tải được ${src}: ${r.status}`);
 input='output/lien-quan-source.tmp';await mkdir('output',{recursive:true});await writeFile(input,Buffer.from(await r.arrayBuffer()));
}else if(!existsSync(src))throw new Error(`Không thấy file ${src}`);
await mkdir('public/assets/trailers',{recursive:true});
// Bỏ tiếng, 1280x720, 30fps, H.264 để preview/render ổn định khi tua.
const p=spawnSync('ffmpeg',['-y','-ss',String(start),'-t',String(duration),'-i',input,'-an','-vf','scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,fps=30','-c:v','libx264','-preset','slow','-crf','20','-g','15','-pix_fmt','yuv420p','-movflags','+faststart',out],{stdio:'inherit'});
if(input.endsWith('.tmp'))await rm(input,{force:true});
if(p.status!==0)throw new Error('ffmpeg thất bại');
console.log(`Đã tạo ${out} (${duration}s). Chạy npm run dev để xem; cảnh 66–74s sẽ dùng clip này thay artwork dự phòng.`);
