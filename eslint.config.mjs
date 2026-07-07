// @ts-check
import eslintPluginAstro from "eslint-plugin-astro";
import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
	{ ignores: ["dist/", ".astro/", "node_modules/"] },
	...tseslint.configs.recommended,
	...eslintPluginAstro.configs.recommended,
	{
		files: ["**/*.{ts,tsx}"],
		languageOptions: {
			globals: { ...globals.browser },
		},
	},
	{
		files: ["**/*.tsx"],
		plugins: {
			react,
			"react-hooks": reactHooks,
			"jsx-a11y": jsxA11y,
		},
		settings: { react: { version: "detect" } },
		rules: {
			...react.configs.flat.recommended.rules,
			...react.configs.flat["jsx-runtime"].rules,
			...reactHooks.configs.recommended.rules,
			...jsxA11y.flatConfigs.recommended.rules,
			"react-hooks/rules-of-hooks": "error",
			"react-hooks/exhaustive-deps": "error",
		},
	},
);
