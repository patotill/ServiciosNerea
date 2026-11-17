import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import apiLocal from "./vite/apiLocal";

export default defineConfig({
  plugins: [react(), tailwindcss(), apiLocal()],
});
