'use client';

import { Button, Divider, Flex, Radio, Space, Table } from "antd";
import Title from "antd/es/typography/Title";
import { countPapersByCountry, countPapersByInstitute, filterPapersByCountry, institutesToLatLon } from "@/utils/data-handlers";
import { useState } from "react";
import { ColumnsType } from "antd/es/table";
import IndiaGeoMap, { GeoMapDataInterface } from "./india-geo-map";
import RatingHistogram from "./rating-histogram";
import * as d3 from "d3";
import DataUnavailable from "./data-unavailable";
import AntTable from "./ant-table";

export default function ScoreStat({data, ratingKey, title}: {
    data: any,
    ratingKey: string,
    title: string
}) {
    const [showExpanded, setShowExpanded] = useState(true);
    const [comparisonCountry, setComparisonCountry] = useState<'US' | 'CN'>('US');

    let rating_data_india = []
    let rating_data_us = []
    let rating_data_china = []

    if (ratingKey == "rating") {
        rating_data_india = data.rating_overall.in;
        rating_data_us = data.rating_overall.us;
        rating_data_china = data.rating_overall.cn;
    }
    else if (ratingKey == "novelty") {
        rating_data_india = data.novelty_overall.in;
        rating_data_us = data.novelty_overall.us;
        rating_data_china = data.novelty_overall.cn;
    }

    const us_90th_percentile = d3.quantile(rating_data_us.sort(d3.ascending), 0.9) ?? 0;
    const us_10th_percentile = d3.quantile(rating_data_us.sort(d3.ascending), 0.1) ?? 0;

    const metric_data = [
        {
            metric: "Mean",
            in: d3.mean(rating_data_india)?.toFixed(2),
            us: d3.mean(rating_data_us)?.toFixed(2),
            cn: d3.mean(rating_data_china)?.toFixed(2)
        },
        {
            metric: `% Papers > ${us_90th_percentile.toFixed(2)}`,
            in: ((rating_data_india.filter((score: number) => score >= us_90th_percentile).length / rating_data_india.length) * 100).toFixed(2),
            us: ((rating_data_us.filter((score: number) => score >= us_90th_percentile).length / rating_data_us.length) * 100).toFixed(2),
            cn: ((rating_data_china.filter((score: number) => score >= us_90th_percentile).length / rating_data_china.length) * 100).toFixed(2)
        },
        {
            metric: `% Papers < ${us_10th_percentile.toFixed(2)} (lower is better)`,
            in: ((rating_data_india.filter((score: number) => score <= us_10th_percentile).length / rating_data_india.length) * 100).toFixed(2),
            us: ((rating_data_us.filter((score: number) => score <= us_10th_percentile).length / rating_data_us.length) * 100).toFixed(2),
            cn: ((rating_data_china.filter((score: number) => score <= us_10th_percentile).length / rating_data_china.length) * 100).toFixed(2)
        },
        {
            metric: "50th Percentile (Median)",
            in: d3.quantile(rating_data_india.sort(d3.ascending), 0.5)?.toFixed(2),
            us: d3.quantile(rating_data_us.sort(d3.ascending), 0.5)?.toFixed(2),
            cn: d3.quantile(rating_data_china.sort(d3.ascending), 0.5)?.toFixed(2)
        },
        {
            metric: "95th Percentile (approx Max)",
            in: d3.quantile(rating_data_india.sort(d3.ascending), 0.95)?.toFixed(2),
            us: d3.quantile(rating_data_us.sort(d3.ascending), 0.95)?.toFixed(2),
            cn: d3.quantile(rating_data_china.sort(d3.ascending), 0.95)?.toFixed(2)
        },
        {
            metric: "5th Percentile (approx Min)",
            in: d3.quantile(rating_data_india.sort(d3.ascending), 0.05)?.toFixed(2),
            us: d3.quantile(rating_data_us.sort(d3.ascending), 0.05)?.toFixed(2),
            cn: d3.quantile(rating_data_china.sort(d3.ascending), 0.05)?.toFixed(2)
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

            {(rating_data_india.length == 0 && rating_data_us.length == 0 && rating_data_china.length == 0) ? 
                <DataUnavailable /> :
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
                            <AntTable dataSource={metric_data} columns={columns} rowKey={(record) => record.metric} pagination={false}/>
                        </>
                    )}
                </Space>
            }
        </Flex>
    )
}