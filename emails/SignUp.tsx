import Base from "./Base";

export default function SignUp({
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
      headline="Welcome Aboard"
      brandName={brandName}
      domain={domain}
      firstName={firstName}
      greeting="Thanks for signing up. We are excited to see what you'll build."
      blockUrl={blockUrl}
      reason={`This mail is sent to you because you have signed up to ${brandName}. If you didn't sign up, please ignore.`}
    >
      <a
        href={url}
        style={`
		font-size:22px; 
		font-weight:bold;
		border-radius:2px;
	`}
      >
        Sign In
      </a>
      <p style={`font-size="15px"; padding-left="25px"; padding-right="25px"`}>
        We are excited to see what you'll build. Click the button below to
        verify your email and sign in to {brandName}.
      </p>
      <p>{url}</p>
      <p
        style={`
		font-size="15px";
		padding-left="25px";
		padding-right="25px";`}
      >
        Thanks, <br />
        {brandName} Team
      </p>
    </Base>
  );
}
