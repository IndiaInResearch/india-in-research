// LLM generated interfaces from pydantic models

export interface InstitutionType {
    EDUCATION: "education";
    HEALTHCARE: "healthcare";
    COMPANY: "company";
    ARCHIVE: "archive";
    NONPROFIT: "nonprofit";
    GOVERNMENT: "government";
    FACILITY: "facility";
    FUNDER: "funder";
    OTHER: "other";
}

export interface AuthorRank {
    UNDERGRAD: "undergrad";
    POSTGRAD: "postgrad";
    POSTDOC: "postdoc";
    FACULTY: "faculty";
    INDUSTRY: "industry";
}

export interface AuthorPosition {
    FIRST: "first";
    MIDDLE: "middle";
    LAST: "last";
}

export interface Institution {
    id: string;
    openalex_id?: string;
    display_name: string;
    display_name_acronyms?: string[];
    display_name_alternatives?: string[];
    ror?: string;
    homepage_url?: string;
    country_code?: string;
    type: InstitutionType;
    latlon?: [number, number];
}

export interface InstitutionLink {
    rank?: AuthorRank;
    institution?: Institution;
}

export interface Topic {
    id: string;
    openalex_id: string;
    display_name: string;
    subfield: Record<string, any>;
    field: Record<string, any>;
    domain: Record<string, any>;
}

export interface TopicLink {
    score: number;
    topic: Topic;
}

export interface Author {
    id: string;
    openalex_id?: string;
    orcid?: string;
    openreview_id?: string;
    name: string;
    email?: string;
    work?: InstitutionLink[];
    education?: InstitutionLink[];
    affiliations?: InstitutionLink[];
}

export interface AuthorLink {
    position?: AuthorPosition;
    author: Author;
    institutions?: InstitutionLink[];
    countries?: string[];
}

export interface NewPaper {
    id: string;
    openalex_id?: string;
    doi?: string;
    conf_id?: string;
    title?: string;
    authorships?: AuthorLink[];
    primary_location?: Record<string, any>;
    citation_normalized_percentile?: Record<string, any>;
    fwci?: number;
    primary_topic?: TopicLink;
    publication_venue: string;
    publication_year: number;
    related_works?: string[];
    topics?: TopicLink[];
    keywords?: Record<string, any>[];
    link?: string;
    author_names_from_paper?: string[];
    aff_names_from_paper?: string[];
    aff_domains_from_paper?: string[];
    author_rank_from_paper?: string[];
    openreview_ids_from_paper?: string[];
    status?: string;
    track?: string;
    github_link?: string;
    project_link?: string;
    video_link?: string;
    openaccess_link?: string;
    poster_link?: string;
    openreview_link?: string;
    pdf_link?: string;
    arxiv_link?: string;
    proceeding_link?: string;
    keywords_from_paper?: string[];
    primary_area_from_paper?: string;
    overall_rating_from_paper?: number[];
    percent_overall_rating_from_paper?: number[];
    novelty_from_paper?: number[];
    percent_novelty_from_paper?: number[];
}