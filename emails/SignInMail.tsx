import Base from "./Base";

export default function SignIn({
  firstName,
  blockUrl,
  url,
  domain,
  brandName,
}: {
  firstName: string;
  blockUrl: string;
  url: string;
  domain: string;
  brandName: string;
}) {
  return (
    <Base
      brandName={brandName}
      domain={domain}
      headline="Sign In"
      firstName={firstName}
      greeting="Welcome back!"
      blockUrl={blockUrl}
      reason={`This mail is sent because you requested a magic link to sign in to ${domain}. If you didn't request this, please ignore.`}
    >
      <p
        style={{
          fontSize: "15px",
          paddingLeft: "25px",
          paddingRight: "25px",
        }}
      >
        Click the link below to sign in to {domain}.
      </p>
      <a href={url}>Login</a>
      <p>
        If the link doesn't work, paste this url into your browser and hit
        enter:
      </p>
      <p>{url}</p>
      <p>
        Thanks, <br />
        {brandName} Team
      </p>
    </Base>
  );
}
