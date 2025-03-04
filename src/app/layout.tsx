import type { Metadata } from "next";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { AntdConfigProvider } from "./provider";
import { Divider, Layout } from "antd";
import { Content, Footer as AntFooter, Header } from "antd/es/layout/layout";
import NavBar from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "IIR",
  description: "IIR is a platform for measuring the impact of Indian papers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <AntdConfigProvider>
            <Layout>
              <Header>
                <NavBar></NavBar>
              </Header>
              <Content style={{minHeight: 600}}>{children}</Content>
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
