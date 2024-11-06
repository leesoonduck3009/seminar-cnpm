import { Board } from "@/models/board";
import { CreateBoard, GetAllBoard } from "@/services/boardService";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const board = await CreateBoard(body as Board);
    console.log("board", board);
    return NextResponse.json({ message: "Data received", data: board });
  } catch (e: any) {
    return NextResponse.json({ message: "Data received", data: e.message });
  }
}
export async function GET() {
  try {
    const response: Board[] = await GetAllBoard();
    return NextResponse.json({ message: "Data received", data: response });
  } catch (e: any) {
    return NextResponse.json({ message: "Data received", data: e.message });
  }
}
