import { Breadcrumb, Divider, Flex, Space } from "antd";
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
import ShowRecommended from "@/components/show-recommended";

export function generateStaticParams() {
    return buildStaticParamsForAllVenues();
}

// LLM generated code
export function generateMetadata({ 
    params,
}: { 
    params: { params: string[] };
}): Metadata {
    if (params.params.length > 0) {
        const yearParam = params.params.find(param => param.startsWith('year%3D'));
        let year: number | null = null;
        
        // Check if year parameter exists and is not the last parameter
        if (yearParam && yearParam !== params.params[params.params.length - 1]) {
            return { 
                title: "Not Found",
                description: "Page not found. Invalid."
            };
        }
        
        try {
            if (yearParam) {
                year = Number(yearParam.split('%3D')[1]);
            }
        } catch {
            year = null;
        }

        // Remove year parameter from the array for finding the title
        const paramsWithoutYear = params.params.filter(param => !param.startsWith('year%3D'));
        const lastKey = paramsWithoutYear[paramsWithoutYear.length - 1];

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

        const yearSuffix = year ? ` ${year}` : '';

        return { 
            title: `${title} Stats${yearSuffix}`,
            description: `${title} Stats${yearSuffix} for research papers published from Indian universities and institutions.`
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
    if (params.params.length > 5) {
        notFound();
    }

    // Extract year from params if it exists
    console.log(params.params)
    const yearParam = params.params.find(param => param.startsWith('year%3D'));
    let year: number | null = null;
    
    // Check if year parameter exists and is not the last parameter
    if (yearParam && yearParam !== params.params[params.params.length - 1]) {
        notFound();
    }
    
    try {
        if (yearParam) {
            year = Number(yearParam.split('%3D')[1]);
        }
    } catch {
        year = null;
    }

    // Remove year parameter from the array for processing other params
    const paramsWithoutYear = params.params.filter(param => !param.startsWith('year%3D'));
    const [domain, subdomain, subsubdomain, conf] = paramsWithoutYear;

    if (!domain) {
        notFound();
    }

    let subsetVenuesData = []
    let singleConfData = false
    const hierarchyLabels = []
    const breadCrumbLabels = []

    hierarchyLabels.push(allVenuesData.find((d) => d.value === domain)?.label || "")
    breadCrumbLabels.push(allVenuesData.find((d) => d.value === domain)?.full_name || "")
    subsetVenuesData = allVenuesData.find((d) => d.value === domain)?.venues || []
    

    if (subdomain) {
        hierarchyLabels.push(subsetVenuesData.find((sd) => sd.subdomain === subdomain)?.label || "")
        breadCrumbLabels.push(subsetVenuesData.find((sd) => sd.subdomain === subdomain)?.full_name || "")
        subsetVenuesData = subsetVenuesData.find((sd) => sd.subdomain === subdomain)?.venues || []
        
        if (subsubdomain) {
            hierarchyLabels.push(subsetVenuesData.find((ssd) => ssd.subsubdomain === subsubdomain)?.label || "")
            breadCrumbLabels.push(subsetVenuesData.find((ssd) => ssd.subsubdomain === subsubdomain)?.full_name || "")
            subsetVenuesData = subsetVenuesData.find((ssd) => ssd.subsubdomain === subsubdomain)?.venues || []

            if (conf) {
                const conf_data = subsetVenuesData.find((v) => v.value === conf)
                if (conf_data) {
                    breadCrumbLabels.push(conf_data.label)
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

    const venueKeysWithYear: Record<string, number[]> = {}

    selectedVenues.forEach((venue) => {
        if (venue.places) {
            if (year){
                for (const place of venue.places) {
                    if (place.year === year) {
                        venueKeysWithYear[venue.value] = [year]
                    }
                }
            }
            else {
                const sortedYears = venue.places.sort((a: any, b: any) => b.year - a.year)
                venueKeysWithYear[venue.value] = sortedYears[0].year ? [sortedYears[0].year] : []
            }
        }
    })

    if (Object.keys(venueKeysWithYear).length == 1){
        year = Object.values(venueKeysWithYear)[0][0]
    }

    console.log(venueKeysWithYear)
    const data = await getData(domain, venueKeysWithYear);

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
                    <Space style={{maxWidth: 1600, margin: "0 auto", width: "100%", marginBottom: 16}}>
                        <Breadcrumb items={breadCrumbLabels.map((label) => ({ title: label }))} />
                    </Space>
                    <VenueTitleDisplay singleConfData={singleConfData} selectedVenues={selectedVenues} hierarchyLabels={hierarchyLabels} year={year} venueKeysWithYear={venueKeysWithYear}/>
                    <ShowRecommended domain={domain} subdomain={subdomain} subsubdomain={subsubdomain} venue={conf} year={year} venueKeysWithYear={venueKeysWithYear} />
                    <Divider />
                    <PaperStat data={data} />
                    <Divider />
                    <CountryStat data={data}/>
                    {data.indian_papers.length > 0 && 
                        <>
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
                        </>
                    }
                    <ShowRecommended domain={domain} subdomain={subdomain} subsubdomain={subsubdomain} venue={conf} year={year} venueKeysWithYear={venueKeysWithYear} />
                </Flex>
            </Flex>
        </>
    )
}