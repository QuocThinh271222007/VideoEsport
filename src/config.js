import {acts,actShots} from './montage.js';
// Hai bản dựng: full (84s) và short (30s). Chọn bằng ?profile=short (trình duyệt) hoặc --profile=short / VIDEO_PROFILE=short (script).
const fromNode=typeof process!=='undefined'&&process.argv?(process.argv.find(a=>a.startsWith('--profile='))||'').slice(10)||process.env.VIDEO_PROFILE:'';
const fromUrl=typeof location!=='undefined'?new URLSearchParams(location.search).get('profile'):'';
export const profileName=fromUrl||fromNode||'full';
const suffix=profileName==='full'?'':`-${profileName}`;
// Nội dung lấy từ Đề án thành lập Ban Thể thao điện tử (CLB Tin học, NH 2026-2027). words: chữ động trên footage [giây trong cảnh, độ dài, dòng chữ ('/' xuống dòng), nhãn nhỏ].
const W=(t,d,text,label='')=>({t,d,text,label});
const plate=(act,start,end,color,words)=>({start,end,kind:act,act,color,title:[],video:`/assets/montage/${act}.mp4`,words});
const intro=(end,delay)=>({start:0,end,kind:'intro',color:'#99ffd6',eyebrow:'ESPORTS DEPARTMENT',title:['BAN THỂ THAO','ĐIỆN TỬ'],description:'Câu lạc bộ Tin học · Khoa Công nghệ Thông tin · ĐHSP TP.HCM',tags:[],delay});
const outro=(start,end)=>({start,end,kind:'outro',color:'#99ffd6',eyebrow:'BAN THỂ THAO ĐIỆN TỬ · CLB TIN HỌC',title:['TUYỂN THÀNH VIÊN','THÁNG 10/2026'],description:'Theo dõi fanpage CLB Tin học để nhận thông tin đăng ký.',tags:[]});
const profiles={
 full:{duration:84,scenes:[
  intro(5,2.2),
  plate('act1',5,19,'#ff566b',[W(.3,2.4,'TƯ DUY/CHIẾN THUẬT'),W(4.2,2.4,'PHẢN XẠ'),W(8.4,2.5,'PHỐI HỢP'),W(11,2.8,'ĐỒNG ĐỘI')]),
  plate('act2',19,31,'#ffcd62',[W(.9,3.6,'THI ĐẤU/CÓ TỔ CHỨC'),W(5,3.4,'CÓ LUẬT/THI ĐẤU'),W(8.6,3.2,'TINH THẦN/THỂ THAO')]),
  plate('act3',31,45,'#75d9ff',[]),
  plate('act4',45,60,'#ff566b',[W(.2,3.4,'SINH HOẠT/ĐỊNH KỲ'),W(3.8,3.4,'GIAO LƯU'),W(7.4,3.4,'TỔ CHỨC/GIẢI ĐẤU'),W(11,3.8,'XÂY DỰNG/ĐỘI TUYỂN')]),
  plate('act5',60,70,'#99ffd6',[W(.2,2.4,'CHƠI CÓ/TRÁCH NHIỆM'),W(2.7,2.4,'KHÔNG/CÁ CƯỢC'),W(5.2,2.3,'CÂN BẰNG/HỌC TẬP VÀ GIẢI TRÍ'),W(7.6,2.4,'SÂN CHƠI/LÀNH MẠNH')]),
  {start:70,end:76,kind:'community',color:'#99ffd6',eyebrow:'ESPORTS DEPARTMENT',title:['CHUNG ĐỘI HÌNH.'],description:'Giao lưu • Chia sẻ • Cùng nhau tiến bộ',tags:[]},
  outro(76,84),
 ]},
 short:{duration:30,scenes:[
  intro(3.5,1.2),
  plate('s1',3.5,11.5,'#ff566b',[W(.2,2.2,'TƯ DUY/CHIẾN THUẬT'),W(2.7,2.2,'PHẢN XẠ'),W(5.2,2.6,'ĐỒNG ĐỘI')]),
  plate('s2',11.5,17.5,'#ffcd62',[W(.5,2.5,'THI ĐẤU/CÓ TỔ CHỨC'),W(3.2,2.7,'TINH THẦN/THỂ THAO')]),
  plate('s3',17.5,23.5,'#ff566b',[W(0,1.9,'SINH HOẠT'),W(2,1.9,'GIAO LƯU'),W(4,2,'TỔ CHỨC/GIẢI ĐẤU')]),
  plate('s4',23.5,26.5,'#99ffd6',[W(.2,2.7,'SÂN CHƠI/LÀNH MẠNH','KHÔNG CÁ CƯỢC')]),
  outro(26.5,30),
 ]},
};
if(!profiles[profileName])throw new Error(`Profile không tồn tại: ${profileName} (full | short)`);
export const film={width:1920,height:1080,fps:60,duration:profiles[profileName].duration,brand:'BAN THỂ THAO ĐIỆN TỬ · CLB TIN HỌC'};
export const scenes=profiles[profileName].scenes;
// Thời điểm mỗi cú cắt montage (giây trên timeline) để đánh nhịp zoom/flash trong preview.
export const cuts=scenes.filter(s=>s.act).flatMap(s=>{let t=s.start;return actShots(acts[s.act]).map(x=>{const at=t;t+=x.dur;return +at.toFixed(3)})});
export const assetPaths = {
 neon:'/assets/valorant/Neon.webp',omen:'/assets/valorant/Omen.webp',yoru:'/assets/valorant/Yoru.webp',viper:'/assets/valorant/Viper.webp',
};
export const casts = {};
export const cues=[...new Set(scenes.flatMap(s=>[s.start,...(s.words||[]).map(w=>+(s.start+w.t).toFixed(2))]))].sort((a,b)=>a-b);
export const audioConfig={source:'public/assets/audio/the-fury-source.mp3',start:144,soundtrack:`public/assets/audio/soundtrack${suffix}.mp3`,preview:`/assets/audio/soundtrack${suffix}.mp3`,envelope:`/assets/audio/envelope${suffix}.json`,credit:'The Fury — Scott Buckley · CC BY 4.0 · www.scottbuckley.com.au'};
