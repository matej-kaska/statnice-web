import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

const ReactCompilerConfig = {
	target: "19",
};

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react({
			babel: {
				plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
			},
		}),
		svgr(),
		tsconfigPaths(),
		tailwindcss()
	],
	server: {
		host: true,
		port: 3000,
		strictPort: true,
		watch: {
			usePolling: true,
		},
		hmr: {
			clientPort: 3000,
			overlay: false,
		},
	},
	define: {
		global: "window",
		VITE_WEBSITE_URL: JSON.stringify(process.env.VITE_WEBSITE_URL),
	},
	build: {
		sourcemap: true,
	},
	publicDir: "public",
});
