import { NextResponse } from "next/server";

export async function POST() {
  const nextResponse: NextResponse = NextResponse.json({ message: "Success!" });
  nextResponse.cookies.delete("ejwt");

  return nextResponse;
}
