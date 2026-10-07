export const film = {width:1920,height:1080,fps:60,duration:84,brand:'BAN THỂ THAO ĐIỆN TỬ'};
export const scenes = [
 {start:0,end:6,kind:'intro',color:'#99ffd6',label:'THE NEXT CHAPTER',eyebrow:'MỘT ĐAM MÊ. MỘT TẬP THỂ.',title:['CÙNG CHƠI.','CÙNG TỎA SÁNG.'],description:'Bước vào thế giới của những người đồng đội.',tags:['KẾT NỐI','BẢN LĨNH','BỨT PHÁ']},
 {start:6,end:22,kind:'valorant',color:'#ff566b',label:'01 / VALORANT',eyebrow:'BẢN LĨNH TRONG TỪNG KHOẢNH KHẮC',title:['VALORANT'],description:'Đọc tình huống. Phối hợp chuẩn. Cùng bứt phá.',tags:['CHIẾN THUẬT','PHỐI HỢP']},
 {start:22,end:38,kind:'valorant-reel',color:'#ff566b',label:'VCT / HIGHLIGHTS + CINEMATIC',eyebrow:'',title:['VCT'],description:'',tags:[],video:'/assets/trailers/valorant-reel.mp4',videoIn:0},
 {start:38,end:50,kind:'free-fire',color:'#ffcd62',label:'02 / FREE FIRE',eyebrow:'VÀO TRẬN CÙNG NHAU',title:['FREE FIRE'],description:'Sẵn sàng cho mọi thử thách.',tags:['TỐC ĐỘ','SINH TỒN']},
 {start:50,end:62,kind:'free-fire-reel',color:'#ffcd62',label:'FREE FIRE / CINEMATIC',eyebrow:'',title:['FREE FIRE'],description:'',tags:[],video:'/assets/trailers/free-fire-cinematic.mp4',videoIn:3},
 {start:62,end:74,kind:'lien-quan',color:'#75d9ff',label:'03 / LIÊN QUÂN',eyebrow:'NĂM VỊ TRÍ. MỘT MỤC TIÊU.',title:['LIÊN QUÂN'],description:'Kết nối chiến thuật. Làm chủ giao tranh.',tags:['HIỆP ĐỒNG','BỨT PHÁ']},
 {start:74,end:78,kind:'community',color:'#99ffd6',label:'ONE COLLECTIVE',eyebrow:'BA TỰA GAME. CHUNG MỘT ĐAM MÊ.',title:['CHUNG ĐỘI HÌNH.'],description:'Giao lưu • Chia sẻ • Cùng nhau tiến bộ',tags:[]},
 {start:78,end:84,kind:'outro',color:'#99ffd6',label:'YOUR NEXT TEAM',eyebrow:'BAN THỂ THAO ĐIỆN TỬ',title:['ĐỒNG ĐỘI MỚI.','HÀNH TRÌNH MỚI.'],description:'Cùng chúng mình viết tiếp những khoảnh khắc đáng nhớ.',tags:['SẴN SÀNG VÀO ĐỘI?']},
];
export const assetPaths = {
 neon:'/assets/valorant/Neon.webp',omen:'/assets/valorant/Omen.webp',yoru:'/assets/valorant/Yoru.webp',viper:'/assets/valorant/Viper.webp',
 ff1:'/assets/free-fire/wallpaper-4.webp',ff2:'/assets/free-fire/wallpaper-2.webp',ff3:'/assets/free-fire/wallpaper-1.webp',
 lq1:'/assets/lien-quan/nakroth.webp',lq2:'/assets/lien-quan/trieu-van.webp',lq3:'/assets/lien-quan/valhein.webp',
};
export const casts = {
 valorant:[{asset:'neon',name:'NEON',line:'TỐC ĐỘ BỨT PHÁ'},{asset:'omen',name:'OMEN',line:'LÀM CHỦ THẾ TRẬN'},{asset:'yoru',name:'YORU',line:'TẠO NÊN BẤT NGỜ'},{asset:'viper',name:'VIPER',line:'KIỂM SOÁT KHÔNG GIAN'}],
 'free-fire':[{asset:'ff1',name:'BẢN LĨNH',line:'SẴN SÀNG GIAO TRANH'},{asset:'ff2',name:'BỨT PHÁ',line:'MỖI NGƯỜI MỘT THẾ MẠNH'},{asset:'ff3',name:'CHINH PHỤC',line:'CHUNG MỘT ĐÍCH ĐẾN'}],
 'lien-quan':[{asset:'lq1',name:'NAKROTH',line:'MỞ LỐI GIAO TRANH'},{asset:'lq2',name:'TRIỆU VÂN',line:'TIẾN LÊN CÙNG ĐỒNG ĐỘI'},{asset:'lq3',name:'VALHEIN',line:'PHỐI HỢP ĐỂ BỨT PHÁ'}],
};
export const cues=[0,2.5,6,8.78,10,12.78,14,16.78,18,20.78,22,28,32.8,38,40.78,42,44.78,46,48.78,50,62,64.78,66,68.78,70,72.78,74,75,76,77,78];
export const audioConfig={source:'public/assets/audio/the-fury-source.mp3',start:144,soundtrack:'public/assets/audio/soundtrack.mp3',preview:'/assets/audio/soundtrack.mp3',credit:'The Fury — Scott Buckley · CC BY 4.0 · www.scottbuckley.com.au'};
