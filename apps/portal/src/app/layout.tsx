import type { Metadata } from "next";
import { Providers } from "@/app/providers";

export const metadata: Metadata = {
  title: "RoadVision Support",
  description: "Customer support widget and knowledge base"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className="dark" lang="ja" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
