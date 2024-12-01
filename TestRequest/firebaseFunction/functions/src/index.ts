import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
// generate get function for firebase functions
export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});
export const heavyFunction = onRequest((req, res) => {
  // Lấy thời gian bắt đầu
  const startTime = process.hrtime.bigint();
  // Lấy RAM ban đầu
  const initialMemoryUsage = process.memoryUsage().heapUsed;
  // Tạo mảng lớn
  const largeArray = Array.from({ length: 1e6 }, () => Math.random());
  // Sắp xếp mảng
  const sortedArray = largeArray.sort((a, b) => b - a);
  // Lấy thời gian kết thúc
  const endTime = process.hrtime.bigint();
  // Lấy RAM sau khi xử lý
  const finalMemoryUsage = process.memoryUsage().heapUsed;
  const executionTime = Number(endTime - startTime) / 1e6;
  const memoryUsed = (finalMemoryUsage - initialMemoryUsage) / (1024 * 1024);
  // Xuất kết quả
  res.json({
    sortedArrayLength: sortedArray.length,
    executionTime: `${executionTime.toFixed(2)} ms`,
    memoryUsed: `${memoryUsed.toFixed(2)} MB`,
  });
});

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info('Hello logs!', {structuredData: true});
//   response.send('Hello from Firebase!');
// });
