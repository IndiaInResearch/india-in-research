'use client';

import { Button, Divider, Flex, Space, Table } from "antd";
import Title from "antd/es/typography/Title";
import { countPapersByCountry, filterPapersByCountry } from "@/utils/data-handlers";
import TreemapChart from "./treemap-chart";
import { useState } from "react";

export default function CountryStat({domain, conf, year, data}: {
    domain: string, 
    conf: string, 
    year: number,
    data: any
}) {
    const [showExpanded, setShowExpanded] = useState(false);

    const countries_to_papers = countPapersByCountry(data);
    const filtered_data = filterPapersByCountry(data, "IN");

    const columns = [
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
            width: "30%"
        },
        {
            title: "Authors",
            dataIndex: "authors",
            key: "authors",
            render: (authors: string[]) => authors.join(", ")
        },
        {
            title: "Affiliation",
            dataIndex: "authors_aff",
            key: "authors_aff",
            // get affiliation from domain here
            render: (affiliation: string[]) => Array.from(new Set(affiliation)).join(", ")
            
        }
    ]

    return (
        <Flex vertical justify="center" align="center" style={{maxWidth: 1600, margin: "0 auto", width: "100%"}}>
            <Flex justify="space-between" align="center" style={{width: "100%"}}>
                <Space align="baseline">
                    <Title level={4}>Country Distribution</Title>
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
                <TreemapChart 
                    data={countries_to_papers} 
                    width="100%" 
                    height={showExpanded ? 300 : 196} 
                    maxEntries={showExpanded ? 30 : 20} 
                    keyToHighlight="IN"
                />
                {showExpanded && (
                    <>
                        <Table dataSource={filtered_data} columns={columns} />
                    </>
                )}
            </Space>
        </Flex>
    )
}