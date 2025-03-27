// @ts-expect-error library is old. missing something
import parser from "tld-extract"
import institutes_list from "@/data/third-party/university-list/world_universities_and_domains.json"

const institute_global_data: Record<string, any> = {}

for (const institute of institutes_list) {
    for (const domain of institute.domains) {
        institute_global_data[domain] = institute
    }
}

export function getInstituteIdentifierDomain(domain: string) {
    if (domain in institute_global_data) {
        return institute_global_data[domain].domains[0]
    }
    try {
        return parser("http://" + domain).domain as string
    }
    catch (e) {
        return domain
    }
}

export function getInstituteFromDomain(domain: string) {
    domain = getInstituteIdentifierDomain(domain)
    if (domain in institute_global_data) {
        return institute_global_data[domain]
    }
    return null
}