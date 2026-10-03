import {readFile,writeFile,mkdir} from 'node:fs/promises';
// Optional account-backed TTS. Never store keys in source or send them to the browser.
const key=process.env.ELEVENLABS_API_KEY;
if(!key)throw new Error('Set ELEVENLABS_API_KEY in your local .env. See docs/VOICE_GUIDE.md.');
const headers={'xi-api-key':key};
if(process.argv.includes('--list')){
 const r=await fetch('https://api.elevenlabs.io/v1/voices',{headers,signal:AbortSignal.timeout(30000)});if(!r.ok)throw new Error(`Voice list HTTP ${r.status}`);
 const data=await r.json();console.log(data.voices.map(v=>({voice_id:v.voice_id,name:v.name,labels:v.labels})));process.exit(0);
}
const script=process.argv[2],id=process.env.ELEVENLABS_VOICE_ID;
if(!script||!id)throw new Error('Usage: npm run voice -- narration.txt ; set ELEVENLABS_VOICE_ID from the voice library first.');
const text=await readFile(script,'utf8');if(!text.trim())throw new Error('Empty narration');
const r=await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(id)}?output_format=mp3_44100_128`,{method:'POST',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify({text,model_id:process.env.ELEVENLABS_MODEL_ID||'eleven_v3',language_code:'vi',voice_settings:{stability:.5}}),signal:AbortSignal.timeout(180000)});
if(!r.ok)throw new Error(`Speech generation HTTP ${r.status}. Check voice/model availability and account credits.`);
const bytes=Buffer.from(await r.arrayBuffer());if(bytes.length<100)throw new Error('Empty speech result');await mkdir('output',{recursive:true});await writeFile('output/narration.mp3',bytes);console.log('Saved output/narration.mp3. Listen before mixing.');
