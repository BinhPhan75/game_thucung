# Giọng đọc Google Translate TTS

Game gọi `/api/tts?q=...` cùng website; máy chủ lấy MP3 tiếng Việt từ Google Translate (`client=tw-ob`, `tl=vi`). Không dùng proxy công cộng của bên thứ ba, không cần API key và không quay về giọng hệ điều hành khi lỗi.

## Chạy và triển khai

- Phát triển: `npm install`, `npm run dev`.
- Máy chủ Node.js: `npm run build`, `npm start` (cần cài cả devDependencies để có tsx).
- Vercel: build Vite như thường; `api/tts.ts` cung cấp Node.js Function dùng chung handler.
- Hosting chỉ phục vụ tệp tĩnh (ví dụ GitHub Pages) không đủ: cần backend cho `/api/tts`. Không chỉ upload thư mục `dist`.

## Hoạt động

- Câu hỏi tự đọc, nút nghe lại và bật/tắt nằm trong khung bài học.
- Câu được chia ở dấu câu/từ, mỗi đoạn tối đa 180 ký tự; lời đọc phát nối tiếp.
- Proxy chỉ gọi một host Google cố định, thời gian chờ 8 giây, tối đa 256 KB/đoạn, tối đa 4 yêu cầu đồng thời trong mỗi tiến trình. Cache tối đa 64 đoạn trong một giờ, không ghi dữ liệu vào đĩa.
- Khi bị chặn tự phát trên điện thoại hoặc mạng lỗi, nút thử lại xuất hiện. Tắt tiếng hủy cả câu hiện tại và hàng đợi.
- Văn bản câu nói, gồm tên bé và tên thú cưng nếu được chèn vào câu, được gửi tới Google.

Google Translate không có tùy chọn riêng giọng nữ miền Nam hay mức truyền cảm. Đây là endpoint không chính thức, có thể bị giới hạn hoặc thay đổi; cần Internet. Cùng nguồn MP3 giúp tránh giọng khác nhau do hệ điều hành nhưng không bảo đảm dịch vụ giữ nguyên giọng mãi mãi.

Đã thử proxy local trả HTTP 200/audio-mpeg và xác nhận trình duyệt phát âm thanh. Cần thử tiếp trên Safari iPhone, Chrome Android và hosting thực tế.

Kiểm tra: `node --test tests/*.test.mjs`, `npm run lint`, `npm run build`.
