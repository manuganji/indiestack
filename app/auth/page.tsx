// check if any page for the request
// show 404
//
import NextAuth from "next-auth";
import { createTestAccount } from "nodemailer";
import { dev } from "@/constants";
import Email from "next-auth/providers/email";

const EMAIL_TEST_ACCOUNT = await createTestAccount();
if (dev) {
	console.log(EMAIL_TEST_ACCOUNT.user, EMAIL_TEST_ACCOUNT.pass, EMAIL_TEST_ACCOUNT.web);
}


export default async function Auth() {
  if (dev) {
    email_config = await createTestAccount();
  } else {
    email_config = 
  }
  return <NextAuth providers={Email({
    from: process.env.EMAIL_FROM,
    server: {
      
    }
  })} />;
}
