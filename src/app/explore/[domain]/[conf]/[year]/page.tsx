import { Divider, Flex } from "antd";
import csVenues from "@/data/cs-venues.json";
import domains from "@/data/domains.json";
import { notFound } from "next/navigation";
import CountryStat from "@/components/country-stat";
import ExploreForm from "@/components/explore-form";
import Title from "antd/es/typography/Title";
import { countPapersByCountry } from "@/utils/data-handlers";
import { getData } from "@/utils/data-handlers";
import LocaleStat from "@/components/locale-stat";
import ScoreStat from "@/components/score-stat";
import { staticParams } from "./static-params";

export function generateStaticParams() {
    return staticParams
}

export default async function StatPage({
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

    const conf_name = csVenues.find((v) => v.value === conf)?.full_name || conf;
    const location = csVenues.find((v) => v.value === conf)?.places?.find((v) => v.year == year)?.location || "";

    const data = await getData(domain, conf, year);

    if (!data) {
        notFound();
    }

    return (
        <>
            <Flex vertical>
                <Flex justify="center">
                    <ExploreForm domain={domain} conf={conf} year={year} />
                </Flex>
                <Flex vertical justify="center" align="center">
                    <Divider />
                    <Title level={3}>{conf_name}, {year}. {location}</Title>
                    <CountryStat domain={domain} conf={conf} year={year} data={data}/>
                    <Divider />
                    <LocaleStat domain={domain} conf={conf} year={year} data={data}/>
                    <Divider />
                    <ScoreStat domain={domain} conf={conf} year={year} data={data} ratingKey="rating" title="Rating Score Distribution"/>
                    <Divider />
                    <ScoreStat domain={domain} conf={conf} year={year} data={data} ratingKey="novelty" title="Novelty Score Distribution"/>
                </Flex>
            </Flex>
        </>
    )
}