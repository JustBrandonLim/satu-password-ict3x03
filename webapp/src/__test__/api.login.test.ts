import { enableFetchMocks } from "jest-fetch-mock";
enableFetchMocks();

import { NextRequest, NextResponse } from "next/server";
import { createMocks } from "node-mocks-http";

import { POST } from "../app/api/login/route";
import { prismaMock } from "./singleton";

import { authenticator } from "otplib";

describe("/api/login", () => {
  test("login successfully", async () => {
    const totpSecret =
      "22c17998569e6c46bcf28c31a7635f6bc5c96c7ee2cae5042f3f093fec4f4622";
    const otpNow = authenticator.generate(totpSecret);

    const { req, res } = createMocks({
      method: "POST",
      url: `${process.env.BASE_URL}/api/login`,
      body: { email: "alford@hentai.com", password: "12345678", otp: otpNow },
      headers: { "Content-Type": "application/json" },
    });

    const testReq = new NextRequest(req, {});
    console.log(testReq);

    const response = await POST(testReq);

    expect(response.status).toBe(200);
    console.log(response);
  });
});
