'use client';

import { Button, InputNumber, TreeSelect, Select, Space } from "antd";
import allVenuesData from "@/data/all-venues-data.json";
import Link from "next/link";
import { useState } from "react";

export default function ExploreForm({ domain, subdomain, subsubdomain, venue, year }: { domain: string; subdomain: string; subsubdomain: string; venue: string; year: number }) {
    const [selectedDomain, setSelectedDomain] = useState(domain);
    const [selectedPath, setSelectedPath] = useState([subdomain, subsubdomain, venue].filter(Boolean).join('/'));
    const [selectedYear, setSelectedYear] = useState(year);

    const domainOptions = allVenuesData.map(d => ({ label: d.label, value: d.value }));

    const treeData = allVenuesData.find(d => d.value === selectedDomain)?.venues?.map(sd => ({
        title: "Top " + sd.full_name,
        value: sd.subdomain,
        children: sd.venues?.map(ssd => ({
            title: "Top " + ssd.full_name,
            value: `${sd.subdomain}/${ssd.subsubdomain}`,
            children: ssd.venues?.map(v => ({
                title: v.label,
                value: `${sd.subdomain}/${ssd.subsubdomain}/${v.value}`
            })) || []
        })) || []
    })) || [];

    return (
        <Space>
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
            />
            <InputNumber 
                min={2010} 
                max={2024} 
                value={selectedYear} 
                onChange={(value) => setSelectedYear(value || 2024)}
                size="large" 
                style={{ minWidth: 80 }}
            />
            <Link href={`/explore/${selectedDomain}/${selectedPath}`}>
                <Button type="primary" size="large">Explore</Button>
            </Link>
        </Space>
    );
}