# DeepSeek Chatbox

DeepSeek Chatbox là một ứng dụng web cho phép người dùng tương tác với mô hình AI thông qua giao diện chat, tải lên file để phân tích, và xem lịch sử tin nhắn. Dự án bao gồm hai phần chính: **backend** (Node.js + Express) và **frontend** (React).

---

## 🛠️ Công nghệ sử dụng

### Backend
- **Node.js**: Runtime môi trường cho JavaScript.
- **Express**: Framework để xây dựng API.
- **MongoDB**: Cơ sở dữ liệu NoSQL để lưu trữ lịch sử tin nhắn.
- **Mongoose**: ODM để tương tác với MongoDB.
- **TypeScript**: Ngôn ngữ lập trình với kiểu tĩnh.

### Frontend
- **React**: Thư viện JavaScript để xây dựng giao diện người dùng.
- **Axios**: Thư viện để gọi API.
- **TypeScript**: Ngôn ngữ lập trình với kiểu tĩnh.

---

## 🚀 Cách chạy dự án

### 1. Clone repository
```bash
git clone <repository-url>
cd deepseek-chatbox



📂 Cấu trúc thư mục
Backend
css
Copy
Edit
backend/
├── src/
│   ├── app.ts                # Cấu hình Express app
│   ├── server.ts             # Điểm khởi động server
│   ├── config/
│   │   └── db.ts             # Kết nối MongoDB
│   ├── controllers/
│   │   └── chat.controller.ts # Xử lý các route API
│   ├── models/
│   │   └── message.model.ts  # Mô hình MongoDB cho tin nhắn
│   ├── routes/
│   │   └── chat.routes.ts    # Định nghĩa các route API
│   ├── services/
│   │   └── chat.service.ts   # Logic xử lý chính
│   ├── utils/
│   │   └── ollama.ts         # Giao tiếp với mô hình Ollama
├── .env                      # Biến môi trường
├── .gitignore                # Các tệp/thư mục cần bỏ qua
Frontend
css
Copy
Edit
frontend/
├── public/
│   └── index.html            # Tệp HTML gốc
├── src/
│   ├── App.tsx               # Thành phần chính của ứng dụng
│   ├── index.tsx             # Điểm khởi động React
│   ├── components/
│   │   ├── ChatBox.tsx       # Giao diện chat
│   │   ├── FileUploader.tsx  # Giao diện tải lên file
│   │   ├── MessageHistory.tsx # Hiển thị lịch sử tin nhắn
│   ├── services/
│   │   └── api.ts            # Gọi API từ backend
├── .env                      # Biến môi trường
├── .gitignore                # Các tệp/thư mục cần bỏ qua



📌 Tính năng chính
Gửi tin nhắn và nhận phản hồi từ AI: Người dùng có thể gửi tin nhắn và nhận phản hồi từ mô hình AI.

Tải lên file để phân tích: Người dùng có thể tải lên file văn bản để hệ thống phân tích nội dung.

Xem lịch sử tin nhắn: Hiển thị lịch sử các tin nhắn đã gửi và phản hồi từ AI.

Kết nối với mô hình AI thông qua Ollama: Backend giao tiếp với mô hình AI thông qua API của Ollama.

Quản lý file tải lên: File tải lên được lưu tạm thời và tự động xóa sau khi xử lý.

Cấu hình linh hoạt: Sử dụng tệp .env để cấu hình các thông tin như MongoDB, mô hình AI, và cổng server.