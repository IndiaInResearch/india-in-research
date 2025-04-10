'use client';

import { Button, Divider, Flex, Space, Table, Input } from "antd";
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
import { useState } from "react";
import { ColumnsType } from "antd/es/table";
import SearchBox from "./search-box";
import AntTable from "./ant-table";
import { getDataReturnType } from "@/utils/data-handlers";
import { NewPaper, TopicLink } from "@/utils/paper-interfaces";
import { ReportIssueButton } from "./misc";
import LookableText, { RenderArrayAsLookableText } from "./lookable-text";

export default function PaperStat({data}: {data: getDataReturnType}) {
    const [showExpanded, setShowExpanded] = useState(true);
    const [searchText, setSearchText] = useState("");
    

    const indian_papers = data.indian_papers as (NewPaper & { aff_render?: { text: string; link: string | undefined; }[], author_render?: string[] })[];
    const countries_to_papers: Record<string, number> = data.countries_to_papers;

    const totalPapers = Object.values(countries_to_papers).reduce((sum, count) => sum + count, 0);

    indian_papers.forEach((paper) => {
        paper.aff_render = Array.from(new Set(paper.authorships?.map(authorship => {
            if (authorship.institutions && authorship.institutions.length > 0) {
                // set will treat different objects as not equal even if their content is same
                return JSON.stringify({
                    text: authorship.institutions[0].institution?.display_name || "Unknown",
                    link: authorship.institutions[0].institution?.openalex_id
                })
            }
            return JSON.stringify({
                text: "Unknown",
                link: undefined
            })
        }))).map(aff => JSON.parse(aff))

        paper.author_render = paper.authorships?.map(authorship => {
            if (authorship.author.name) {
                return authorship.author.name
            }
            return "Unknown";
        }) || [];
    })

    // use fuzzy search here
    const filteredPapers = indian_papers.filter((paper: any) =>
        Object.values(paper).some(value =>
            value && value.toString().toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnsType = [
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
            dataIndex: "author_render",
            key: "authors",
            render: (authors: string[]) => authors.join(", ")
        },
        {
            title: "Affiliation",
            dataIndex: "aff_render",
            key: "authors_aff",
            // filter not working. search not working. 
            filters: Array.from(new Set(indian_papers.flatMap((paper) => paper.aff_render))).sort().map(aff => ({ text: aff?.text as React.ReactNode, value: aff?.text as string })),
            onFilter: (value, record) => record.aff_render.includes(value),
            filterIcon: false,
            filterSearch: true,
            render: (aff_render: {text: string, link: string | undefined}[]) => RenderArrayAsLookableText(aff_render)
        },
        {
            title: "Venue",
            dataIndex: "publication_venue",
            key: "conf",
            filters: Array.from(new Set(indian_papers.map((paper) => paper.publication_venue?.toLocaleUpperCase()))).map(conf => ({ text: conf as React.ReactNode, value: conf as string })),
            onFilter: (value, record) => record.publication_venue?.toLocaleUpperCase() === value,
            filterSearch: true,
            minWidth: 100,
            render: (publication_venue: string) => publication_venue?.toLocaleUpperCase()
        },
        {
            title: "Primary Area",
            dataIndex: "primary_topic",
            key: "primary_topic",
            width: "10%",
            render: (primary_topic: TopicLink, record: any) => {
                const newPaperRecord = record as NewPaper;
                if (primary_topic && primary_topic.topic && primary_topic.topic.display_name){
                    return primary_topic.topic.display_name.toLowerCase()
                }
                if (newPaperRecord.primary_area_from_paper) {
                    return newPaperRecord.primary_area_from_paper.replace(/_/g, " ");
                }
                return "";
            }
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
            <Flex vertical style={{width: "100%"}}>
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
                    <ReportIssueButton />
                </Flex>
                <Text>List of accepted papers where maximum authors are from Indian Institutes. More details here.</Text>
            </Flex>
            <Space direction="vertical" style={{width: "100%"}}>
                <Flex gap={64} justify="space-evenly" style={{marginTop: 32, marginBottom: 64}}>
                    <Flex vertical align="center">
                        <Title level={1}>
                            {indian_papers.length}
                        </Title>
                        <Text style={{textAlign: "center"}}>total accepted</Text>
                    </Flex>
                    <Flex vertical align="center">
                        <Space align="baseline">
                            <Title level={1}>{(indian_papers.length / totalPapers * 100).toFixed(2)}%</Title>
                        </Space>
                        <Text style={{textAlign: "center"}}>conference contribution</Text>
                    </Flex>
                </Flex>

                {showExpanded && (
                    <>
                        <SearchBox value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search table"/>
                        <AntTable
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
                        />
                    </>
                )}
            </Space>
        </Flex>
    )
}
