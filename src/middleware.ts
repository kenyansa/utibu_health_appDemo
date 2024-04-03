import { NextRequest, NextResponse } from "next/server"
import { isValidPassword } from "./lib/isValidPassword"

export async function middleware(req: NextRequest) {
  if ((await isAuthenticated(req)) === false) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": "Basic" },
    })
  }
}

async function isAuthenticated(req: NextRequest) {
  const authHeader =
    req.headers.get("authorization") || req.headers.get("Authorization")

  if (authHeader == null) return false

  const [username, password] = Buffer.from(authHeader.split(" ")[1], "base64")
    .toString()
    .split(":")
    
//   return (
//     username === process.env.ADMIN_USERNAME &&
//     (await isValidPassword(
//       password,
//       process.env.HASHED_ADMIN_PASSWORD as string
//     ))
//   )
// }
try {
    const isValid = await isValidPassword(
      password,
      process.env.HASHED_ADMIN_PASSWORD as string
    );
    
    return username === process.env.ADMIN_USERNAME && isValid;
  } catch (error) {
    console.error("Error occurred during password validation:", error);
    return false;
  }
}

export const config = {
  matcher: "/admin/:path*",
}