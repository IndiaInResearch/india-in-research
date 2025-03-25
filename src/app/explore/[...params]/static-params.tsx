import allVenuesData from "@/data/all-venues-data.json";

export function buildStaticParamsForAllVenues() {
    const paths = [];

    for (const venueData of allVenuesData) {
        paths.push({ params: [venueData.value] });
        for (const subdomain of venueData.venues) {
            paths.push({ params: [venueData.value, subdomain.subdomain] });
            for (const subsubdomain of subdomain.venues) {
                paths.push({ params: [venueData.value, subdomain.subdomain, subsubdomain.subsubdomain] });
                for (const conf of subsubdomain.venues) {
                    paths.push({ params: [venueData.value, subdomain.subdomain, subsubdomain.subsubdomain, conf.value] });
                }
            }
        }
    }

    return paths;
}