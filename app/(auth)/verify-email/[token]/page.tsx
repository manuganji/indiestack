import { findVerificatonToken } from "@/auth";
import { TOKEN_IDENTIFIER_COOKIE } from "@/serverConstants";
import { cookies } from "next/headers";

export default async function VerifyEmail({params: {
  token
}}: { params: { token: string } }) {
  const cookie = cookies().get(TOKEN_IDENTIFIER_COOKIE);
  if (!cookie) {
    return 
  }
  const isFound = await findVerificatonToken(token);
}
