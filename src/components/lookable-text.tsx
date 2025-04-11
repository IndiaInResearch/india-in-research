'use client'

import Title from "antd/es/typography/Title"
import Text from "antd/es/typography/Text"
import { useEffect, useState } from "react"
import { Drawer } from "antd"
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint"
import { Institution } from "@/utils/paper-interfaces"

export function RenderArrayAsLookableText(array: {text: string, link: string | undefined}[]) {
    return array.map((d, idx) => {
        if (!d.link) {
            if (idx != array.length - 1){
                return <div key={idx}><Text>{d.text}, </Text></div>
            }
            return <Text key={idx}>{d.text}</Text>
        }
        if (idx != array.length - 1){
            return <div key={idx}><LookableText key={idx} text={d.text} link={d.link} /><Text>, </Text></div>
        }
        return <LookableText key={idx} text={d.text} link={d.link} />
    })
}

export default function LookableText({text, link} : {text: string, link: string}) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalData, setModalData] = useState<Institution | null>(null)
    const screens = useBreakpoint()


    const openModal = async () => {
        setIsModalOpen(true)
        const data = await fetch(`/api/institute/${link.replace("https://openalex.org/", "")}`)
        setModalData(await data.json())
    }
    

    return (
        <>
            <Text onClick={openModal} style={{"cursor": "pointer"}}>
                {text}
            </Text>
            <Drawer title={"Institute"} open={isModalOpen} onClose={() => setIsModalOpen(false)} size={screens.md ? "large" : "default"}>
                <Title level={3}>{modalData?.display_name}</Title>
                <Text>Link: {modalData?.homepage_url}</Text>
            </Drawer>
        </>
    )
}