'use client';

import { Button, Divider, Flex, Space, Table, Input } from "antd";
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
import { useState } from "react";
import { ColumnsType } from "antd/es/table";
import { getInstituteFromDomain } from "@/utils/domain-handlers";
import SearchBox from "./search-box";

export default function PaperStat({data}: {
    data: any
}) {
    const [showExpanded, setShowExpanded] = useState(true);
    const [searchText, setSearchText] = useState("");

    const indian_papers = data.indian_papers;
    const countries_to_papers: Record<string, number> = data.countries_to_papers;

    const totalPapers = Object.values(countries_to_papers).reduce((sum, count) => sum + count, 0);

    indian_papers.map((paper: any) => {
        paper['aff_render'] = Array.from(new Set(paper.aff_domains.map((aff: string, idx: number) => {
            const institute = getInstituteFromDomain(aff);
            if (institute) {
                return institute.name;
            }
            if (idx < paper.authors_aff?.length) {
                return paper.authors_aff[idx]
            }
            return aff
        })))
    })

    const filteredPapers = indian_papers.filter((paper: any) =>
        Object.values(paper).some(value =>
            value && value.toString().toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnsType = [
        {
            title: "Country",
            dataIndex: "country",
            key: "country",
            render: () => "IN"
        },
        {
            title: "Paper Title",
            dataIndex: "title",
            key: "title",
            width: "30%",
            sorter: (a, b) => a.title.localeCompare(b.title),
            sortDirections: ['ascend', 'descend', 'ascend'],
            defaultSortOrder: 'ascend'
        },
        {
            title: "Authors",
            dataIndex: "authors",
            key: "authors",
            render: (authors: string[]) => authors.join(", ")
        },
        {
            title: "Affiliation",
            dataIndex: "aff_render",
            key: "authors_aff",
            filters: Array.from(new Set(indian_papers.flatMap((paper: any) => paper.aff_render))).sort().map(aff => ({ text: aff as React.ReactNode, value: aff as string })),
            onFilter: (value, record) => record.aff_render.includes(value),
            filterIcon: false,
            filterSearch: true,
            render: (affiliation: string[]) => affiliation.join(", ")
        },
        {
            title: "Venue",
            dataIndex: "conf",
            key: "conf",
            filters: Array.from(new Set(indian_papers.map((paper: any) => paper.conf?.toLocaleUpperCase()))).map(conf => ({ text: conf as React.ReactNode, value: conf as string })),
            onFilter: (value, record) => record.conf?.toLocaleUpperCase() === value,
            filterSearch: true,
            minWidth: 100,
            render: (conf: string) => conf?.toLocaleUpperCase()
        },
        {
            title: "Primary Area",
            dataIndex: "primary_area",
            key: "primary_area",
            width: "10%",
            render: (primary_area: string) => primary_area?.split("_").join(" ")
        },
        {
            title: "",
            dataIndex: "link",
            key: "link",
            // should I use noreferrer here as well?
            render: (link: string) => <a href={link} target="_blank" rel="noopener">link</a>
        }
    ]

    return (
        <Flex vertical justify="center" align="center" style={{maxWidth: 1600, margin: "0 auto", width: "100%"}}>
            <Flex justify="space-between" align="center" style={{width: "100%"}}>
                <Space align="baseline">
                    <Title level={4}>Paper Statistics</Title>
                    <Button 
                        variant="link" 
                        color="default"
                        onClick={() => setShowExpanded(!showExpanded)}
                    >
                        {showExpanded ? 'View Less <' : 'View More >'}
                    </Button>
                </Space>
            </Flex>
            <Space direction="vertical" style={{width: "100%"}}>
                <Flex gap={64} justify="space-evenly" style={{marginTop: 64, marginBottom: 64}}>
                    <Flex vertical align="center">
                        <Title level={1}>
                            {indian_papers.length}
                        </Title>
                        <Text>total accepted</Text>
                    </Flex>
                    <Flex vertical align="center">
                        <Space align="baseline">
                            <Title level={1}>{(indian_papers.length / totalPapers * 100).toFixed(2)}%</Title>
                        </Space>
                        <Text>conference contribution</Text>
                    </Flex>
                </Flex>

                {showExpanded && (
                    <>
                        <SearchBox value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search table"/>
                        <Table 
                            dataSource={filteredPapers} 
                            columns={columns} 
                            rowKey={(record) => {
                                if (record.id) {
                                    return record.id;
                                }
                                else{
                                    return record.title + record.authors.join("") 
                                }
                            }} 
                            pagination={{ pageSize: 6 }} 
                        />
                    </>
                )}
            </Space>
        </Flex>
    )
}