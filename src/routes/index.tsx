import { createFileRoute } from "@tanstack/react-router";
import SynQApp from "@/components/SynQApp";

export const Route = createFileRoute("/")({
  component: SynQApp,
  head: () => ({
    meta: [
      { title: "Write with SynQ Intelligence — LinkedIn posts for founders" },
      { name: "description", content: "AI-powered LinkedIn post generator for founders. Craft posts that sound like you in seconds." },
      { property: "og:title", content: "Write with SynQ Intelligence" },
      { property: "og:description", content: "AI-powered LinkedIn posts that sound like you." },
    ],
  }),
});
