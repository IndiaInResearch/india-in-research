import { GeoMapDataInterface } from "@/components/india-geo-map";
import { AuthorLink, AuthorRank, NewPaper } from "./paper-interfaces";
import { add_institute_data_in_mem, get_institute_data_in_mem, manual_institute_latlon } from "./domain-handlers";

export interface getDataReturnType {
    indian_papers: NewPaper[],
    countries_to_papers: Record<string, number>,
    indian_institute_to_papers_with_latlon_for_graph: GeoMapDataInterface[],
    indian_institutes_to_papers: {
        domain: string;
        count: number;
        name: any;
    }[],
    rating_overall: {
        in: number[],
        us: number[],
        cn: number[]
    },
    novelty_overall: {
        in: number[],
        us: number[],
        cn: number[]
    },
    author_ranks: {
        in: Record<AuthorRank | "unknown", number>,
        us: Record<AuthorRank | "unknown", number>,
        cn: Record<AuthorRank | "unknown", number>
    }
}

export async function getData(domain: string, confs: Record<string, number[]>): Promise<getDataReturnType | null> {
    const data_agg: NewPaper[] = []
    
    for (const [conf, years] of Object.entries(confs)) {
        try {
            for (const year of years) {
                const data = await import(`@/data/${domain}/${conf}/${year}.json`);
                if (data) {
                    data_agg.push(...data.default)
                }
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
            name: get_institute_data_in_mem(val[0])?.display_name || "Unknown"
        }
    }).filter((institute) => checkInstituteCountry(institute.domain, "IN"))

    const indian_institute_to_papers_with_latlon = institutesToLatLon(indian_institutes_to_papers)

    const getRatingData = <K extends keyof NewPaper>(papers: NewPaper[], key: K) => 
        papers.filter((paper: NewPaper) => 
            Array.isArray(paper[key]) && paper[key].length > 0).map((paper: NewPaper) => 
                (paper[key] as number[]).reduce((a: number, b: number) => a + b, 0) / (paper[key] as number[]).length);

    return {
        indian_papers: indian_papers,
        countries_to_papers: countries_to_papers,
        indian_institute_to_papers_with_latlon_for_graph: indian_institute_to_papers_with_latlon,
        indian_institutes_to_papers: indian_institutes_to_papers,
        rating_overall: {
            in: getRatingData(indian_papers, "overall_rating_from_paper"),
            us: getRatingData(us_papers, "overall_rating_from_paper"),
            cn: getRatingData(china_papers, "overall_rating_from_paper")
        },
        novelty_overall: {
            in: getRatingData(indian_papers, "novelty_from_paper"),
            us: getRatingData(us_papers, "novelty_from_paper"),
            cn: getRatingData(china_papers, "novelty_from_paper")
        },
        author_ranks: {
            in: authorRankStat(indian_papers),
            us: authorRankStat(us_papers),
            cn: authorRankStat(china_papers)
        }
    }
}

export function determineCountryofPaper(data: NewPaper) {
    const countries_list = data.authorships?.map((authorship: AuthorLink) => {
        if (authorship.countries && authorship.countries.length > 0) {
            return authorship.countries[0]
        }
        if (authorship.institutions) {
            for (const institution of authorship.institutions) {
                if (institution.institution && institution.institution.country_code) {
                    return institution.institution.country_code
                }
            }
        }
        return "Unknown";
    }) || [];

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

export function filterPapersByCountry(data: NewPaper[], input_country: string) {
    return data.filter((d: NewPaper) => {
        if (determineCountryofPaper(d) == input_country) {
            return true
        }
        return false
    })
}

export function countPapersByCountry(data: NewPaper[]) {
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

export function countPapersByInstitute(data: NewPaper[]) {
    const institutes_to_papers: Record<string, number> = {}

    for (const single_paper of data) {

        for(const authorship of single_paper.authorships || []){
            for (const institution of authorship.institutions || []) {
                if (institution.institution) {
                    add_institute_data_in_mem(institution.institution)
                }
            }
        }

        const curr_domains: string[] = []
        for (const aff_domain of single_paper.authorships?.map((authorship) => { 
            if (authorship.institutions && authorship.institutions.length > 0) {
                return authorship.institutions[0].institution?.openalex_id || "Unknown"
            }
            else {
                return "Unknown"
            }
        }) || []){

            if (curr_domains.find((d) => d == aff_domain)) {
                continue
            }
            else {
                curr_domains.push(aff_domain)
                if (aff_domain in institutes_to_papers) {
                    institutes_to_papers[aff_domain]++;
                } else {
                    institutes_to_papers[aff_domain] = 1;
                }
            }
        }
    }
    return institutes_to_papers
}


export function checkInstituteCountry(domain: string, country: string){
    const institute = get_institute_data_in_mem(domain)
    if (institute){
        return institute.country_code == country
    }
    console.warn("Unable to determine country for: ", domain)
    return false
}


export function institutesToLatLon(institutes_to_papers: {
    domain: string;
    count: number;
    name: any;
}[]) {
    const graphData: GeoMapDataInterface[] = []

    for (const institute_to_paper of institutes_to_papers) {

        const institute_data = get_institute_data_in_mem(institute_to_paper.domain)
        if (institute_data){

            if (!institute_data.latlon && institute_data.openalex_id) {
                institute_data.latlon = manual_institute_latlon(institute_data.openalex_id)
            }

            if (institute_data.latlon && institute_data.latlon.length == 2) {

                const sameLocation = graphData.find((d) => {
                    const latDiff = institute_data.latlon 
                        ? Math.abs(d.coordinates[1] - Number(institute_data.latlon[0])) 
                        : Infinity;
                    const lonDiff = institute_data.latlon 
                        ? Math.abs(d.coordinates[0] - Number(institute_data.latlon[1])) 
                        : Infinity;
                    return latDiff <= 0.1 && lonDiff <= 0.1;
                });

                if (sameLocation) {
                    sameLocation.name.push(institute_data.display_name)
                    sameLocation.value.push(institute_to_paper.count)

                    continue
                }

                graphData.push({
                    name:  [institute_to_paper.name],
                    coordinates: [institute_data.latlon[1], institute_data.latlon[0]],
                    value: [institute_to_paper.count],
                })
            }
            else {
                console.warn("Institute lat lon not available in database", institute_to_paper.domain)
            }
        }
        else {
            console.warn("Institute not available in database", institute_to_paper.domain)
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

function authorRankStat(data: NewPaper[]) {
    const ranks: Record<AuthorRank | "unknown", number> = {
        undergrad: 0,
        postgrad: 0,
        postdoc: 0,
        faculty: 0,
        industry: 0,
        unknown: 0
    }

    for (const d of data) {
        for (const authorship of d.authorships || []){
            if (authorship.institutions){
                for (const institution of authorship.institutions){
                    if (institution.rank){
                        ranks[institution.rank]++
                    }
                    else {
                        ranks["unknown"]++
                    }
                }
            }
        }
    }
    return ranks
}