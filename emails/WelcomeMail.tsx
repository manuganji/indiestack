import Base from "./Base";

export default function WelcomeMail({
	firstName,
	domain,
	brandName,
}: {
	firstName: string;
	brandName: string;
	domain: string;
}) {
	return (
		<Base
			brandName={brandName}
			domain={domain}
			firstName={firstName}
			greeting={`Thanks for trying out my product. I'm excited to see you here and I want to make sure you get
the highest value out of ${brandName}.`}
			headline="Getting Started"
			reason={`This mail is sent to help new users get started with ${brandName}`}
		>
			<p>
				<b>
					Just curious, how much funding do you need to secure and how soon?
				</b>
			</p>
			<p>Some tips for you to get started:</p>

			<p>
				Video Guide to get started:
				<a href={`https://${domain}/guide/`} target="_blank">
					A video guide to {brandName}
				</a>
			</p>
			<p>
				I'd like to offer you a personal demo to create your first project and
				answer any questions on integrating with your existing setup. Please
				pick a slot at this link:
				<a href={`https://${domain}/request-demo/`} target="_blank">
					Schedule a personal Demo
				</a>
			</p>
			<p>
				Support: If you're stuck at any time you can fill out the form at
				<a href={`https://${domain}/support/`} target="_blank">
					{brandName} Support
				</a>
				or email us at help@{domain}
			</p>
			<p>
				Thanks, <br />
				Founder <br />
				help@{domain}
				<br />
				{brandName}
			</p>
		</Base>
	);
}
