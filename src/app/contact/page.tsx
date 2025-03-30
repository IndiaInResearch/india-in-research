import { Metadata } from "next";
import AntMarkdown from "@/components/ant-markdown";

const md = `
# Contact

1. Contact us on [X (Twitter) @IndiaInResearch](https://x.com/IndiaInResearch) for any queries.
`

export const metadata: Metadata = {
    title: "Contact",
    description: "Contact email details for India In Research (IIR) platform. Covering Indian Research Stats. Fast.",
    openGraph: {
      title: "Contact | India In Research",
      description: "Contact email details for India In Research (IIR) platform. Covering Indian Research Stats. Fast.",
      url: "https://www.indiainresearch.org/contact",
      siteName: "India In Research",
      locale: "en_US",
      type: "website",
      alternateLocale: "en_IN",
      // emails, twitter, icons, category, manifest
    }
    ,
    category: "science",
};

export default function Philosophy() {

    return (
        <>
            <AntMarkdown text={md} />
        </>
    )
}