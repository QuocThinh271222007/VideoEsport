# VideoEsport — giới thiệu ban thể thao điện tử

Bản nháp hình ảnh **48 giây, 16:9**, dùng Three.js + chữ HTML. Sáu cảnh: mở màn → Valorant → Free Fire → Liên Quân → đồng đội → lời mời tham gia. Tên ban đang để tạm theo yêu cầu. **Chưa có nhạc, lời đọc, logo CLB hoặc thông tin tuyển thành viên.**

## Chạy trên Windows / VS Code

Cần Node.js 22.12+ hoặc 24 LTS. Mở terminal tại thư mục dự án:

```powershell
npm ci
npm run assets
```

Giải nén `files.zip` người dùng cung cấp ra một thư mục, rồi nhập ảnh:

```powershell
npm run import:valorant -- "C:\duong-dan\files"
npm run dev
```

Mở địa chỉ localhost mà Vite in ra. Có nút phát/dừng, thanh tua và toàn màn hình. Có thể thay bước tải/import bằng cách giải nén `VideoEsport-Assets.zip` vào gốc repo sao cho ảnh nằm ở `public/assets/…`.

## Xuất MP4

Cài FFmpeg, thêm vào PATH; kiểm tra `ffmpeg -version`. Cài trình duyệt render:

```powershell
npx playwright install chromium
npm run check
npm run render -- --width=1920 --fps=60
```

Xem nhanh, xuất 720p30:

```powershell
npm run render -- --width=1280 --fps=30
```

Thêm nhạc bạn có quyền sử dụng:

```powershell
npm run render -- --width=1920 --fps=60 "--audio=C:\Music\track.wav"
```

MP4 nằm trong `output/`. Render từng frame nên thời gian render có thể lâu hơn thời lượng video. Không phụ thuộc tốc độ phát preview. Nếu có Chrome cài riêng, đặt `CHROME_PATH` tới file thực thi (PowerShell: `$env:CHROME_PATH="C:\...\chrome.exe"`).

## Chỉnh sửa / làm cùng Claude

- `src/config.js`: timeline, tên ban, tiêu đề, mô tả, màu, đường dẫn ảnh.
- `src/main.js`: scene Three.js, camera, chuyển động, API seek chính xác.
- `src/style.css`: font, vị trí chữ, vùng tối bảo vệ khả năng đọc.
- `docs/CLAUDE_HANDOFF.md`: trạng thái hiện tại, hướng tiếp tục, các dữ liệu còn thiếu.
- `docs/STORYBOARD.md`: nội dung từng cảnh.
- `docs/ASSET_GUIDE.md`, `docs/asset-sources.json`: nguồn ảnh và checksum.

Các file ảnh nhị phân, nhạc và video xuất được bỏ qua bởi Git. Repo có script tải 10 ảnh chính thức và nhập đủ 22 PNG Valorant do người dùng cung cấp. Không cần tải asset qua mạng lúc đang render, sau khi đã chuẩn bị xong.

## Kiểm tra

`npm run build` tạo bản web; `npm run check` kiểm tra asset/checksum, timeline liên tục, mốc scene, lỗi trình duyệt và tính lặp lại khi tua tới cùng một thời điểm. Sáu ảnh kiểm tra nằm ở `output/qa/`.

Mã hiện tại là bản khởi đầu để duyệt hướng hình ảnh, chưa phải video phát hành chính thức. Artwork game thuộc chủ sở hữu tương ứng; nguồn chính thức không đồng nghĩa giấy phép sử dụng không giới hạn.
