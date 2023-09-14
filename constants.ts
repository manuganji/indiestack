export const dev = process.env.NEXT_PUBLIC_VERCEL_ENV === "development";

export const preview = process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";

export const prod = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";

export const AWS_REGION = "eu-central-1";

export const EMAIL_COOKIE = "auth-email";
export const SESSION_COOKIE = "session_token";
export const LOCAL_USER = "local-user";
export const LONG_SESSION_COOKIE = "long-session";
export const SECS_IN_DAY = 86400;

export const SIGN_UP_PATH: __next_route_internal_types__.StaticRoutes =
  "/sign-up";
export const SIGN_IN_PATH: __next_route_internal_types__.StaticRoutes =
  "/sign-in";
export const SIGN_OUT_PATH: __next_route_internal_types__.StaticRoutes =
  "/sign-out";
export const SESSION_PATH: __next_route_internal_types__.StaticRoutes =
  "/session";

export const WIDGET_IDS = {
  COVER: 1,
  BENEFITS: 2,
  TESTIMONIALS: 3,
};

export const RECAPTCHA_VERIFICATION_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
// 'https://www.google.com/recaptcha/api/siteverify';
export const RECAPTCHA_FORM_FIELD_NAME = "cf-turnstile-response";

export const POST_AUTH_REDIRECT_URL = "/dash";
