import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
	loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		tags: z.array(z.string()),
	}),
});

const work = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/work" }),
	schema: z.object({
		index: z.number().int(),
		company: z.string(),
		title: z.string(),
		team: z.string().nullable(),
		vertical: z.string().nullable(),
		employment: z.enum([
			"full-time",
			"part-time",
			"self-employed",
			"freelance",
			"contract",
			"internship",
			"volunteer",
		]),
		start: z.string(),
		end: z.string().nullable(),
		current: z.boolean(),
		location: z.string(),
		locationType: z.enum(["on-site", "hybrid", "remote"]),
		description: z.string(),
		skills: z.array(z.string()),
	}),
});

export const collections = { blog, work };
