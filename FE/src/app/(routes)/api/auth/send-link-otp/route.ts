import { HttpService } from "@/services/httpService";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const httpService = new HttpService();
  const response = await httpService.post("/User/api/send-otp", body);

  return NextResponse.json({
    message: "Data received",
    data: body,
    response: response,
  });
}
