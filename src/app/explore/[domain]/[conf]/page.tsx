import { Divider, Flex, Select, Space } from "antd";
import csVenues from "@/data/cs-venues.json";
import domains from "@/data/domains.json";
import { notFound } from "next/navigation";
import CountryStat from "@/components/country-stat";
export default function StatPage({
  params,
}: {
  params: { domain: string; conf: string };
}) {
    const { domain, conf } = params;
    
    // if invalid domain or conf, return 404
    if (!csVenues.find((v) => v.value === conf)) {
        notFound();
    }

    if (!domains.find((d) => d.value === domain)) {
        notFound();
    }

    return (
        <>
            <Flex vertical style={{padding: "24px"}}>
                <Flex>
                    <Space>
                        <Select options={domains} defaultValue={domain}/>
                        <Select options={csVenues} defaultValue={conf}/>
                    </Space>
                </Flex>
                <Flex vertical>
                    <Divider />
                    <CountryStat domain={domain} conf={conf}/>
                </Flex>
            </Flex>
        </>
    )
}