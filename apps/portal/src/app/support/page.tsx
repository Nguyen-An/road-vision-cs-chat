import { SupportWidget } from "@/features/support-widget/components/support-widget";

type SupportHomePageProps = {
  searchParams: Promise<{ embed?: string }>;
};

export default async function SupportHomePage({ searchParams }: SupportHomePageProps) {
  const { embed } = await searchParams;
  return <SupportWidget embedded={embed === "1"} />;
}
