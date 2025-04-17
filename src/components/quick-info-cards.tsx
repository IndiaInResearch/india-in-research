import { Author, Institution, InstitutionType } from "@/utils/paper-interfaces";
import { Flex, Space, Tag } from "antd";
import Title from "antd/es/typography/Title";
import Link from "next/link";

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
        </>
    )
}