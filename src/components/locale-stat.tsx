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
    const [showExpanded, setShowExpanded] = useState(true);

    const institute_to_papers_with_latlon = data.indian_institute_to_papers_with_latlon_for_graph;

    const indian_institutes_to_papers = data.indian_institutes_to_papers.map(institute => ({
        ...institute,
        researchers: [] as string[]
    }));

    const maxCount = Math.max(
        ...indian_institutes_to_papers.map((institute) => institute.count)
    )
    const maxCountInstitutes = indian_institutes_to_papers.filter((institute) => institute.count == maxCount)

    const indianPapers = data.indian_papers

    const author_to_paper_count: Record<string, {aff_counts: Record<string, number>, name: string}> = {}

    for(const paper of indianPapers){
        for (const authorship of paper.authorships || []){
            if (authorship.author.openalex_id){
                for (const institution of authorship.institutions || []){
                    if (institution.institution?.openalex_id){
                        if (!(authorship.author.openalex_id in author_to_paper_count)){
                            author_to_paper_count[authorship.author.openalex_id] = { aff_counts: {}, name: authorship.author.name }
                        }
                        if (institution.institution?.openalex_id in author_to_paper_count[authorship.author.openalex_id].aff_counts){
                            author_to_paper_count[authorship.author.openalex_id].aff_counts[institution.institution?.openalex_id]++
                        }
                        else{
                            author_to_paper_count[authorship.author.openalex_id].aff_counts[institution.institution?.openalex_id] = 1
                        }
                    }
                }
            }
        }
    }    

    const paperCounts = Object.values(author_to_paper_count).map(author => 
        Object.values(author.aff_counts).reduce((a, b) => a + b, 0)
    );

    // review this thresholding logic
    paperCounts.sort((a, b) => a - b);
    const percentileIndex = Math.ceil(0.75 * paperCounts.length);
    let threshold = paperCounts[percentileIndex] + 1;
    threshold = Math.min(threshold, paperCounts[paperCounts.length - 1])
    
    console.log(`Calculated threshold: ${threshold}`);

    for (const author in author_to_paper_count){
        const totalPapers = Object.values(author_to_paper_count[author].aff_counts).reduce((a, b) => a + b, 0)

        if (totalPapers >= threshold){
            for (const institute in author_to_paper_count[author].aff_counts){
                indian_institutes_to_papers.find((d) => d.domain == institute)?.researchers.push(author_to_paper_count[author].name)
            }
        }
    }

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
            defaultSortOrder: 'descend',
            width: "10%",
        },
        {
            title: "Popular Researchers",
            dataIndex: "researchers",
            key: "authors_aff",
            render: (researchers: string[]) => researchers.join(", ")
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
                    <IndiaGeoMap width="100%" height="min(90vw, 800px)" data={showExpanded ? institute_to_papers_with_latlon : institute_to_papers_with_latlon.length > 15 ? institute_to_papers_with_latlon.slice(0, 15) : institute_to_papers_with_latlon} />
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