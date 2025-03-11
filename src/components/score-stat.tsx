'use client';

import { Button, Divider, Flex, Radio, Space, Table } from "antd";
import Title from "antd/es/typography/Title";
import { countPapersByCountry, countPapersByInstitute, filterPapersByCountry, institutesToLatLon } from "@/utils/data-handlers";
import { useState } from "react";
import { ColumnsType } from "antd/es/table";
import IndiaGeoMap, { GeoMapDataInterface } from "./india-geo-map";
import RatingHistogram from "./rating-histogram";
import * as d3 from "d3";

export default function ScoreStat({domain, conf, year, data, ratingKey, title}: {
    domain: string, 
    conf: string, 
    year: number,
    data: any,
    ratingKey: string,
    title: string
}) {
    const [showExpanded, setShowExpanded] = useState(false);
    const [comparisonCountry, setComparisonCountry] = useState<'US' | 'CN'>('US');

    const filtered_data_india = filterPapersByCountry(data, "IN");
    const filtered_data_us = filterPapersByCountry(data, "US");
    const filtered_data_china = filterPapersByCountry(data, "CN");

    const rating_data_india = filtered_data_india.filter((paper: any) => paper[ratingKey].length > 0).map((paper: any) => paper[ratingKey].reduce((a: number, b: number) => a + b, 0) / paper[ratingKey].length);
    const rating_data_us = filtered_data_us.filter((paper: any) => paper[ratingKey].length > 0).map((paper: any) => paper[ratingKey].reduce((a: number, b: number) => a + b, 0) / paper[ratingKey].length);
    const rating_data_china = filtered_data_china.filter((paper: any) => paper[ratingKey].length > 0).map((paper: any) => paper[ratingKey].reduce((a: number, b: number) => a + b, 0) / paper[ratingKey].length);
    
    const metric_data = [
        {
            metric: "Mean",
            in: d3.mean(rating_data_india)?.toFixed(2),
            us: d3.mean(rating_data_us)?.toFixed(2),
            cn: d3.mean(rating_data_china)?.toFixed(2)
        },
        {
            metric: "Top 5% (95th Percentile)",
            in: d3.quantile(rating_data_india, 0.95)?.toFixed(2),
            us: d3.quantile(rating_data_us, 0.95)?.toFixed(2),
            cn: d3.quantile(rating_data_china, 0.95)?.toFixed(2)
        },
        {
            metric: "50th Percentile (Median)",
            in: d3.quantile(rating_data_india, 0.5)?.toFixed(2),
            us: d3.quantile(rating_data_us, 0.5)?.toFixed(2),
            cn: d3.quantile(rating_data_china, 0.5)?.toFixed(2)
        },
        {
            metric: "Bottom 5% (5th Percentile)",
            in: d3.quantile(rating_data_india, 0.05)?.toFixed(2),
            us: d3.quantile(rating_data_us, 0.05)?.toFixed(2),
            cn: d3.quantile(rating_data_china, 0.05)?.toFixed(2)
        }
    ]
    const columns: ColumnsType = [
        {
            title: "Metric (Higher is better)",
            dataIndex: "metric",
            key: "metric",
            width: "40%",
        },
        {
            title: "IN",
            dataIndex: "in",
            key: "in",
        },
        {
            title: "CN",
            dataIndex: "cn",
            key: "cn",
            
        },
        {
            title: "US",
            dataIndex: "us",
            key: "us",
        },
    ]

    return (
        <Flex vertical justify="center" align="center" style={{maxWidth: 1600, margin: "0 auto", width: "100%"}}>
            <Flex justify="space-between" align="center" style={{width: "100%"}}>
                <Space align="baseline">
                    <Title level={4}>{title}</Title>
                    <Button 
                        variant="link" 
                        color="default"
                        onClick={() => setShowExpanded(!showExpanded)}
                    >
                        {showExpanded ? 'View Less <' : 'View More >'}
                    </Button>
                </Space>
                <Radio.Group 
                    value={comparisonCountry} 
                    onChange={(e) => setComparisonCountry(e.target.value)}
                    optionType="button"
                    buttonStyle="solid"
                >
                    <Radio.Button value="US">With US</Radio.Button>
                    <Radio.Button value="CN">With CN</Radio.Button>
                </Radio.Group>
            </Flex>
            <Space direction="vertical" style={{width: "100%"}}>
                <RatingHistogram 
                    width="100%" 
                    height={400} 
                    indiaRatings={rating_data_india}
                    usRatings={comparisonCountry === 'US' ? rating_data_us : []}
                    chinaRatings={comparisonCountry === 'CN' ? rating_data_china : []}
                />
                {showExpanded && (
                    <>
                        <Table dataSource={metric_data} columns={columns} rowKey={(record) => record.metric}/>
                    </>
                )}
            </Space>
        </Flex>
    )
}