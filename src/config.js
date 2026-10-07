export const film={width:1920,height:1080,fps:60,duration:84,brand:'BAN THỂ THAO ĐIỆN TỬ · CLB TIN HỌC'};
// Nội dung lấy từ Đề án thành lập Ban Thể thao điện tử (CLB Tin học, NH 2026-2027). words: chữ động trên footage [giây trong cảnh, độ dài, dòng chữ ('/' xuống dòng), nhãn nhỏ].
const W=(t,d,text,label='')=>({t,d,text,label});
export const scenes = [
 {start:0,end:5,kind:'intro',color:'#99ffd6',eyebrow:'ESPORTS DEPARTMENT',title:['BAN THỂ THAO','ĐIỆN TỬ'],description:'Câu lạc bộ Tin học · Khoa Công nghệ Thông tin · ĐHSP TP.HCM',tags:[]},
 {start:5,end:19,kind:'act1',color:'#ff566b',title:[],video:'/assets/montage/act1.mp4',words:[W(.3,2.4,'TƯ DUY/CHIẾN THUẬT'),W(4.2,2.4,'PHẢN XẠ'),W(8.4,2.5,'PHỐI HỢP'),W(11,2.8,'ĐỒNG ĐỘI')]},
 {start:19,end:31,kind:'act2',color:'#ffcd62',title:[],video:'/assets/montage/act2.mp4',words:[W(.9,3.6,'THI ĐẤU/CÓ TỔ CHỨC'),W(5,3.4,'CÓ LUẬT/THI ĐẤU'),W(8.6,3.2,'TINH THẦN/THỂ THAO')]},
 {start:31,end:45,kind:'act3',color:'#75d9ff',title:[],video:'/assets/montage/act3.mp4',words:[W(.4,2.5,'PHẦN CỨNG','SẮP TỚI · CÔNG NGHỆ 1/5'),W(3,2.5,'MẠNG','SẮP TỚI · CÔNG NGHỆ 2/5'),W(5.8,2.5,'PHÁT SÓNG/TRỰC TUYẾN','SẮP TỚI · CÔNG NGHỆ 3/5'),W(8.5,2.5,'PHÂN TÍCH/TRẬN ĐẤU','SẮP TỚI · CÔNG NGHỆ 4/5'),W(11.2,2.6,'PHÁT TRIỂN/GAME','SẮP TỚI · CÔNG NGHỆ 5/5')]},
 {start:45,end:60,kind:'act4',color:'#ff566b',title:[],video:'/assets/montage/act4.mp4',words:[W(.2,3.4,'SINH HOẠT/ĐỊNH KỲ','SẮP TỚI'),W(3.8,3.4,'GIAO LƯU','SẮP TỚI'),W(7.4,3.4,'TỔ CHỨC/GIẢI ĐẤU','SẮP TỚI'),W(11,3.8,'XÂY DỰNG/ĐỘI TUYỂN','SẮP TỚI')]},
 {start:60,end:70,kind:'act5',color:'#99ffd6',title:[],video:'/assets/montage/act5.mp4',words:[W(.2,2.4,'CHƠI CÓ/TRÁCH NHIỆM'),W(2.7,2.4,'KHÔNG/CÁ CƯỢC'),W(5.2,2.3,'KẾT THÚC/TRƯỚC 22:00'),W(7.6,2.4,'BAN KHÔNG THU/PHÍ RIÊNG')]},
 {start:70,end:76,kind:'community',color:'#99ffd6',eyebrow:'ESPORTS DEPARTMENT',title:['CHUNG ĐỘI HÌNH.'],description:'Giao lưu • Chia sẻ • Cùng nhau tiến bộ',tags:[]},
 {start:76,end:84,kind:'outro',color:'#99ffd6',eyebrow:'BAN THỂ THAO ĐIỆN TỬ · CLB TIN HỌC',title:['TUYỂN THÀNH VIÊN','THÁNG 10/2026'],description:'Theo dõi fanpage CLB Tin học để nhận thông tin đăng ký.',tags:[]},
];
export const assetPaths = {
 neon:'/assets/valorant/Neon.webp',omen:'/assets/valorant/Omen.webp',yoru:'/assets/valorant/Yoru.webp',viper:'/assets/valorant/Viper.webp',
};
export const casts = {};
export const cues=[...new Set(scenes.flatMap(s=>[s.start,...(s.words||[]).map(w=>+(s.start+w.t).toFixed(2))]))].sort((a,b)=>a-b);
export const audioConfig={source:'public/assets/audio/the-fury-source.mp3',start:144,soundtrack:'public/assets/audio/soundtrack.mp3',preview:'/assets/audio/soundtrack.mp3',credit:'The Fury — Scott Buckley · CC BY 4.0 · www.scottbuckley.com.au'};
