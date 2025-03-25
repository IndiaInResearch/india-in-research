'use client'

import { Button, Flex, Space } from "antd";
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
import { useState } from "react";
import useToken from "antd/es/theme/useToken";

export default function VenueTitleDisplay({
    singleConfData, 
    selectedVenues,
    hierarchyLabels,
    year
}: {
    singleConfData: boolean,
    selectedVenues: any[],
    hierarchyLabels: string[],
    year: number
}) {

    const [showExpanded, setShowExpanded] = useState(false);
    const tokens = useToken()[1]

    const conf_name = singleConfData ? selectedVenues[0].full_name : "Top " + hierarchyLabels.join(" > ") + " Venues";
    const location = singleConfData ? selectedVenues[0].places.find((v: any) => v.year === year)?.location : "";

    const venueLabels = selectedVenues.map((v) => v.label)

    return (
        <>
            {singleConfData ?
                (
                    <Title level={3}>{conf_name}, {year}. {location}.</Title>
                ) :
                (
                    <>
                        <Flex vertical>
                        <Space align="baseline">
                            <Title level={3}>{conf_name}, {year}.</Title>
                            <Button 
                                variant="link" 
                                color="default"
                                onClick={() => setShowExpanded(!showExpanded)}
                            >
                                {showExpanded ? 'Hide List <' : 'View List >'}
                            </Button>
                        </Space>
                        {showExpanded && (
                            <Text style={{fontSize: tokens.fontSizeHeading5}}>{venueLabels.join(", ")}</Text>
                        )}
                        </Flex>
                    </>
                )
            }
        </>
    )
}