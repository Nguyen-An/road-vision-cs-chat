import type { Metadata } from "next";
import { Providers } from "@/app/providers";
import "./globals.css";
import "@/components/support-widget.css";

export const metadata: Metadata = {
  title: "RoadVision Support",
  description: "Customer support widget and knowledge base"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
