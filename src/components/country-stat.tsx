import { Flex } from "antd";
import Title from "antd/es/typography/Title";
import TreemapChart from "./treemap-chart";
import { notFound } from "next/navigation";

async function getData(domain: string, conf: string, year: number) {
    try {
        const data = await import(`@/data/${domain}/${conf}/${year}.json`);
        return data.default;
    } catch (error) {
        return undefined;
    }
}

function determineCountryofPaper(data: any) {
    const countries_list = data["author_country"]
    const countries: Record<string, number> = {}
    let freq = 0
    let curr_max_country = "Unknown"
    for (const country of countries_list) {
        if (country == "Unknown") 
            continue
        if (country in countries) {
            countries[country]++;
        } else {
            countries[country] = 1;
        }
        if (countries[country] > freq) {
            freq = countries[country]
            curr_max_country = country
        }
    }
    return curr_max_country
}

async function filterPapersByCountry(data: any, input_country: string) {
    return data.filter((d: any) => {
        if (determineCountryofPaper(d) == input_country) {
            return true
        }
        return false
    })
}

async function countPapersByCountry(data: any) {
    const countries_to_papers: Record<string, number> = {}
    for (const d of data) {
        const country = determineCountryofPaper(d)
        if (country in countries_to_papers) {
            countries_to_papers[country]++;
        } else {
            countries_to_papers[country] = 1;
        }
    }
    return countries_to_papers
}

export default async function CountryStat({domain, conf, year}: {domain: string, conf: string, year: number}) {
    const data = await getData(domain, conf, year);

    if (!data) {
        notFound();
    }

    const countries_to_papers = await countPapersByCountry(data)

    return (
        <Flex vertical justify="center" align="center" style={{maxWidth: 1600, margin: "0 auto", width: "100%"}}>
            <Title level={3}>Papers by Country</Title>
            <TreemapChart data={countries_to_papers} width="100%" height={196} maxEntries={20} keyToHighlight="IN"/>
        </Flex>
    )
}