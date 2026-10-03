# Bàn giao Claude — Action Trailer v3

## Yêu cầu đã nhận

Người dùng muốn video Esport cho CLB, ba game Valorant/Free Fire/Liên Quân, chiều sâu mạnh và nhân vật lần lượt xuất hiện; có nhạc kịch tính dùng hợp lệ; push repo hoàn chỉnh. Khung ngang 45–60 giây, dùng tên ban tạm. V2 dài 56 giây. Người dùng chưa đưa đoạn văn lồng tiếng.

## Đã triển khai

- Scene tách riêng `world.js`: cổng sáng sâu 70+ đơn vị, sàn, vòng sáng, hạt, vật thể tiền cảnh; camera dolly/orbit và đường xuất hiện/thoát của từng nhân vật.
- Valorant Neon/Omen/Yoru/Viper từng lượt 4 giây; FF ba artwork; LQ Nakroth/Triệu Vân/Valhein; ba game hội tụ ở cuối.
- Depth buffer cho cutout giúp sàn không vẽ xuyên qua nhân vật. Artwork 2.5D, chưa có model rigged.
- Nhạc The Fury (Scott Buckley, CC BY 4.0), excerpt 144–200s + SFX tự tổng hợp; credit tại MUSIC_CREDITS.md.
- Preview dùng audio clock; hình xuất lấy thời gian tuyệt đối; ánh sáng dựa envelope tiền tính nên không lệch giữa preview/export.
- Export mặc định có nhạc, 1080p60; hỗ trợ đoạn thử `--from/--to`.
- Nhập voice, kiểm tra độ dài, sidechain ducking và remux không render lại hình. Có script gọi ElevenLabs bằng `.env` của người dùng; chưa gọi API thật do không có script/credentials.
- Toàn bộ 64 ảnh (bản gốc + WebP) có trong repo theo yêu cầu người dùng; checksum tại all-assets.json. Nhạc tải/generate bằng `npm run setup`. Khóa API không commit.

## Việc tiếp theo cần dữ liệu người dùng

Tên/logo CLB, lời đọc, giọng mong muốn sau khi nghe mẫu, ảnh hoạt động/thành viên và CTA cụ thể. Không bịa thông tin này. Khi có script, chia theo các mốc trong STORYBOARD.md, tạo sample để duyệt, rồi ghép. Không tự làm voice clone người khác.

Đây là tài liệu bàn giao trong repo, không phải bằng chứng đã liên hệ Claude trực tiếp. Claude nên fetch nhánh mới nhất trước khi sửa, làm nhánh riêng và tránh ghi đè thay đổi đồng thời.

## Kiểm tra

`npm run build`; `npm run check` kiểm tra runtime asset/hash, timeline, từng lượt cast, khoảng di chuyển chiều sâu, browser errors và tua lặp lại. Cho phép sai số raster GPU 1/255 trên tối đa 0.1% số kênh ảnh, không chấp nhận thay đổi lớn hơn. Render xong kiểm tra FFprobe: H.264, 1920×1080, 60fps, 56 giây; AAC stereo; xem khung hình đầu/giữa/cuối.

Máy Codex dùng Chrome tạm ở `/tmp/esport-chromium/chromium` vì CDN Playwright trả tệp sai. Máy người dùng ưu tiên `npx playwright install chromium`. Không thêm workaround riêng của máy này vào dependencies.

## V3 — phản hồi và sửa đổi

Người dùng không chấp nhận cách show từng trang thô; yêu cầu kịch tính, nhiều chuyển động và nhân vật chuyển động cơ bản. V3 thay toàn bộ world.js: môi trường cột kiến trúc, ảnh nhân vật dạng lưới có local joint weights; 4 cỡ cảnh trong mỗi lượt; vào/ra cảnh riêng theo nhân vật; điện, khói, cổng, slash, afterimage. CSS/main.js bỏ cột chữ cố định, title chỉ hiện ngắn, hero-name hiện khoảng 0,65–1,75s của lượt. FF/LQ dùng artwork tràn khung và local mesh warping nhẹ. Không có model 3D rigged hoặc chuyển động tay/chân độc lập chính xác về giải phẫu; không hứa chạy/đánh như footage game.

Cues mới đồng bộ SFX tại các mốc ra đòn. Sau git pull chạy `npm run audio` lại để cập nhật nhạc. Check bổ sung chuyển động cục bộ hữu hạn và ảnh QA các mốc nhập cảnh/cận/ra đòn. Các asset hình gốc được giữ nguyên.
