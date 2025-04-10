import type { Metadata } from "next";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { AntdConfigProvider } from "./provider";
import { Divider, Layout } from "antd";
import { Content, Footer as AntFooter, Header } from "antd/es/layout/layout";
import NavBar from "@/components/navbar";
import Footer from "@/components/footer";
import { GoogleAnalytics } from "@next/third-parties/google";
import SuspenseWithTermlyCMP from "@/components/termly-cmp";


export const metadata: Metadata = {
  title: {
    template: "%s | India In Research",
    default: "India In Research",
  },
  description: "India In Research (IIR) is a platform for measuring the impact and diversity of Indian research papers. Covering Indian Research Stats. Fast.",
  openGraph: {
    title: "India In Research",
    description: "India In Research (IIR) is a platform for measuring the impact and diversity of Indian research papers. Covering Indian Research Stats. Fast.",
    url: "https://www.indiainresearch.org",
    siteName: "India In Research",
    locale: "en_US",
    type: "website",
    alternateLocale: "en_IN",
    // emails, twitter, icons, category, manifest
  }
  ,
  category: "science",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <GoogleAnalytics gaId="G-0LQ04XLE3N" />
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9123105121789937" crossOrigin="anonymous"></script>
      </head>
      <body>
        <SuspenseWithTermlyCMP websiteUUID={'de1531e1-f734-46d0-a912-ed316fa77cd1'}></SuspenseWithTermlyCMP>
        <AntdRegistry>
          <AntdConfigProvider>
            <Layout>
              <Header>
                <NavBar></NavBar>
              </Header>
              <Content style={{minHeight: 600, paddingTop: "32px", paddingLeft: "min(5vw, 64px)", paddingRight: "min(5vw, 64px)"}}>{children}</Content>
              <AntFooter>
                <Footer />
              </AntFooter>
            </Layout>
          </AntdConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
