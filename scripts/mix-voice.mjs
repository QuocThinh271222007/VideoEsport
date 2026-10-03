import {spawnSync} from 'node:child_process';
import {mixVoice} from './audio.mjs';
const [video,voice,output='output/VideoEsport-with-voice.mp4',start='0']=process.argv.slice(2);
if(!video||!voice)throw new Error('Usage: npm run mix:voice -- video.mp4 narration.mp3 output.mp4 0');
const mix=await mixVoice(voice,Number(start));
const r=spawnSync('ffmpeg',['-y','-i',video,'-i',mix,'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-movflags','+faststart',output],{stdio:'inherit'});if(r.status!==0)throw new Error('Voice mux failed');
