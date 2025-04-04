import { GeoMapDataInterface } from "@/components/india-geo-map";
import institutes_list from "@/data/third-party/university-list/world_universities_and_domains.json"
import { getInstituteFromDomain, getInstituteIdentifierDomain } from "./domain-handlers";

export async function getData(domain: string, confs: string[], year: number) {
    const data_agg = []
    for (const conf of confs) {
        try {
            const data = await import(`@/data/${domain}/${conf}/${year}.json`);
            if (data) {
                data_agg.push(...(data.default.map((d: any) => {
                    d["conf"] = conf
                    d["year"] = year
                    return d
                })))
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

    const institutes_to_papers = countPapersByInstitute(indian_papers)

    const indian_institutes_to_papers = Object.entries(institutes_to_papers).map((val) => {
        return {
            domain: val[0],
            count: val[1],
            name: getInstituteFromDomain(val[0])?.name
        }
    }).filter((institute) => checkInstituteCountry(institute.domain, "IN"))

    const indian_institute_to_papers_with_latlon = institutesToLatLon(indian_institutes_to_papers)

    const getRatingData = (papers: any, key: string) => papers.filter((paper: any) => paper[key]?.length > 0).map((paper: any) => paper[key]?.reduce((a: number, b: number) => a + b, 0) / paper[key]?.length);

    return {
        indian_papers: indian_papers,
        countries_to_papers: countries_to_papers,
        indian_institute_to_papers_with_latlon_for_graph: indian_institute_to_papers_with_latlon,
        indian_institutes_to_papers: indian_institutes_to_papers,
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
        author_ranks: {
            in: authorRankStat(indian_papers),
            us: authorRankStat(us_papers),
            cn: authorRankStat(china_papers)
        }
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
            const standard_domain = getInstituteIdentifierDomain(aff_domain)

            if (curr_domains.find((d) => d == standard_domain)) {
                continue
            }
            else {
                curr_domains.push(standard_domain)
                if (standard_domain in institutes_to_papers) {
                    institutes_to_papers[standard_domain]++;
                } else {
                    institutes_to_papers[standard_domain] = 1;
                }
            }
        }
    }
    return institutes_to_papers
}


export function checkInstituteCountry(domain: string, country: string){
    const institute = getInstituteFromDomain(domain)
    if (institute){
        return institute.alpha_two_code == country
    }
    console.warn("Unable to determine country for: ", domain)
    return false
}


export function institutesToLatLon(institutes_to_papers: {
    domain: string;
    count: number;
    name: any;
}[]) {
    const domains_to_latlon_and_name: Record<string, {latlon: number[], name: string}> = {}
    for (const institute of institutes_list) {
        if (institute.alpha_two_code == "IN" && institute.latlon != null) {
            for (const domain of institute.domains) {
                domains_to_latlon_and_name[domain] = {latlon: institute.latlon, name: institute.name}
            }
        }
    }

    const graphData: GeoMapDataInterface[] = []
    for (const institute of institutes_to_papers) {
        if (institute.domain in domains_to_latlon_and_name) {
            const coords = domains_to_latlon_and_name[institute.domain].latlon
            const val = institute.count

            const sameLocation = graphData.find((d) => d.coordinates[1] == coords[0] && d.coordinates[0] == coords[1])  // add approx distance check here
            if (sameLocation) {
                sameLocation.name.push(domains_to_latlon_and_name[institute.domain].name)
                sameLocation.value.push(val)

                continue
            }

            graphData.push({
                name:  [institute.name],
                coordinates: [domains_to_latlon_and_name[institute.domain].latlon[1], domains_to_latlon_and_name[institute.domain].latlon[0]],
                value: [institute.count],
            })
        }
        else{
            console.warn("Institute lat lon not available in database", institute.domain)
        }
    }
    return graphData
}

export function dfsVenueData(venues_data: any[]): any[] {
    const venues = [];
    for (const venue_data of venues_data) {
        if ("venues" in venue_data) {
            venues.push(...dfsVenueData(venue_data.venues));
        }
        else {
            venues.push(venue_data);
        }
    }
    return venues;
}

function authorRankStat(data: any) {
    const ranks: Record<string, number> = {}
    for (const d of data) {
        if (d["author_rank_standarized"]){
            for (const pos of d["author_rank_standarized"]){
                if (pos in ranks) {
                    ranks[pos]++;
                } else {
                    ranks[pos] = 1;
                }
            }
        }
    }
    return ranks
}