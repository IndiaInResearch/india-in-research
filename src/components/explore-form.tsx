'use client';

import { Button, InputNumber, TreeSelect, Select, Space } from "antd";
import allVenuesData from "@/data/all-venues-data.json";
import Link from "next/link";
import { useState } from "react";

export default function ExploreForm({ domain, subdomain, subsubdomain, venue, year }: { domain: string; subdomain: string; subsubdomain: string; venue: string; year: number | null }) {
    const [selectedDomain, setSelectedDomain] = useState(domain);
    const [selectedPath, setSelectedPath] = useState([subdomain, subsubdomain, venue].filter(Boolean).join('/'));
    const [selectedYear, setSelectedYear] = useState<number | 'latest'>(year || 'latest');

    const domainOptions = allVenuesData.map(d => ({ label: d.label, value: d.value }));

    const getAvailableYears = (path: string) => {
        if (!path) return [{ label: 'Latest', value: 'latest' }, ...Array.from({ length: 4 }, (_, i) => ({ label: (2022 + i).toString(), value: 2022 + i }))];
        
        const [subdomain, subsubdomain, venue] = path.split('/');
        const domainData = allVenuesData.find(d => d.value === selectedDomain);
        const subdomainData = domainData?.venues?.find(sd => sd.subdomain === subdomain);
        const subsubdomainData = subdomainData?.venues?.find(ssd => ssd.subsubdomain === subsubdomain);
        const venueData = subsubdomainData?.venues?.find(v => v.value === venue);

        if (venueData) {
            return Array.from(new Set(venueData.places.map(p => p.year))).sort().map(year => ({
                label: year.toString(),
                value: year
            }));
        }
        
        return [{ label: 'Latest', value: 'latest' }, ...Array.from({ length: 4 }, (_, i) => ({ label: (2022 + i).toString(), value: 2022 + i }))];
    };

    const yearOptions = getAvailableYears(selectedPath);

    const treeData = allVenuesData.find(d => d.value === selectedDomain)?.venues?.map(sd => ({
        title: sd.full_name,
        value: sd.subdomain,
        children: sd.venues?.map(ssd => ({
            title: ssd.full_name,
            value: `${sd.subdomain}/${ssd.subsubdomain}`,
            children: ssd.venues?.map(v => ({
                title: v.label,
                value: `${sd.subdomain}/${ssd.subsubdomain}/${v.value}`,
                year: v.places.map(p => p.year)
            })) || []
        })) || []
    })) || [];

    return (
        <Space wrap>
            <Select
                options={domainOptions}
                value={selectedDomain}
                onChange={(value) => {
                    setSelectedDomain(value);
                    setSelectedPath('');
                }}
                size="large"
                style={{ minWidth: 80 }}
                placeholder="Select a domain"
            />
            <TreeSelect
                treeData={treeData}
                value={selectedPath}
                onChange={setSelectedPath}
                size="large"
                style={{ minWidth: 300 }}
                placeholder="Select a subdomain or venue"
                treeDefaultExpandAll
                disabled={!selectedDomain} // Disable TreeSelect if no domain is selected
                treeLine={true}
            />
            <Select
                options={yearOptions}
                value={selectedYear}
                onChange={setSelectedYear}
                size="large"
                style={{ minWidth: 80 }}
            />
            <Link href={`/explore/${selectedDomain}/${selectedPath}${selectedYear === 'latest' ? '' : `/year=${selectedYear}`}`}>
                <Button type="primary" size="large">Explore</Button>
            </Link>
        </Space>
    );
}