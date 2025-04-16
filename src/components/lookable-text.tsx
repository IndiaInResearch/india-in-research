'use client'

import Title from "antd/es/typography/Title"
import Text from "antd/es/typography/Text"
import { useEffect, useState } from "react"
import { Drawer, Flex, Space, Tag } from "antd"
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint"
import { Institution } from "@/utils/paper-interfaces"
import LoadingComp from "./loading"
import Link from "next/link"

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
    const [isModalLoading, setIsModalLoading] = useState(false)
    const screens = useBreakpoint()


    const openModal = async () => {
        setIsModalOpen(true)
        setIsModalLoading(true)
        const data = await fetch(`/api/institute/${link.replace("https://openalex.org/", "")}`)
        setModalData(await data.json())
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
                        <Flex justify="space-between" style={{marginBottom: 16}}>
                            <Tag>{modalData?.type?.toLocaleUpperCase()}</Tag>
                            <Space>
                                {modalData?.homepage_url && 
                                    <Link href={modalData?.homepage_url} target="_blank" rel="noopener noreferrer">
                                        <Tag>Website</Tag>
                                    </Link>
                                }
                                {modalData?.openalex_id && 
                                    <Link href={modalData?.openalex_id} target="_blank" rel="noopener noreferrer">
                                        <Tag>OpenAlex</Tag>
                                    </Link>
                                }
                                {modalData?.ror && 
                                    <Link href={modalData?.ror} target="_blank" rel="noopener noreferrer">
                                        <Tag>ROR</Tag>
                                    </Link>
                                }
                            </Space>
                        </Flex>
                        <Title level={3}>{modalData?.display_name}</Title>
                        <Title level={4}>{modalData?.display_name_acronyms?.[0]}</Title>
                    </>
                }
            </Drawer>
        </>
    )
}