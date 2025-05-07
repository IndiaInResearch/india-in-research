import { Flex, Button, Space } from "antd";
import Link from "next/link";
import allVenuesData from "@/data/all-venues-data.json"

export default function ShowRecommended({
    domain, 
    subdomain, 
    subsubdomain, 
    venue, 
    year, 
    venueKeysWithYear
}: {
    domain: string, 
    subdomain: string, 
    subsubdomain: string, 
    venue: string, 
    year: number | null, 
    venueKeysWithYear: Record<string, number[]>
}) {

    const linkAndText: {link: string, text: string}[] = []

    // randomly pick 2 elements from venueKeysWithYear
    let keys = Object.keys(venueKeysWithYear)
    keys = keys.filter((key) => key != venue)
    const randomKeys = keys.sort(() => Math.random() - 0.5).slice(0, 2)

    if (!venue) {
        if (subsubdomain){
            linkAndText.push({link: `/explore/${domain}/${subdomain}`, text: subdomain})
            for (const key of randomKeys){
                linkAndText.push({link: `/explore/${domain}/${subdomain}/${subsubdomain}/${key}`, text: key})
            }

            const siblingVenues = allVenuesData.find((d) => d.value === domain)?.venues.find((v) => v.value === subdomain)?.venues

            if (siblingVenues){
                for (const siblingVenue of siblingVenues){
                    if (siblingVenue.value != subsubdomain){
                        linkAndText.push({link: `/explore/${domain}/${subdomain}/${siblingVenue.value}`, text: siblingVenue.label})
                    }
                }
            }
        }
        else if (subdomain){
            const siblingVenues = allVenuesData.find((d) => d.value === domain)?.venues

            if (siblingVenues){
                for (const siblingVenue of siblingVenues){
                    if (siblingVenue.value != subdomain){
                        linkAndText.push({link: `/explore/${domain}/${siblingVenue.value}`, text: siblingVenue.label})
                    }
                }
            }

            // get random children from allVenuesData
            const randomChildren = allVenuesData.find((d) => d.value === domain)?.venues.find((v) => v.value === subdomain)?.venues.sort(() => Math.random() - 0.5).slice(0, 2)

            if (randomChildren){
                for (const child of randomChildren){
                    linkAndText.push({link: `/explore/${domain}/${subdomain}/${child.value}`, text: child.label})
                }
            }
        }
    }
    else{
        linkAndText.push({link: `/explore/${domain}/${subdomain}/${subsubdomain}`, text: subsubdomain})
        linkAndText.push({link: `/explore/${domain}/${subdomain}`, text: subdomain})

        const siblingVenues = allVenuesData.find((d) => d.value === domain)?.venues.find((v) => v.value === subdomain)?.venues.find((v) => v.value === subsubdomain)?.venues

        if (siblingVenues){
            for (const siblingVenue of siblingVenues){
                if (siblingVenue.value != venue){
                    linkAndText.push({link: `/explore/${domain}/${subdomain}/${subsubdomain}/${siblingVenue.value}`, text: siblingVenue.label})
                }
            }
        }
    }

    const randomLinkAndText = linkAndText.sort(() => Math.random() - 0.5).slice(0, 3)

    return (
        <Space wrap style={{marginTop: 16}}>
            {
                randomLinkAndText.map((linkAndText) => (
                    <Link href={linkAndText.link} key={linkAndText.link}>
                        <Button type="link">
                            View latest {linkAndText.text.toLocaleUpperCase()} Stats
                        </Button>
                    </Link>
                ))
            }
        </Space>
    )
}