'use client';

import { Button, Divider, Flex, Space, Table, Pagination } from "antd";
import Title from "antd/es/typography/Title";
import TreemapChart from "./treemap-chart";
import { useState, useMemo } from "react";
import { ColumnsType } from "antd/es/table";
import countryCodeToName from "@/data/third-party/country_code_to_name.json";
import SearchBox from "./search-box";

export default function CountryStat({data}: {
    data: any
}) {
    const [showExpanded, setShowExpanded] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState("");

    const countries_to_papers: Record<string, number> = data.countries_to_papers;

    const totalPapers = Object.values(countries_to_papers).reduce((sum, count) => sum + count, 0);

    const countryColumns: ColumnsType = [
        {
            title: "Country",
            dataIndex: "country_code",
            key: "country_code",
            render: (code: string, record: any) => {
                if (record.country_name) {
                    return `${record.country_name} (${code})`;
                }
                return code
            }
        },
        {
            title: "# Papers",
            dataIndex: "count",
            key: "count",
            sorter: (a, b) => a.count - b.count,
            sortDirections: ['descend', 'ascend'],
            defaultSortOrder: 'descend',
            render: (count: number) => `${count} (${(count / totalPapers * 100).toFixed(2)}%)`
        }
    ];

    let countryDataSource = Object.entries(countries_to_papers).map(([country_code, count]) => ({
        country_code: country_code,
        count,
        key: country_code,
        country_name: countryCodeToName.find((c) => c.code === country_code)?.name
    })).sort((a, b) => b.count - a.count);

    countryDataSource = countryDataSource.filter((country: any) =>
        Object.values(country).some(value =>
            value && value.toString().toLowerCase().includes(searchText.toLowerCase())
        )
    );

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
                        <SearchBox value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search table"/>
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