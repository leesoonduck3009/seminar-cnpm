import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '3m', target: 50 },  // Tăng dần lên 50 VUs trong 3 phút
    { duration: '6m', target: 100 }, // Duy trì 100 VUs trong 6 phút
    { duration: '3m', target: 50 },  // Giảm dần còn 50 VUs trong 3 phút
    { duration: '3m', target: 0 },   // Dừng hoàn toàn trong 3 phút cuối
  ],
};

export default function () {
  const url = 'https://us-central1-rythm-party.cloudfunctions.net/helloWorld'; // Thay bằng URL của Firebase Function
  const response = http.get(url);

  // Kiểm tra trạng thái phản hồi
  if (response.status !== 200) {
    console.error(`Unexpected status: ${response.status}`);
  }

  sleep(1); // Tạm dừng 1 giây giữa các yêu cầu
}
