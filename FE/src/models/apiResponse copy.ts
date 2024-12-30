import { StatusCode } from "@/enums/statusCode";
export class ApiResponse<T> {
  data: T | null; // Dữ liệu trả về, có thể là null nếu có lỗi
  isSuccess: boolean; // Biến xác định phản hồi có thành công hay không
  errorMessage: string | null; // Thông điệp lỗi, null nếu không có lỗi
  statusCode: StatusCode; // Mã trạng thái HTTP
  constructor(
    data: T | null,
    isSuccess: boolean,
    errorMessage: string | null,
    statusCode: StatusCode
  ) {
    this.data = data;
    this.isSuccess = isSuccess;
    this.errorMessage = errorMessage;
    this.statusCode = statusCode;
  }
}
