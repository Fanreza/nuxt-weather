import type { NuxtPage } from "nuxt/schema";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	modules: ["nuxt3-leaflet", "@nuxtjs/tailwindcss", "shadcn-nuxt", "@vueuse/nuxt"],
	shadcn: {
		/**
		 * Prefix for all the imported component
		 */
		prefix: "",
		/**
		 * Directory that the component lives in.
		 * @default "./components/ui"
		 */
		componentDir: "./components/ui",
	},

	routeRules: {
		"/home": {
			redirect: "/",
		},
	},

	hooks: {
		"pages:extend"(pages) {
			const pagesToRemove: NuxtPage[] = [];
			pages.forEach((page) => {
				if (page.path.includes("component")) pagesToRemove.push(page);
			});

			pagesToRemove.forEach((page) => {
				pages.splice(pages.indexOf(page), 1);
			});
		},
	},

	components: [
		"~/components",
		{
			path: "~/pages",
			pattern: "*/components/**",
			pathPrefix: true,
		},
	],
});
