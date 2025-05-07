import allVenuesData from "@/data/all-venues-data.json";

export function buildStaticParamsForAllVenues() {
    const paths = [];
    const allYears = [2022, 2023, 2024, 2025];

    for (const venueData of allVenuesData) {
        // Add base path without year
        paths.push({ params: [venueData.value] });
        
        // Add paths with all years for non-leaf node
        for (const year of allYears) {
            paths.push({ params: [venueData.value, `year=${year}`]});
        }

        for (const subdomain of venueData.venues) {
            // Add subdomain path without year
            paths.push({ params: [venueData.value, subdomain.subdomain] });
            
            // Add paths with all years for non-leaf node
            for (const year of allYears) {
                paths.push({ params: [venueData.value, subdomain.subdomain, `year=${year}`] });
            }

            for (const subsubdomain of subdomain.venues) {
                // Add subsubdomain path without year
                paths.push({ params: [venueData.value, subdomain.subdomain, subsubdomain.subsubdomain] });
                
                // Add paths with all years for non-leaf node
                for (const year of allYears) {
                    paths.push({ params: [venueData.value, subdomain.subdomain, subsubdomain.subsubdomain, `year=${year}`] });
                }

                for (const conf of subsubdomain.venues) {
                    // Add conference path without year
                    paths.push({ params: [venueData.value, subdomain.subdomain, subsubdomain.subsubdomain, conf.value] });
                    
                    // Add paths only for valid years from conf.places
                    const validYears = conf.places.map(p => p.year);
                    for (const year of validYears) {
                        paths.push({ params: [venueData.value, subdomain.subdomain, subsubdomain.subsubdomain, conf.value, `year=${year}`] });
                    }
                }
            }
        }
    }

    return paths;
}