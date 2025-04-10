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

const manual_institute_latlon_data: Record<string, [number, number]> = {}

export function manual_institute_latlon(id: string) {
    return manual_institute_latlon_data[id] || undefined;
}