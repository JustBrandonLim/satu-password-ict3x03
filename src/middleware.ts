import { NextRequest, NextResponse } from "next/server";

export async function middleware(nextRequest: NextRequest) {
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

          const nextResponse: NextResponse = NextResponse.redirect(new URL("/home", nextRequest.url));
          nextResponse.cookies.set("encryptedjwt", checkResponseData.newEncryptedJwt);

          return nextResponse;
        } else {
          const nextResponse: NextResponse = NextResponse.next();
          nextResponse.cookies.delete("encryptedjwt");

          return nextResponse;
        }
      }

      return NextResponse.next();
    case "/home":
      if (encryptedJwt !== undefined) {
        const checkResponse = await fetch(`${process.env.BASE_URL}/api/check`, {
          method: "GET",
          headers: {
            Cookie: nextRequest.cookies.toString(),
          },
        });

        if (checkResponse.ok) {
          const checkResponseData = await checkResponse.json();

          const nextResponse: NextResponse = NextResponse.next();
          nextResponse.cookies.set("encryptedjwt", checkResponseData.newEncryptedJwt);

          return nextResponse;
        } else {
          const nextResponse: NextResponse = NextResponse.redirect(new URL("/", nextRequest.url));
          nextResponse.cookies.delete("encryptedjwt");

          return nextResponse;
        }
      }

      return NextResponse.redirect(new URL("/", nextRequest.url));
    case "/api/vault/retrieve/passwords":
    case "/api/vault/retrieve/password":
    case "/api/vault/retrieve/note":
    case "/api/vault/retrieve/notes":
    case "/api/vault/store/password":
    case "/api/vault/store/note":
      if (encryptedJwt !== undefined) {
        const checkResponse = await fetch(`${process.env.BASE_URL}/api/check`, {
          method: "GET",
          headers: {
            Cookie: nextRequest.cookies.toString(),
          },
        });

        if (checkResponse.ok) {
          const checkResponseData = await checkResponse.json();

          const nextResponse: NextResponse = NextResponse.next();
          nextResponse.cookies.set("encryptedjwt", checkResponseData.newEncryptedJwt);

          return nextResponse;
        } else {
          const nextResponse: NextResponse = NextResponse.json({ message: "Something went wrong!" }, { status: 400 });
          nextResponse.cookies.delete("encryptedjwt");

          return nextResponse;
        }
      }

      return NextResponse.json({ message: "Something went wrong!" }, { status: 400 });
  }

  return NextResponse.next();
}