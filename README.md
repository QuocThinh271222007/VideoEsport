# VideoEsport — Action Trailer v3

Video ngang **56 giây**, dựng theo nhịp trailer hành động: cảnh rộng → cận → ra đòn, chuyển động thân/tay/đầu trên lưới ảnh, camera đổi góc và hiệu ứng theo từng nhân vật. Mục tiêu xuất **1920×1080 / 60fps**. Tên ban đang dùng chữ tạm đã được người dùng chọn; chưa có logo CLB chính thức và lời đọc.

## Chạy ngay từ repo

Cần Node.js 22.12+ (hoặc 24 LTS) và FFmpeg trong PATH. Các ảnh WebP đang dùng đã có trong repo, không cần tải lại ZIP để xem video.

```powershell
npm ci
npm run setup
npm run dev
```

`setup` tải bản nhạc gốc từ tác giả (kiểm tra SHA-256), cắt/phối nhạc với SFX và tạo dữ liệu cường độ âm thanh cho ánh sáng. Khi xong, preview và render dùng file cục bộ, không tải mạng trong từng frame. Mở địa chỉ localhost Vite in ra; nhấn Phát để bắt đầu cả hình và tiếng. Có tua, tắt/bật tiếng, toàn màn hình.

## Xuất video

```powershell
npx playwright install chromium
npm run check
npm run render -- --width=1920 --fps=60 --out=output/VideoEsport-Action-v3-1080p60.mp4
```

Xem nhanh: `npm run render -- --width=1280 --fps=30`. Xuất đoạn thử: thêm `--from=6 --to=12`. Mỗi frame lấy thời gian chính xác; tốc độ máy chỉ ảnh hưởng thời gian chờ render. `CHROME_PATH` có thể trỏ tới Chrome có sẵn nếu không tải được trình duyệt Playwright.

## Thay đổi v3 sau phản hồi người dùng

- Bỏ bố cục trình chiếu, khung artwork và cột chữ cố định. Tên game chỉ xuất hiện ngắn; hình ảnh chiếm toàn màn hình.
- Mỗi lượt có nhiều cỡ cảnh và cắt góc rõ: nhập cảnh, toàn thân, cận, hành động/thoát cảnh.
- Lưới ảnh có chuyển động cục bộ ở vai/tay, đầu, ngực, chân và áo choàng. Các biến đổi phụ thuộc thời gian tuyệt đối nên tua lại không lệch.
- Neon: lao chéo, vệt ảnh và tia điện. Omen: nổi trong khói/cổng tím. Yoru: lướt và vệt chém xanh. Viper: nhịp thân/tay và khí xanh.
- Free Fire/Liên Quân: artwork tràn khung, chuyển góc cận, biến dạng cục bộ nhẹ và hiệu ứng hành động. Chưa có ảnh tách từng bộ phận hay model rigged; không mô tả đây là animation gameplay.
- Nhạc/SFX được phối lại theo thêm các mốc ra đòn (2,78 giây trong từng lượt) và đoạn hội tụ.

## Nội dung và chuyển động

- 00–06: camera tiến qua không gian khung sáng, mở chủ đề đồng đội.
- 06–22: **Neon → Omen → Yoru → Viper**, mỗi nhân vật một màn tiến từ xa, cận dần, rời khung để nhường nhân vật tiếp theo.
- 22–34: ba artwork Free Fire lần lượt tiến vào không gian với góc nghiêng và lớp tiền cảnh.
- 34–46: **Nakroth → Triệu Vân → Valhein** xuất hiện theo lượt trên các khung artwork 3D.
- 46–50: ba game hội tụ trong một bố cục.
- 50–56: lời mời tham gia và credit nhạc.

Nhân vật là artwork 2D đặt trong không gian 3D (2.5D), không phải model có bộ xương để diễn hoạt tay/chân. Free Fire/Liên Quân hiện dùng artwork nguyên khung; đây là lựa chọn giữ nguyên hình gốc khi chưa có ảnh tách nền/model.

## Nhạc / lồng tiếng

Nhạc **The Fury — Scott Buckley**, CC BY 4.0, dùng miễn phí khi ghi nguồn đúng. Copy credit trong [docs/MUSIC_CREDITS.md](docs/MUSIC_CREDITS.md) vào mô tả khi đăng video. Nhạc được cắt đoạn và phối hiệu ứng; không tuyên bố không có bản quyền hoặc không bao giờ bị Content ID.

[Hướng dẫn giọng Việt hào hùng và ghép giọng](docs/VOICE_GUIDE.md). Hai cách: tạo giọng sẵn trên ElevenLabs rồi tải file, hoặc dùng script API với khóa của bạn. Nhạc tự giảm khi có lời đọc. Chưa có lời đọc trong video hiện tại vì người dùng chưa gửi đoạn văn.

```powershell
npm run mix:voice -- output/VideoEsport-Action-v3-1080p60.mp4 output/narration.mp3 output/VideoEsport-with-voice.mp4 0
```

## Chỉnh sửa cùng Claude

- `src/config.js`: timeline, nhân vật, chữ, màu, nhạc và mốc âm thanh.
- `src/world.js`: bố trí không gian, đường xuất hiện nhân vật, camera, ánh sáng.
- `src/main.js`, `src/style.css`: typography, preview, đồng bộ thời gian âm thanh.
- `scripts/audio.mjs`, `scripts/render.mjs`: phối nhạc/giọng và xuất MP4.
- [docs/CLAUDE_HANDOFF.md](docs/CLAUDE_HANDOFF.md): quyết định và phần tiếp tục.

`docs/runtime-assets.json` kiểm tra các ảnh bắt buộc; `docs/asset-sources.json` lưu nguồn ảnh gốc. Repo đã chứa toàn bộ 64 ảnh gốc và WebP; `docs/all-assets.json` lưu checksum. Tải lại ảnh Garena khi cần: `npm run assets`; import ZIP Valorant khác sau khi giải nén: `npm run import:valorant -- "C:\path\files"`.

Asset game thuộc các chủ sở hữu tương ứng; ghi nguồn trong [docs/ASSET_GUIDE.md](docs/ASSET_GUIDE.md). Repo chứa cả 22 PNG Valorant gốc, 10 JPG Free Fire/Liên Quân và 32 bản WebP. Nhạc gốc tải qua setup; khóa API và file render không được commit.
