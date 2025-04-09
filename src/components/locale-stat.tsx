'use client';

import { Button, Divider, Flex, Space, Table } from "antd";
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
import { useState } from "react";
import { ColumnsType } from "antd/es/table";
import IndiaGeoMap, { GeoMapDataInterface } from "./india-geo-map";
import AntTable from "./ant-table";
import { ReportIssueButton } from "./misc";
import { getDataReturnType } from "@/utils/data-handlers";

export default function LocaleHighlights({data}: {
    data: getDataReturnType
}) {
    const [showExpanded, setShowExpanded] = useState(false);

    const institute_to_papers_with_latlon = data.indian_institute_to_papers_with_latlon_for_graph;
    const indian_institutes_to_papers = data.indian_institutes_to_papers

    const maxCount = Math.max(
        ...indian_institutes_to_papers.map((institute) => institute.count)
    )

    const maxCountInstitutes = indian_institutes_to_papers.filter((institute) => institute.count == maxCount)

    const columns: ColumnsType = [
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
            <Flex vertical style={{width: "100%"}}>
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
                    <ReportIssueButton />
                </Flex>
                <Text>Highlighting Indian Institutes contributing to papers in the venue. See algorithmic details here.</Text>
            </Flex>
            <Space direction="vertical" style={{width: "100%"}}>
                <Flex vertical align="center">
                    <IndiaGeoMap width="100%" height="min(90vw, 800px)" data={institute_to_papers_with_latlon} />
                    <Text>
                        {maxCountInstitutes.map((institute) => institute.name).join(', ')} lead{maxCountInstitutes.length > 1 ? '' : 's'} at {maxCount} papers {maxCountInstitutes.length > 1 ? 'each' : ''}
                    </Text>
                </Flex>
                {showExpanded && (
                    <>
                        <AntTable dataSource={indian_institutes_to_papers} columns={columns} rowKey={(record) => record.name}/>
                    </>
                )}
            </Space>
        </Flex>
    )
}