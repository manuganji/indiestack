import { sections } from "zapatos/schema";
import { components } from "@/components/sections";

function RenderComponent({
	code,
	config,
}: Pick<sections.JSONSelectable, "code" | "config">) {
	const Component = components.get(code);
	// @ts-ignore
	return <Component {...config} />;
}

export default function RenderSections({
	sections,
}: {
	sections: sections.JSONSelectable[];
}) {
	return sections?.map((section) => (
		<RenderComponent
			key={section.id}
			code={section.code}
			config={section.config}
		/>
	));
}
