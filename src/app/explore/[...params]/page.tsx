import { Divider, Flex, Space } from "antd";
import allVenuesData from "@/data/all-venues-data.json";
import { notFound } from "next/navigation";
import CountryStat from "@/components/country-stat";
import ExploreForm from "@/components/explore-form";
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
import { countPapersByCountry, dfsVenueData } from "@/utils/data-handlers";
import { getData } from "@/utils/data-handlers";
import LocaleStat from "@/components/locale-stat";
import ScoreStat from "@/components/score-stat";
import { buildStaticParamsForAllVenues } from "./static-params";
import VenueTitleDisplay from "@/components/venue-title-display";
import UndergraduateStat from "@/components/undergraduate-stat";
import PaperStat from "@/components/paper-stat";
import { Metadata } from "next";

export function generateStaticParams() {
    return buildStaticParamsForAllVenues();
}

// LLM generated code
export function generateMetadata({ params }: { params: { params: string[] } }): Metadata {
    if (params.params.length > 0) {
        const lastKey = params.params[params.params.length - 1]

        let title: string | null = null

        for (const domain of allVenuesData) {
            if (domain.value === lastKey) {
                title = domain.full_name
                break
            }
            else{
                for (const subdomain of domain.venues) {
                    if (subdomain.value === lastKey) {
                        title = subdomain.full_name
                    }
                    else{
                        for (const subsubdomain of subdomain.venues) {
                            if (subsubdomain.value === lastKey) {
                                title = subsubdomain.full_name
                            }
                            else{
                                for (const conf of subsubdomain.venues) {
                                    if (conf.value === lastKey) {
                                        title = conf.label
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // add Opengraph metadata for title and description here
        if (!title) {
            return { 
                title: "Not Found",
                description: "Page not found. Invalid."
            };
        }

        return { 
            title: `${title} Stats`,
            // change this line
            description: `${title} Stats for impact and diversty of top research papers from Indian universities and institutions.`
        };
    }

    return {
        title: "Not Found",
    };
}

export default async function StatPage({
  params,
}: {
  params: {params: string[]};
}) {
    if (params.params.length > 4) {
        notFound();
    }

    const [domain, subdomain, subsubdomain, conf] = params.params;

    if (!domain) {
        notFound();
    }

    let subsetVenuesData = []
    let singleConfData = false
    const hierarchyLabels = []

    hierarchyLabels.push(allVenuesData.find((d) => d.value === domain)?.label || "")
    subsetVenuesData = allVenuesData.find((d) => d.value === domain)?.venues || []
    

    if (subdomain) {
        hierarchyLabels.push(subsetVenuesData.find((sd) => sd.subdomain === subdomain)?.label || "")
        subsetVenuesData = subsetVenuesData.find((sd) => sd.subdomain === subdomain)?.venues || []
        
        if (subsubdomain) {
            hierarchyLabels.push(subsetVenuesData.find((ssd) => ssd.subsubdomain === subsubdomain)?.label || "")
            subsetVenuesData = subsetVenuesData.find((ssd) => ssd.subsubdomain === subsubdomain)?.venues || []

            if (conf) {
                const conf_data = subsetVenuesData.find((v) => v.value === conf)
                if (conf_data) {
                    subsetVenuesData = [conf_data]
                    singleConfData = true
                }
                else {
                    notFound();
                }
            }
        }
    }

    const selectedVenues = dfsVenueData(subsetVenuesData)

    if (selectedVenues.length == 0) {
        notFound();
    }

    const year = 2024

    const venueKeys = selectedVenues.map(v => v.value)

    const data = await getData(domain, venueKeys, year);

    if (!data) {
        notFound();
    }

    return (
        <>
            <Flex vertical>
                <Flex justify="center">
                    <ExploreForm domain={domain} subdomain={subdomain} subsubdomain={subsubdomain} venue={conf} year={year} />
                </Flex>
                <Flex vertical justify="center" align="center">
                    <Divider />
                    <VenueTitleDisplay singleConfData={singleConfData} selectedVenues={selectedVenues} hierarchyLabels={hierarchyLabels} year={year}/>
                    <Divider />
                    <PaperStat data={data} />
                    <Divider />
                    <CountryStat data={data}/>
                    <Divider />
                    <LocaleStat data={data}/>
                    <Divider />
                    <UndergraduateStat data={data}/>
                    {(singleConfData) && (
                        <>
                            <Divider />
                            <ScoreStat data={data} ratingKey="rating" title="Rating Score Distribution"/>
                            <Divider />
                            <ScoreStat data={data} ratingKey="novelty" title="Novelty Score Distribution"/>
                        </>
                    )}
                </Flex>
            </Flex>
        </>
    )
}