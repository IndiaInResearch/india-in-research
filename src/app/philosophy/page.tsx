import { Metadata } from "next";
import AntMarkdown from "@/components/ant-markdown";

const md = `
# Philosophy

1. All research metrics are flawed. This is *probably* less flawed.
1. Same data can be interpreted in multiple ways to suit different minds.
1. We are not trying to be comprehensive. Innumerable other valuable sources exist.
1. The deeper the study, the better the story.
1. Become compliant with [GOTO Rankings](https://gotorankings.org/) standard over time. Similar to [CSMetrics](http://csmetrics.net/) and [CSRankings](https://csrankings.org/).
`

export const metadata: Metadata = {
    title: "Philosophy",
    description: "Data and algorithm philosophy behind the India In Research (IIR) platform. Covering Indian Research Stats. Fast.",
    openGraph: {
      title: "Philosophy | India In Research",
      description: "Data and algorithm philosophy behind the India In Research (IIR) platform. Covering Indian Research Stats. Fast.",
      url: "https://www.indiainresearch.org/philosophy",
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