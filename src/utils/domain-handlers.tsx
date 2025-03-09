import institutes_list from "@/data/third-party/university-list/world_universities_and_domains.json"

const institute_global_data: Record<string, any> = {}

for (const institute of institutes_list) {
    if (institute.alpha_two_code == "IN" && institute.latlon != null) {
        for (const domain of institute.domains) {
            institute_global_data[domain] = institute
        }
    }
}

export function isDomainSame(domain1: string, domain2: string) {
    if (domain1 == domain2) {
        return true
    }
    if (institute_global_data[domain1] == institute_global_data[domain2]) {
        return true
    }
    return false
}

export function getInstituteFromDomain(domain: string) {
    if (domain in institute_global_data) {
        return institute_global_data[domain]
    }
    const domain_parts = domain.split(".")
    if (domain_parts.length > 1) {
        const subdomain = domain_parts.slice(1).join(".")
        if (subdomain in institute_global_data) {
            return institute_global_data[subdomain]
        }
    }
    return null
}