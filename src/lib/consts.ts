export const NICKNAME = "Igor";
export const FIRST_NAME = "Igor";
export const LAST_NAME = "Moreira Castro";
export const FULL_NAME = "Igor Moreira Castro";
export const TITLE = "Software Engineer";
export const ALIAS = "Igordro1d";

export const EMAIL_ADDRESS = "igormoreiracastro0@gmail.com";
export const SOCIALS = {
	github: "https://github.com/Igordro1d",
};

// TODO: replace with your real domain (or your deployment URL).
export const SITE = import.meta.env.PROD
	? "https://placeholder.example.com"
	: "http://localhost:4321";

// TODO: placeholder copy — replace before launch.
export const DESCRIPTION =
	"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.";

export const JSONLD = {
	"@context": "http://www.schema.org",
	"@type": "person",
	alternateName: ALIAS,
	description: "Developer",
	disambiguatingDescription: TITLE,
	email: `mailto:${EMAIL_ADDRESS}`,
	familyName: LAST_NAME,
	givenName: FIRST_NAME,
	jobTitle: TITLE,
	name: FULL_NAME,
	sameAs: SOCIALS.github,
	url: SITE,
};

export const NAVIGATION = [
	{ name: "home", href: "/" },
	{ name: "blog", href: "/blog" },
	{ name: "work", href: "/work" },
];
