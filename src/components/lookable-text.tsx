'use client'

import Title from "antd/es/typography/Title"
import Text from "antd/es/typography/Text"
import { useState } from "react"
import { Drawer } from "antd"
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint"

export function RenderArrayAsLookableText(array: {text: string, link: string | undefined}[]) {
    return array.map((d, idx) => {
        if (!d.link) {
            if (idx != array.length - 1){
                return <><Text key={idx}>{d.text}</Text><Text>, </Text></>
            }
            return <Text key={idx}>{d.text}</Text>
        }
        if (idx != array.length - 1){
            return <><LookableText key={idx} text={d.text} link={d.link} /><Text>, </Text></>
        }
        return <LookableText key={idx} text={d.text} link={d.link} />
    })
}

export default function LookableText({text, link} : {text: string, link: string}) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const screens = useBreakpoint()

    return (
        <>
            <Text onClick={() => setIsModalOpen(true)} style={{"cursor": "pointer"}}>
                {text}
            </Text>
            <Drawer title={link} open={isModalOpen} onClose={() => setIsModalOpen(false)} size={screens.md ? "large" : "default"}>
                <Title level={3}>{text}</Title>
            </Drawer>
        </>
    )
}