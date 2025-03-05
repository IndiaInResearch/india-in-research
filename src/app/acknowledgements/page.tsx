import Markdown from "react-markdown"
import Title from "antd/es/typography/Title"
import Text from "antd/es/typography/Text"

const md = `
# Acknowledgements

1. Thanks to GitHub Copilot, Cursor, Bing Chat and Perplexity for writing majority of the code. 
`

export default function Acknowledgements() {
    return (
        <>
            <Markdown
                components={{
                    h1: ({ children }) => <Title level={1}>{children}</Title>,
                    h2: ({ children }) => <Title level={2}>{children}</Title>,
                    h3: ({ children }) => <Title level={3}>{children}</Title>,
                    h4: ({ children }) => <Title level={4}>{children}</Title>,
                    h5: ({ children }) => <Title level={5}>{children}</Title>,
                    p: ({ children }) => <Text>{children}</Text>
                }}
            >
                {md}
            </Markdown>
        </>
    )
}