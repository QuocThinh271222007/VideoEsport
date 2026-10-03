# Lồng tiếng Việt hào hùng cho VideoEsport

Hiện tại video có nhạc và SFX, chưa có lời đọc: người dùng chưa gửi đoạn văn. Không có bản giọng nào đã được tạo hoặc nghe thử trong phiên này. Có hai đường làm sẵn bên dưới.

## 1. Cách đơn giản: dùng giọng có sẵn trên ElevenLabs

1. Mở https://elevenlabs.io/text-to-speech/vietnamese và vào Text to Speech.
2. Trong Voice Library, lọc tiếng Việt và nghe thử giọng nam. Trang chính thức hiện liệt kê **Trieu Duong – Deep, Calm and Resonant**, **Trung Caha – Clear, Firm and Informative**, **Tung Dang – Deep, Warm and Resonant**. Đây là các điểm bắt đầu để thử; tên giọng có thể đổi và chưa khẳng định giọng nào đạt chất hào hùng với đoạn văn của bạn.
3. Chọn model biểu cảm có hỗ trợ tiếng Việt, ví dụ Eleven v3; v4 cũng có nếu tài khoản hiển thị. Dùng mẫu 2–3 câu trước khi tạo toàn bộ.
4. Chia câu ngắn, đặt dấu ngắt rõ. Mở đầu trầm chắc, đoạn giới thiệu game tăng năng lượng, câu kết nhấn mạnh. Tránh la hét suốt bài vì sẽ mất cao trào.
5. Nếu giọng quá đều, giảm Stability vừa phải, tạo vài bản và nghe so sánh. Không dùng hướng dẫn Speed/Style của model khác: v3 và v4 không có đầy đủ các thanh chỉnh giống Multilingual v2.
6. Thử chỉ dẫn `[excited]` hoặc `[shouts]` ở đúng một câu cao trào, nếu model hỗ trợ. Các thẻ này là gợi ý, không bảo đảm kết quả; bỏ thẻ nếu bị đọc thành tiếng. Không cần clone giọng người thật.
7. Xuất MP3 hoặc WAV, gửi file cho Codex/Claude hoặc dùng lệnh ghép dưới đây.

Nguồn kiểm tra 2026-10-03:
- https://elevenlabs.io/text-to-speech/vietnamese
- https://elevenlabs.io/docs/eleven-creative/playground/text-to-speech

Hãy kiểm tra quyền sử dụng của gói tài khoản trước khi đăng bản lồng tiếng. Việc tạo mẫu miễn phí không có nghĩa mọi mục đích phát hành đều được cấp quyền.

## 2. Tạo bằng script từ đoạn văn bạn cung cấp

Cần tài khoản ElevenLabs có quyền dùng API và credit. Đây là phần tùy chọn; video có nhạc chạy được mà không có khóa API.

Tạo bản sao `.env.example` thành `.env`, điền khóa API tại máy bạn. Không gửi khóa vào chat hoặc commit lên GitHub.

```powershell
npm run voice:list
```

Chọn `voice_id` của giọng đã nghe thử, điền `ELEVENLABS_VOICE_ID`. Lưu đoạn văn UTF-8 vào `narration.txt`. Script đang mặc định `eleven_v3`; đổi `ELEVENLABS_MODEL_ID` nếu tài khoản dùng model khác phù hợp.

```powershell
npm run voice -- narration.txt
```

Kết quả: `output/narration.mp3`. Phải nghe lại dấu tiếng Việt, tên game, nhịp nghỉ và chất giọng. API cần tài khoản của bạn; phiên dựng này chưa chạy tạo giọng qua dịch vụ.

## 3. Ghép vào video mà không render lại hình

```powershell
npm run mix:voice -- "output/VideoEsport-Cinematic-v2-1080p60.mp4" "output/narration.mp3" "output/VideoEsport-with-voice.mp4" 0
```

Số cuối là giây bắt đầu lời đọc. Nhạc tự hạ âm lượng khi có giọng bằng sidechain compression, có lọc âm trầm và limiter. Nếu lời đọc dài vượt khung 56 giây, script báo lỗi, không âm thầm cắt mất lời. Cần rút gọn đoạn văn hoặc kéo dài timeline.

Có thể render kèm giọng ngay từ đầu:

```powershell
npm run render -- --width=1920 --fps=60 "--voice=output/narration.mp3" --voice-start=0
```

Nếu chỉ gửi đoạn văn cho Codex/Claude: agent có thể chia câu, phân mốc thời gian và chuẩn bị nội dung đọc; việc gọi dịch vụ cần một kết nối/API đã được bạn thiết lập. Hiện chưa có kết nối giọng nói trực tiếp trong phiên này.
