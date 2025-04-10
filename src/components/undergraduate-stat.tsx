'use client'

import { Button, Flex, Space } from "antd";
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
import { useState } from "react";
import StackedBar from "./stacked-bar";
import DataUnavailable from "./data-unavailable";
import { ReportIssueButton } from "./misc";
import { getDataReturnType } from "@/utils/data-handlers";
import { AuthorRank } from "@/utils/paper-interfaces";

export default function UndergraduateStat({
    data
}: {
    data: getDataReturnType
}) {

    const [showExpanded, setShowExpanded] = useState(false);

    const total_authors = Object.values(data.author_ranks.in).reduce((sum, value, idx, array) => {
        // last key is for "unknown"
        if (idx == array.length - 1){
            return sum
        }
        return sum + value
    }, 0);
    const undergrad_percentage = ((data.author_ranks.in[AuthorRank.UNDERGRAD] / total_authors) * 100).toFixed();

    return (
        <Flex vertical justify="center" align="center" style={{maxWidth: 1600, margin: "0 auto", width: "100%"}}>
            <Flex vertical style={{width: "100%", marginBottom: 32}}>
                <Flex justify="space-between" align="center" style={{width: "100%"}}>
                    <Space align="baseline">
                        <Title level={4}>Undergraduate Participation</Title>
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
                <Text>Split of undergraduate, postgraduate, faculty and industry authors among the accepted Indian papers. Checkout data sources here. </Text>
            </Flex>
            {total_authors === 0 ? 
                <DataUnavailable /> :
                (
                    <Flex justify="space-evenly" style={{width: "100%"}} wrap gap={48}>
                        <Flex vertical justify="center" align="center" gap={64} style={{marginTop: 64, width: "30%"}}>
                            <Flex vertical align="center">
                                <Title level={1}>
                                    {undergrad_percentage}%
                                </Title>
                                <Text style={{textAlign: "center"}}>undergraduate participation</Text>
                            </Flex>
                            <Flex vertical align="center">
                                <Space align="baseline">
                                    <Title level={1}>{data.author_ranks.in[AuthorRank.UNDERGRAD]}</Title>
                                    <Title level={3}>/</Title>
                                    <Title level={4}>{total_authors}</Title>
                                </Space>
                                <Text style={{textAlign: "center"}}>author contributions</Text>
                            </Flex>
                        </Flex>
                        <StackedBar data={data} width="max(60%, 360px)" height={280}/>
                    </Flex>
                )
            }
        </Flex>
    )
}