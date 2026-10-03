# Bàn giao cho Claude — VideoEsport

## Mục tiêu và quyết định đã có

Video giới thiệu ban thể thao điện tử cho CLB, ba game Free Fire / Liên Quân / Valorant. Người dùng chọn khung ngang 45–60 giây và dùng tên ban tạm. Bản triển khai này dài 48 giây. Không có dữ liệu xác nhận về tên CLB, thành viên, thành tích, lịch tuyển, link đăng ký hoặc nhạc.

## Có sẵn

- Vite + Three.js với ảnh nhân vật trên plane 3D, camera/particles/khung hình học; chữ HTML để tiếng Việt sắc nét.
- Animation lấy thời gian tuyệt đối: `window.__film.seek(seconds)`. Tua ngược hay render offline phải cho cùng một frame.
- Web preview có play/pause, scrub, fullscreen; export mode `?export=1` ẩn control.
- Export Playwright → FFmpeg H.264 yuv420p, mặc định 1080p60, có tham số `--audio=`. Nhạc ngắn được pad; audio fade-out 2 giây cuối; không có nhạc mặc định.
- 10 ảnh chính thức qua downloader + 22 ảnh Valorant người dùng cung cấp qua importer.
- README hướng dẫn Windows; storyboard, nguồn/checksum và browser checks.

## Chia việc đề xuất

Đây là tài liệu để người dùng chuyển cho Claude, chưa có cuộc trao đổi trực tiếp giữa hai agent.

- Codex: nền render, asset pipeline, kiểm tra scene và xuất MP4 đã được triển khai.
- Claude ở vòng tiếp theo: tiếp nhận thông tin CLB, chốt lời đọc và nhạc cùng người dùng, nâng nhịp dựng theo beat, cảnh thành viên, logo và CTA; có thể chỉnh code trực tiếp trên nhánh riêng.
- Trước khi sửa: đọc `src/config.js`, README và tài liệu này; xem thay đổi của nhánh đối tác để tránh ghi đè.

## Những việc cần tiếp tục

1. Xem MP4 nháp, giữ hoặc chỉnh hướng hình ảnh theo phản hồi người dùng.
2. Xin tên/logo CLB, màu nhận diện, nội dung bắt buộc, footage riêng, nhạc có quyền dùng.
3. Thay cảnh đồng đội bằng hình hoạt động thực tế hoặc bố cục ba game, tránh để Valorant lấn át.
4. Làm chuyển cảnh theo nhạc, thêm sound design; kiểm tra không cắt vào lời đọc.
5. Giữ nội dung trong safe area 100 px ở bản 1080p; xem ở màn chiếu thực tế.
6. Chạy `npm run build`, `npm run check`; xem screenshot và đoạn MP4 sau mỗi thay đổi thị giác đáng kể.

Không thêm backend/database. Không gọi artwork plane là model nhân vật 3D. Không tự bịa danh tính thành viên, thành tích hoặc lịch tuyển. Không commit nhạc/ảnh riêng vào repo công khai nếu chưa có chỉ định. Không chuyển sang một framework video khác trừ khi có lợi ích cụ thể được giải thích.

## Môi trường kiểm tra trong phiên Codex

CDN tải browser của Playwright trả HTML thay ZIP trong môi trường này. Đã dùng Chromium từ gói `@sparticuz/chromium` cài tạm, giải nén tại `/tmp/esport-chromium`, truyền `CHROME_PATH` để chạy. Đây là workaround cho máy dựng này, không phải dependency dự án. Trên máy người dùng, ưu tiên `npx playwright install chromium` hoặc Chrome có sẵn.
