import { Divider, Flex } from "antd";
import csVenues from "@/data/cs-venues.json";
import domains from "@/data/domains.json";
import { notFound } from "next/navigation";
import CountryStat from "@/components/country-stat";
import ExploreForm from "@/components/explore-form";

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
            <Flex vertical>
                <Flex justify="center">
                    <ExploreForm domain={domain} conf={conf} year={year} />
                </Flex>
                <Flex vertical>
                    <Divider />
                    <CountryStat domain={domain} conf={conf} year={year} />
                </Flex>
            </Flex>
        </>
    )
}