import { NextRequest, NextResponse } from "next/server";

export async function middleware(nextRequest: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
`;

  const requestHeaders = new Headers(nextRequest.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", cspHeader.replace(/\s{2,}/g, " ").trim());

  const encryptedJwt = nextRequest.cookies.get("encryptedjwt")?.value;

  switch (nextRequest.nextUrl.pathname) {
    case "/":
    case "/register":
      if (encryptedJwt !== undefined) {
        const checkResponse = await fetch(`${process.env.BASE_URL}/api/check`, {
          method: "GET",
          headers: {
            Cookie: nextRequest.cookies.toString(),
          },
        });

        if (checkResponse.ok) {
          const checkResponseData = await checkResponse.json();

          const nextResponse: NextResponse = NextResponse.redirect(new URL("/home", nextRequest.url), {
            headers: requestHeaders,
          });
          nextResponse.cookies.set("encryptedjwt", checkResponseData.newEncryptedJwt, {
            httpOnly: true,
            sameSite: "strict",
            secure: true,
          });

          return nextResponse;
        } else {
          const nextResponse: NextResponse = NextResponse.next({
            headers: requestHeaders,
            request: {
              headers: requestHeaders,
            },
          });
          nextResponse.cookies.delete("encryptedjwt");

          return nextResponse;
        }
      }

      return NextResponse.next();
    case "/home":
    case "/profile":
      if (encryptedJwt !== undefined) {
        const checkResponse = await fetch(`${process.env.BASE_URL}/api/check`, {
          method: "GET",
          headers: {
            Cookie: nextRequest.cookies.toString(),
          },
        });

        if (checkResponse.ok) {
          const checkResponseData = await checkResponse.json();

          const nextResponse: NextResponse = NextResponse.next({
            headers: requestHeaders,
            request: {
              headers: requestHeaders,
            },
          });
          nextResponse.cookies.set("encryptedjwt", checkResponseData.newEncryptedJwt, {
            httpOnly: true,
            sameSite: "strict",
            secure: true,
          });

          return nextResponse;
        } else {
          const nextResponse: NextResponse = NextResponse.redirect(new URL("/", nextRequest.url), {
            headers: requestHeaders,
          });
          nextResponse.cookies.delete("encryptedjwt");

          return nextResponse;
        }
      }

      return NextResponse.redirect(new URL("/", nextRequest.url));
    case "/api/profile":
    case "/api/vault/retrieve/passwords":
    case "/api/vault/retrieve/password":
    case "/api/vault/retrieve/note":
    case "/api/vault/retrieve/notes":
    case "/api/vault/store/password":
    case "/api/vault/store/note":
    case "/api/vault/update/password":
    case "/api/vault/update/note":
    case "/api/vault/delete/password":
    case "/api/vault/delete/note":
      if (encryptedJwt !== undefined) {
        const checkResponse = await fetch(`${process.env.BASE_URL}/api/check`, {
          method: "GET",
          headers: {
            Cookie: nextRequest.cookies.toString(),
          },
        });

        if (checkResponse.ok) {
          const checkResponseData = await checkResponse.json();

          const nextResponse: NextResponse = NextResponse.next({
            headers: requestHeaders,
            request: {
              headers: requestHeaders,
            },
          });
          nextResponse.cookies.set("encryptedjwt", checkResponseData.newEncryptedJwt, {
            httpOnly: true,
            sameSite: "strict",
            secure: true,
          });

          return nextResponse;
        } else {
          const nextResponse: NextResponse = NextResponse.json(
            { message: "Something went wrong!" },
            {
              status: 400,
              headers: requestHeaders,
            }
          );
          nextResponse.cookies.delete("encryptedjwt");

          return nextResponse;
        }
      }
      return NextResponse.json(
        { message: "Something went wrong!" },
        {
          status: 400,
          headers: requestHeaders,
        }
      );
  }

  return NextResponse.next({
    headers: requestHeaders,
    request: {
      headers: requestHeaders,
    },
  });
}
