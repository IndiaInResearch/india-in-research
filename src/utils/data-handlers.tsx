import { GeoMapDataInterface } from "@/components/india-geo-map";
import institutes_list from "@/data/third-party/university-list/world_universities_and_domains.json"
import { isDomainSame } from "./domain-handlers";

export async function getData(domain: string, confs: string[], year: number) {
    const data_agg = []
    for (const conf of confs) {
        try {
            const data = await import(`@/data/${domain}/${conf}/${year}.json`);
            if (data) {
                data_agg.push(...data.default)
            }
        } catch (error) {
            console.error(error)
            continue
        }
    }

    if (data_agg.length === 0) {
        return null
    }

    // calculate stats here and just return the required data to the React component
    // saves lots of space in rendered HTML

    const indian_papers = filterPapersByCountry(data_agg, "IN")
    const us_papers = filterPapersByCountry(data_agg, "US")
    const china_papers = filterPapersByCountry(data_agg, "CN")

    const countries_to_papers = countPapersByCountry(data_agg)
    
    const indian_institute_to_papers_with_latlon = institutesToLatLon(countPapersByInstitute(indian_papers))

    const getRatingData = (papers: any, key: string) => papers.filter((paper: any) => paper[key]?.length > 0).map((paper: any) => paper[key]?.reduce((a: number, b: number) => a + b, 0) / paper[key]?.length);

    return {
        indian_papers: indian_papers,
        countries_to_papers: countries_to_papers,
        indian_institute_to_papers_with_latlon: indian_institute_to_papers_with_latlon,
        rating_overall: {
            in: getRatingData(indian_papers, "rating"),
            us: getRatingData(us_papers, "rating"),
            cn: getRatingData(china_papers, "rating")
        },
        novelty_overall: {
            in: getRatingData(indian_papers, "novelty"),
            us: getRatingData(us_papers, "novelty"),
            cn: getRatingData(china_papers, "novelty")
        },
    }
}

export function determineCountryofPaper(data: any) {
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

export function filterPapersByCountry(data: any, input_country: string) {
    return data.filter((d: any) => {
        if (determineCountryofPaper(d) == input_country) {
            return true
        }
        return false
    })
}

export function countPapersByCountry(data: any) {
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

export function countPapersByInstitute(data: any) {
    const institutes_to_papers: Record<string, number> = {}
    for (const single_paper of data) {
        const curr_domains: string[] = []
        for (const aff_domain of single_paper["aff_domains"]){
            let domain_already_processed = false
            for (const curr_domain of curr_domains){
                if (isDomainSame(aff_domain, curr_domain)){
                    domain_already_processed = true
                    break
                }
            }
            if (domain_already_processed){
                continue
            }
            curr_domains.push(aff_domain)
            let institute_count_incremented = false
            for(const institute in institutes_to_papers){
                if (isDomainSame(aff_domain, institute)){
                    institutes_to_papers[institute]++;
                    institute_count_incremented = true
                    break
                }
            }
            if (!institute_count_incremented){
                institutes_to_papers[aff_domain] = 1;
            }
        }
    }
    return institutes_to_papers
}

export function institutesToLatLon(institutes_to_papers: Record<string, number>) {
    const domains_to_latlon_and_name: Record<string, {latlon: number[], name: string}> = {}
    for (const institute of institutes_list) {
        if (institute.alpha_two_code == "IN" && institute.latlon != null) {
            for (const domain of institute.domains) {
                domains_to_latlon_and_name[domain] = {latlon: institute.latlon, name: institute.name}
            }
        }
    }

    const graphData: GeoMapDataInterface[] = []
    for (const institute in institutes_to_papers) {
        if (institute in domains_to_latlon_and_name) {
            graphData.push({
                name:  domains_to_latlon_and_name[institute].name,
                coordinates: [domains_to_latlon_and_name[institute].latlon[1], domains_to_latlon_and_name[institute].latlon[0]],
                value: institutes_to_papers[institute]
            })
        }
    }
    return graphData
}