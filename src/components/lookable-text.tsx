'use client'

import Title from "antd/es/typography/Title"
import Text from "antd/es/typography/Text"
import { useEffect, useState } from "react"
import { Drawer, Flex, Space, Tag } from "antd"
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint"
import { Author, Institution } from "@/utils/paper-interfaces"
import LoadingComp from "./loading"
import Link from "next/link"
import { AuthorCard, InstituteCard } from "./quick-info-cards"

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
    const [modalData, setModalData] = useState<Institution |  Author | null>(null)
    const [isModalLoading, setIsModalLoading] = useState(false)
    const screens = useBreakpoint()

    let lookableType = undefined

    if (link.startsWith("https://openalex.org/A")){
        lookableType = "author"
    }
    else if (link.startsWith("https://openalex.org/I")){
        lookableType = "institute"
    }
    if (link.startsWith("https://openalex.org/W")){
        lookableType = "paper"
    }

    const openModal = async () => {
        setIsModalOpen(true)
        setIsModalLoading(true)
        if (lookableType == "institute"){
            const data = await fetch(`/api/institute/${link.replace("https://openalex.org/", "")}`)
            setModalData((await data.json()) as Institution)
        }
        if (lookableType == "author"){
            const data = await fetch(`/api/author/${link.replace("https://openalex.org/", "")}`)
            setModalData((await data.json()) as Author)
        }
        setIsModalLoading(false)
    }
    

    return (
        <>
            <Text onClick={openModal} style={{"cursor": "pointer"}}>
                {text}
            </Text>
            {/* this will render one drawer for each lookable text which is not ideal */}
            <Drawer title={"Institute"} open={isModalOpen} onClose={() => setIsModalOpen(false)} size={screens.md ? "large" : "default"}>
                {isModalLoading 
                    ? 
                    <LoadingComp /> 
                    :
                    <>
                        {lookableType == "institute" && modalData && 'display_name' in modalData && <InstituteCard data={modalData} />}
                        {lookableType == "author" && modalData && 'name' in modalData && <AuthorCard data={modalData} />}
                    </>
                }
            </Drawer>
        </>
    )
}