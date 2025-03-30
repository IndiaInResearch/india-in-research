import AntMarkdown from "@/components/ant-markdown"
import { Metadata } from "next"


const md = `
# Acknowledgements

1. Thanks to [GitHub Copilot](https://github.com/features/copilot), [Cursor](https://www.cursor.com/), [Bing Chat](https://www.bing.com/) and [Perplexity](https://www.perplexity.ai/) for writing majority of the code. 
1. Thanks to [OpenRouter](https://openrouter.ai/) for free LLM inference. Thanks to [Ollama](https://ollama.com/) for making it trivial to run small LLMs locally.
1. Thanks to projects like [Paper Copilot](https://papercopilot.com/), [OpenAlex](https://openalex.org/) and [DBLP](https://dblp.org/) for being great data sources.

# 

*This project is actively looking for sponsorships. Contact: sponsor@indiainresearch.org*
`

export const metadata: Metadata = {
    title: "Acknowledgements",
    description: "Acknowledging tools and data sources used to build Indian In Research. Covering Indian Research Stats. Fast.",
    openGraph: {
      title: "Acknowledgements | India In Research",
      description: "Data and algorithm philosophy behind the India In Research (IIR) platform. Covering Indian Research Stats. Fast.",
      url: "https://www.indiainresearch.org/acknowledgements",
      siteName: "India In Research",
      locale: "en_US",
      type: "website",
      alternateLocale: "en_IN",
      // emails, twitter, icons, category, manifest
    }
    ,
    category: "science",
};


export default function Acknowledgements() {
    return (
        <>
            <AntMarkdown text={md} />
        </>
    )
}