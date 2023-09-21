import { Html } from "@react-email/html";
import { Font } from "@react-email/font";
import { Container } from "@react-email/container";
import { Section } from "@react-email/section";
import { Row } from "@react-email/row";

export default function Base({
	brandName,
	domain,
	reason,
	blockUrl,
	headline,
	firstName,
	greeting,
	children,
}: {
	children: React.ReactNode;
	brandName: string;
	domain: string;
	reason: string | null;
	blockUrl?: string;
	headline: string | undefined;
	firstName: string | undefined;
	greeting: string | undefined;
}) {
	const footer = [
		{
			title: "Contact Support",
			href: `mailto:support@${domain}`,
		},
		// {
		// 	title: 'Read our Blog',
		// 	href: `https://${domain}/blog`
		// },
		{
			title: "Privacy Policy",
			href: `https://${domain}/privacy`,
		},
		{
			title: "Terms and Conditions",
			href: `https://${domain}/terms-conditions`,
		},
	];
	return (
		<Html>
			<Font
				webFont={{
					url: "https://fonts.googleapis.com/css2?family=Inter&family=Montserrat:wght@100;200;300;400;700&display=swap",
					format: "woff2",
				}}
				fontFamily="Montserrat, Inter, sans-serif"
				fallbackFontFamily={"Helvetica"}
			/>
			<Container>
				<Section>
					<Row>{brandName}</Row>
					{headline && <Row>{headline}</Row>}
				</Section>
				{children}
			</Container>
		</Html>
	);
}
