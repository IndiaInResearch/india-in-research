// @ts-expect-error library is old. missing something
import parser from "tld-extract"
import institutes_list from "@/data/third-party/university-list/world_universities_and_domains.json"
import { Institution } from "@/utils/paper-interfaces"

// const institute_global_data: Record<string, any> = {}

// for (const institute of institutes_list) {
//     for (const domain of institute.domains) {
//         institute_global_data[domain] = institute
//     }
// }

// export function getInstituteIdentifierDomain(domain: string) {
//     if (domain in institute_global_data) {
//         return institute_global_data[domain].domains[0]
//     }
//     try {
//         return parser("http://" + domain).domain as string
//     }
//     catch (e) {
//         return domain
//     }
// }

// export function getInstituteFromDomain(domain: string) {
//     domain = getInstituteIdentifierDomain(domain)
//     if (domain in institute_global_data) {
//         return institute_global_data[domain]
//     }
//     return null
// }


// for now assume the only Open Alex institutes are valid, rest go into the unknown
const institute_data_open_alex: Record<string, Institution> = {}

export function add_institute_data_in_mem(data: Institution) {
    if (data.openalex_id) {
        institute_data_open_alex[data.openalex_id] = data
    }
}

export function get_institute_data_in_mem(id: string) {
    if (id in institute_data_open_alex) {
        return institute_data_open_alex[id]
    }
    return null
}

const manual_institute_latlon_data: Record<string, [number, number]> = {
    "https://openalex.org/I65181880": [17.40, 78.48],       // IIT Hyderabad
    "https://openalex.org/I55215948": [19.08, 72.88],       // TCS Research India
    "https://openalex.org/I106542073": [22.58, 88.36],      // University of Calcutta
    "https://openalex.org/I154549908": [26.24, 73.02],      // IIT Jodhpur
    "https://openalex.org/I4210139030": [12.97, 77.59],     // Samsung Bangalore
    "https://openalex.org/I119241673": [30.97, 76.52],      // IIT Ropar
    "https://openalex.org/I164861460": [13.35, 74.79],      // MAHE Manipal
    "https://openalex.org/I4819740": [14.68, 77.60],    // Sri Sathya Sai Institute of Higher Learning
    // "https://openalex.org/I162827531": []
    // "https://openalex.org/I9579091": []
    // "https://openalex.org/I27674431": []
    // "https://openalex.org/I1340206300": []
    // "https://openalex.org/I154851008": []
    // "https://openalex.org/I3132975163": []
    // "https://openalex.org/I74796645": []
    // "https://openalex.org/I3129773123": []
    // "https://openalex.org/I4210151956": []
    // "https://openalex.org/I1317621060": []
    // "https://openalex.org/I24676775": []
    // "https://openalex.org/I4210109292": []
    // "https://openalex.org/I4210092736": []
    // "https://openalex.org/I4210127441": []
    // "https://openalex.org/I181996519": []
}

export function manual_institute_latlon(id: string) {
    return manual_institute_latlon_data[id] || undefined;

}