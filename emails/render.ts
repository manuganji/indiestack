// from https://github.com/carstenlebek/svelte-email/blob/master/src/lib/render.ts

import {
	convert
} from 'html-to-text';
import type { ComponentProps, ComponentType, SvelteComponent } from 'svelte';

export const render = <Component extends SvelteComponent>({
	template,
	props,
	options
}: {
	template: ComponentType<Component>;
	props?: ComponentProps<Component>;
	options?: {
		plainText?: boolean;
		pretty?: boolean;
	};
}) => {
	const { html } =
		// @ts-ignore
		template.render(props);
	if (options?.plainText) {
		return renderAsPlainText(html);
	}
	const doctype =
		'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
	const markup = html;
	const document = `${doctype}${markup}`;
	return document;
};

const renderAsPlainText = (markup: string) => {
	return convert(markup, {
		selectors: [
			{ selector: 'img', format: 'skip' },
			{ selector: '#__svelte-email-preview', format: 'skip' }
		]
	});
};