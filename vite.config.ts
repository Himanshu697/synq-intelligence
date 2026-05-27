// Vite config for SynQ Intelligence
// Uses TanStack Start with Cloudflare adapter
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
});
