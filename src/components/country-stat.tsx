'use client';

import { Button, Divider, Flex, Space, Table, Pagination } from "antd";
import Title from "antd/es/typography/Title";
import TreemapChart from "./treemap-chart";
import { useState, useMemo } from "react";
import { ColumnsType } from "antd/es/table";
import { getInstituteFromDomain } from "@/utils/domain-handlers";

export default function CountryStat({data}: {
    data: any
}) {
    const [showExpanded, setShowExpanded] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const countries_to_papers: Record<string, number> = data.countries_to_papers;
    const filtered_data = data.indian_papers;

    const totalPapers = Object.values(countries_to_papers).reduce((sum, count) => sum + count, 0);

    const countryColumns: ColumnsType = [
        {
            title: "Country",
            dataIndex: "country",
            key: "country",
        },
        {
            title: "# Papers",
            dataIndex: "count",
            key: "count",
            sorter: (a, b) => a.count - b.count,
            sortDirections: ['descend', 'ascend'],
            defaultSortOrder: 'descend',
            render: (count: number) => `${count} (${(count / totalPapers * 100).toFixed(1)}%)`
        }
    ];

    const countryDataSource = Object.entries(countries_to_papers).map(([country, count]) => ({
        country,
        count,
        key: country
    })).sort((a, b) => b.count - a.count);

    const pageSize = 6;
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize * 2;
        return [
            countryDataSource.slice(startIndex, startIndex + pageSize),
            countryDataSource.slice(startIndex + pageSize, startIndex + pageSize * 2)
        ];
    }, [countryDataSource, currentPage]);

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
                        <Flex justify="space-between" style={{width: "100%"}}>
                            <Table 
                                dataSource={paginatedData[0]} 
                                columns={countryColumns} 
                                pagination={false} 
                                style={{ width: "48%" }}
                            />
                            <Table 
                                dataSource={paginatedData[1]} 
                                columns={countryColumns} 
                                pagination={false} 
                                style={{ width: "48%" }}
                            />
                        </Flex>
                        <Flex justify="center" style={{marginTop: 16}}>
                        <Pagination 
                            current={currentPage} 
                            pageSize={1} 
                            total={Math.ceil(countryDataSource.length / (pageSize * 2))} 
                            onChange={(page) => setCurrentPage(page)}
                        />
                        </Flex>
                    </>
                )}
            </Space>
        </Flex>
    )
}