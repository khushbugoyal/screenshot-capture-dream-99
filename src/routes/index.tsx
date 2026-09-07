import { createFileRoute } from "@tanstack/react-router";
import { SubscribersTable } from "@/components/SubscribersTable";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Global Subscribers — Referral Analytics Table" },
      {
        name: "description",
        content:
          "Browse every referral subscriber with engagement, impact and payout metrics in one sortable, customizable table.",
      },
      { property: "og:title", content: "Global Subscribers — Referral Analytics Table" },
      {
        property: "og:description",
        content:
          "Browse every referral subscriber with engagement, impact and payout metrics in one sortable, customizable table.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <SubscribersTable />;
}
