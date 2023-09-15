<script lang="ts">
	import { BRAND_NAME, DOMAIN } from '$lib/constants';
	import Base from './Base.svelte';
	export let firstName: string;
	export let lastName: string;
	export let phone: string | undefined = undefined;
	export let email: string | undefined = undefined;
	export let message: string;
</script>

<Base
	headline={`Support Request`}
	reason={`This was sent from the Contact page of ${BRAND_NAME}`}
>

	Sender name: {firstName} {lastName}<br/>
	{#if email}Email: <a href={`mailto:${email}`}>{email}</a><br/>{/if}
	{#if phone}Phone: <a href={`tel:${email}`}>{phone}</a><br/>{/if}
	Message:
	<p>
		{message}
	</p>
	<br/>
	Reply to this email to respond to the sender.
	<p
		style={`
		font-size="15px";
		font-family="open Sans Helvetica, Arial, sans-serif";
		padding-left="25px";
		padding-right="25px";`}
	>
		Thanks, <br />
		{BRAND_NAME} Team
	</p>
</Base>

