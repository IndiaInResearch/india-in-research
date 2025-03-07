'use client';

import { Button, Divider, Flex, Space, Table } from "antd";
import Title from "antd/es/typography/Title";
import { countPapersByCountry, countPapersByInstitute, filterPapersByCountry, institutesToLatLon } from "@/utils/data-handlers";
import TreemapChart from "./treemap-chart";
import { useState } from "react";
import { ColumnsType } from "antd/es/table";
import IndiaGeoMap, { CityData } from "./india-geo-map";

export default function LocaleHighlights({domain, conf, year, data}: {
    domain: string, 
    conf: string, 
    year: number,
    data: any
}) {
    const [showExpanded, setShowExpanded] = useState(false);

    const countries_to_papers = countPapersByCountry(data);
    const filtered_data = filterPapersByCountry(data, "IN");
    const institutes_to_papers = countPapersByInstitute(filtered_data);
    const cityData = institutesToLatLon(institutes_to_papers);
    console.log(cityData)

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
            sortDirections: ['ascend', 'descend'],
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
            dataIndex: "authors_aff",
            key: "authors_aff",
            // get affiliation from domain here
            render: (affiliation: string[]) => Array.from(new Set(affiliation)).join(", ")
            
        },
        {
            title: "Primary Area",
            dataIndex: "primary_area",
            key: "primary_area",
            render: (primary_area: string) => primary_area.split("_").join(" ")
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
                    <Title level={4}>Locale Highlights</Title>
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
                <IndiaGeoMap width="100%" height={600} cities={cityData} />
                {showExpanded && (
                    <>
                        <Table dataSource={filtered_data} columns={columns} rowKey={(record) => record.id}/>
                    </>
                )}
            </Space>
        </Flex>
    )
}