import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

import { renderPatternPng } from "../../../lib/speckle";

export async function getStaticPaths() {
	const entries = await getCollection("blog");
	return entries.map((entry) => ({ params: { id: entry.id } }));
}

export const GET: APIRoute = async ({ params }) => {
	const png = await renderPatternPng(params.id!, 1588, 497);
	return new Response(new Uint8Array(png), {
		headers: { "Content-Type": "image/png" },
	});
};
