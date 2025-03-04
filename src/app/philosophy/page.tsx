import Markdown from "react-markdown"
import Title from "antd/es/typography/Title"
import Text from "antd/es/typography/Text"

const md = `
# Philosophy

This is the philosophy page.
`

export default function Philosophy() {
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