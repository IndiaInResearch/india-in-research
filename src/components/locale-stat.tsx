'use client';

import { Button, Divider, Flex, Space, Table } from "antd";
import Title from "antd/es/typography/Title";
import { countPapersByCountry, countPapersByInstitute, filterPapersByCountry, institutesToLatLon } from "@/utils/data-handlers";
import TreemapChart from "./treemap-chart";
import { useState } from "react";
import { ColumnsType } from "antd/es/table";
import IndiaGeoMap, { GeoMapDataInterface } from "./india-geo-map";

export default function LocaleHighlights({data}: {
    data: any
}) {
    const [showExpanded, setShowExpanded] = useState(false);

    const institute_to_papers_with_latlon = data.indian_institute_to_papers_with_latlon_for_graph;
    const indian_institutes_to_papers = data.indian_institutes_to_papers

    const columns: ColumnsType = [
        {
            title: "Country",
            dataIndex: "country",
            key: "country",
            render: () => "IN"
        },
        {
            title: "Institute",
            dataIndex: "name",
            key: "name",
            width: "30%",
            sorter: (a, b) => a.name.localeCompare(b.name),
            sortDirections: ['ascend', 'descend', 'ascend'],
        },
        {
            title: "Count",
            dataIndex: "count",
            key: "count",
            sorter: (a, b) => a.count - b.count,
            sortDirections: ['descend', 'ascend', 'descend'],
            defaultSortOrder: 'descend'
        },
        {
            title: "Researchers",
            dataIndex: "authors_aff",
            key: "authors_aff",
            
        },
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
                <IndiaGeoMap width="100%" height={800} data={institute_to_papers_with_latlon} />
                {showExpanded && (
                    <>
                        <Table dataSource={indian_institutes_to_papers} columns={columns} rowKey={(record) => record.name}/>
                    </>
                )}
            </Space>
        </Flex>
    )
}