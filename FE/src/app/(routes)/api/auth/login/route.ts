import { HttpService } from "@/services/httpService";
import { NextResponse } from "next/server";

export async function GET() {
  const httpService = new HttpService();
  const response = await httpService.get("/User");
  console.log(response);
  return NextResponse.json({ message: "Hello from Next.js!" });
}
export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json({ message: "Data received", data: body });
}
// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { method } = req;
//   console.log(req);
//   switch (method) {
//     case "GET":
//       // Xử lý logic GET

//       break;

//     case "POST":
//       // Xử lý logic POST, ví dụ lấy dữ liệu từ req.body
//       const newUser = req.body;
//       // Lưu newUser vào cơ sở dữ liệu hoặc làm việc gì đó
//       res.status(201).json({ message: "User created", user: newUser });
//       break;

//     case "PUT":
//       // Xử lý logic PUT, ví dụ cập nhật dữ liệu người dùng
//       const updatedUser = req.body;
//       // Cập nhật user trong cơ sở dữ liệu
//       res.status(200).json({ message: "User updated", user: updatedUser });
//       break;

//     case "DELETE":
//       // Xử lý logic DELETE, ví dụ xóa người dùng dựa trên ID
//       const userId = req.query.id;
//       // Xóa user trong cơ sở dữ liệu
//       res.status(200).json({ message: `User with ID ${userId} deleted` });
//       break;

//     default:
//       // Xử lý method không được hỗ trợ
//       res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
//       res.status(405).end(`Method ${method} Not Allowed`);
//       break;
//   }
// }
