import { Author, Institution, InstitutionType } from "@/utils/paper-interfaces";
import { Flex, Space, Tag, List, Button } from "antd";
import Title from "antd/es/typography/Title";
import Link from "next/link";
import { useState } from "react";

export function InstituteCard({data} : {data: Institution | null}){

    return (
        <>
            <Flex justify="space-between" style={{marginBottom: 16}}>
                <Tag>{data?.type?.toLocaleUpperCase()}</Tag>
                <Space>
                    {data?.homepage_url && 
                        <Link href={data?.homepage_url} target="_blank" rel="noopener noreferrer">
                            <Tag>Website</Tag>
                        </Link>
                    }
                    {data?.openalex_id && 
                        <Link href={data?.openalex_id} target="_blank" rel="noopener noreferrer">
                            <Tag>OpenAlex</Tag>
                        </Link>
                    }
                    {data?.ror && 
                        <Link href={data?.ror} target="_blank" rel="noopener noreferrer">
                            <Tag>ROR</Tag>
                        </Link>
                    }
                </Space>
            </Flex>
            <Title level={3}>{data?.display_name}</Title>
            <Title level={4}>{data?.display_name_acronyms?.[0]}</Title>
        </>
    )
}


export function AuthorCard({data} : {data: Author | null}){

    let author_type = "researcher"

    for (const aff of data?.affiliations || []) {
        if (aff.institution?.type == InstitutionType.COMPANY){
            author_type = "industry"
            break
        }
        else if (aff.institution?.type == InstitutionType.EDUCATION){
            author_type = "education"
            break
        }
        else if (aff.institution?.type == InstitutionType.OTHER){
            author_type = "researcher"
            break
        }
    }

    const year_to_aff: Record<string, Institution[]> = {}

    const aff_to_year: Record<string, {start: number, end: number}[]> = {}

    for (const aff of data?.affiliations || []) {
        if (aff.institution?.openalex_id && aff.years){
            for (let idx = aff.years.length - 1; idx >= 0; idx--){
                if (aff.institution.display_name in aff_to_year){
                    const name = aff.institution.display_name

                    if (aff_to_year[name].length > 0 && aff_to_year[name][aff_to_year[name].length - 1].end == aff.years[idx] - 1){
                        aff_to_year[name][aff_to_year[name].length - 1].end = aff.years[idx]
                    }
                    else {
                        aff_to_year[name].push({start: aff.years[idx], end: aff.years[idx]})
                    }
                }
                else {
                    aff_to_year[aff.institution.display_name] = [{start: aff.years[idx], end: aff.years[idx]}]
                }
            }
        }
    }

    const author_affs = Object.entries(aff_to_year).flatMap(([name, years]) => {
        return years.map(year => {
            return {
                name: name,
                start: year.start,
                end: year.end
            }
        })
    }).sort((a, b) => b.end - a.end)

    const [showAll, setShowAll] = useState(false);

    const displayedAffs = showAll ? author_affs : author_affs.slice(0, 5);

    return  (
        <>
            <Flex justify="space-between" style={{marginBottom: 16}}>
                <Tag>{author_type.toLocaleUpperCase()}</Tag>
                <Space>
                    {data?.openalex_id && 
                        <Link href={data?.openalex_id} target="_blank" rel="noopener noreferrer">
                            <Tag>OpenAlex</Tag>
                        </Link>
                    }
                    {data?.orcid && 
                        <Link href={data?.orcid} target="_blank" rel="noopener noreferrer">
                            <Tag>ORCID</Tag>
                        </Link>
                    }
                </Space>
            </Flex>
            <Title level={3}>{data?.name}</Title>
            <Title level={4}>Affiliation History</Title>
            <List
                itemLayout="horizontal"
                dataSource={displayedAffs}
                renderItem={aff => (
                    <List.Item>
                        <List.Item.Meta
                            title={aff.name}
                            description={`${aff.start} - ${aff.end}`}
                        />
                    </List.Item>
                )}
            />
            {author_affs.length > 5 && (
                <div style={{ textAlign: "center", marginTop: 16 }}>
                    <Button type="text" size="small" onClick={() => setShowAll(!showAll)}>
                        {showAll ? "View Less" : "View All"}
                    </Button>
                </div>
            )}
        </>
    )
}