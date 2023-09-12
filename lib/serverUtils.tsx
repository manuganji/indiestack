import "server-only";

import {
  AWS_REGION,
  RECAPTCHA_FORM_FIELD_NAME,
  RECAPTCHA_VERIFICATION_URL,
  dev,
} from "@/constants";
import { runQuery } from "@/db";
import { S3 } from "@aws-sdk/client-s3";
import * as aws from "@aws-sdk/client-ses";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { HttpStatusCode } from "axios";
import { customAlphabet } from "nanoid";
import { headers } from "next/headers";
import nodemailer from "nodemailer";
import { htmlToText } from "nodemailer-html-to-text";
import { cache } from "react";
import {
  NotExactlyOneError,
  selectExactlyOne,
  selectOne,
  upsert,
} from "zapatos/db";
import SignIn from "@/emails/SignInMail";
import SignUp from "@/emails/SignUpMail";
import WelcomeMail from "@/emails/WelcomeMail";
import { env } from "process";
import { render } from "@react-email/render";
import { properties } from "zapatos/schema";

export const getHostName = () => headers().get("host")!;

export const upsertDomain = async (domain: string, name?: string) => {
  const res = await runQuery(
    upsert(
      "properties",
      {
        id: shortId(10),
        email_from: `no-reply@${domain}`,
        domain,
        name: name ?? domain,
      },
      {
        value: "properties_pkey",
      }
    )
  );
  return res;
};

let EMAIL_TEST_ACCOUNT: nodemailer.TestAccount;
if (dev) {
  nodemailer.createTestAccount().then((account) => {
    EMAIL_TEST_ACCOUNT = account;
    console.log(
      EMAIL_TEST_ACCOUNT.user,
      EMAIL_TEST_ACCOUNT.pass,
      EMAIL_TEST_ACCOUNT.web
    );
  });
}

export function getTransporter() {
  let transporter: nodemailer.Transporter;
  if (dev) {
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: EMAIL_TEST_ACCOUNT.user,
        pass: EMAIL_TEST_ACCOUNT.pass,
      },
    });
  } else {
    const ses = new aws.SES({
      credentials: defaultProvider(),
      region: AWS_REGION,
    });
    transporter = nodemailer.createTransport({
      SES: { ses, aws },
      sendingRate: 1,
    });
  }
  transporter.use(
    "compile",
    htmlToText({
      wordwrap: 130,
    })
  );
  return transporter;
}

export const getCurrentProperty = cache(
  async (): Promise<properties.JSONSelectable> => {
    try {
      const property = await runQuery(
        selectExactlyOne("properties", {
          domain: getHostName(),
        })
      );
      return property;
    } catch (e) {
      if (e instanceof NotExactlyOneError) {
        console.error(e);
        throw new Error("Multiple properties found for domain");
      }
      const property = upsertDomain(getHostName());
      return property;
    }
  }
);

export async function sendMailOnSignUp({
  email,
  url,
  firstName,
  blockUrl,
}: {
  firstName: string;
  email: string;
  url: string;
  blockUrl: string;
}) {
  // const textContent = `Use the following link to sign in to {BRAND_NAME}: ${url}`;
  // const htmlContent = `<p>Use the following link to sign in to {BRAND_NAME}: <a href="${url}">${url}</a></p>`;

  const property = await getCurrentProperty();
  const subject = `Sign in to ${property.name}`;
  const transporter = getTransporter();
  const info = await transporter.sendMail({
    from: property.email_from,
    to: email,
    subject,
    // text: textContent,
    html: render(
      <SignUp
        {...{
          firstName,
          url,
          blockUrl,
          domain: property.domain,
          brandName: property.name,
        }}
      />
    ),
  });
  if (dev) {
    console.log("login url: ", url);
    console.log("Preview URL: ", nodemailer.getTestMessageUrl(info));
  }
}

export async function sendWelcomeMail({
  email,
  firstName,
}: {
  firstName: string;
  email: string;
}) {
  const property = await getCurrentProperty();
  const subject = `Welcome to ${property.name}`;
  const transporter = getTransporter();
  const info = await transporter.sendMail({
    from: property.email_from,
    to: email,
    subject,
    html: render(
      <WelcomeMail
        {...{
          firstName,
          domain: property.domain,
          brandName: property.name,
        }}
      />
    ),
  });
  if (dev) {
    console.log("Preview URL: ", nodemailer.getTestMessageUrl(info));
  }
}

export async function sendMagicLink({
  email,
  url,
  firstName,
  blockUrl,
}: {
  firstName: string;
  email: string;
  url: string;
  blockUrl: string;
}) {
  // const textContent = `Use the following link to sign in to {BRAND_NAME}: ${url}`;
  // const htmlContent = `<p>Use the following link to sign in to {BRAND_NAME}: <a href="${url}">${url}</a></p>`;
  const property = await getCurrentProperty();
  const subject = `Sign in to ${property.name}`;
  const transporter = getTransporter();
  const info = await transporter.sendMail({
    from: property.email_from,
    to: email,
    subject,
    html: render(
      <SignIn
        blockUrl={blockUrl}
        url={url}
        firstName={firstName}
        domain={property.domain}
        brandName={property.name}
      />
    ),
  });
  if (dev) {
    console.log("login url: ", url);
    console.log("Preview URL: ", nodemailer.getTestMessageUrl(info));
  }
}

export async function isDisposableEmail(email: string) {
  const API_BASE_URL = "https://api.mailcheck.ai";
  const domain = email.split("@")[1].trim();
  const resp = await fetch(`${API_BASE_URL}/domain/${domain}`, {
    method: "GET",
  }).then<{
    status:
      | HttpStatusCode.Ok
      | HttpStatusCode.BadRequest
      | HttpStatusCode.TooManyRequests;
    domain: string;
    mx: boolean;
    disposable: boolean;
    did_you_mean: string | null;
  }>((res) => res.json());

  if (resp.status === HttpStatusCode.TooManyRequests) {
    console.error("Rate limit reached for mailcheck.");
    return true;
  }

  return resp.disposable;
  // try {
  // 	await disClient.validate();
  // 	const query = sql<disposable_email_domains.SQL>`SELECT domain
  // 		FROM disposable_email_domains
  // 		WHERE split_part(${param(email)}, '@', 2) ILIKE ('%' || domain)
  // 		AND char_length(domain) > 0
  // 		LIMIT 1`;
  // 	const result = await runQuery(query);
  // 	return result.length > 0;
  // } catch (e) {
  // 	console.error(e);
  // 	return false;
  // }
}

export async function isBlockedEmail(email: string) {
  try {
    return (
      (await runQuery(
        selectOne(
          "block_list",
          { email, active: true },
          {
            columns: ["email", "active"],
          }
        )
      )) !== undefined
    );
  } catch (e) {
    console.error(e);
    return false;
  }
}

export const checkCaptchaToken = async function (formData: FormData) {
  if (formData.has(RECAPTCHA_FORM_FIELD_NAME)) {
    const captchaToken = formData.get(RECAPTCHA_FORM_FIELD_NAME);
    // const verificationPayload = {
    // 	secret: env.RECAPTCHA_SECRET,
    // 	response: captchaToken as string
    // };
    // console.log('verificationPayload', verificationPayload);
    const { success, action, ...rest } = await fetch(
      RECAPTCHA_VERIFICATION_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${env.RECAPTCHA_SECRET}&response=${captchaToken}`,
      }
    ).then<{
      success: boolean;
      challenge_ts: string;
      hostname: string;
      "error-codes": any[];
      action: string;
      cdata: string;
    }>((res) => res.json());
    // console.log(success, rest, score, action);
    if (!success) {
      console.log(rest, captchaToken);
      throw new Error("Verification failed");
    } else {
      return;
    }
  } else {
    throw new Error("No captcha token found");
  }
};

export const s3Client = new S3({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_ID!,
    secretAccessKey: process.env.CLOUDFLARE_ACCESS_SECRET!,
  },
});

// https://zelark.github.io/nano-id-cc/
const ALPHABET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const ID_LENGTH = 12;

export const shortId = customAlphabet(ALPHABET, ID_LENGTH);
