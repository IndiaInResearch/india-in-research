import { Divider, Flex, InputNumber, Select, Space } from "antd";
import csVenues from "@/data/cs-venues.json";
import domains from "@/data/domains.json";
import { notFound } from "next/navigation";
import CountryStat from "@/components/country-stat";

export default function StatPage({
  params,
}: {
  params: { domain: string; conf: string; year: number };
}) {
    const { domain, conf, year } = params;

    if (!domains.find((d) => d.value === domain)) {
        notFound();
    }

    if ((!csVenues.find((v) => v.value === conf)) && (conf !== "all")) {
        notFound();
    }

    if (year < 2010 || year > 2024) {
        notFound();
    }

    return (
        <>
            <Flex vertical style={{padding: "24px"}}>
                <Flex justify="center">
                    <Space>
                        <Select options={domains} defaultValue={domain} size="large" style={{minWidth: 80}}/>
                        <Select options={csVenues} defaultValue={conf} size="large" style={{minWidth: 80}}/>
                        <InputNumber min={2010} max={2024} defaultValue={year} size="large" style={{minWidth: 80}}/>
                    </Space>
                </Flex>
                <Flex vertical>
                    <Divider />
                    <CountryStat domain={domain} conf={conf} year={year} />
                </Flex>
            </Flex>
        </>
    )
}