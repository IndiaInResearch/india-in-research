'use client';

import { Button, InputNumber, Select, Space } from "antd";
import csVenues from "@/data/cs-venues.json";
import domains from "@/data/domains.json";
import Link from "next/link";
import { useState } from "react";

export default function ExploreForm({ domain, conf, year }: { domain: string; conf: string; year: number }) {
    const [selectedDomain, setSelectedDomain] = useState(domain);
    const [selectedConf, setSelectedConf] = useState(conf);
    const [selectedYear, setSelectedYear] = useState(year);

    return (
        <Space>
            <Select 
                options={domains} 
                value={selectedDomain} 
                onChange={setSelectedDomain}
                size="large" 
                style={{minWidth: 80}}
            />
            <Select 
                options={csVenues} 
                value={selectedConf} 
                onChange={setSelectedConf}
                size="large" 
                style={{minWidth: 80}}
            />
            <InputNumber 
                min={2010} 
                max={2024} 
                value={selectedYear} 
                onChange={(value) => setSelectedYear(value || 2024)}
                size="large" 
                style={{minWidth: 80}}
            />
            <Link href={`/explore/${selectedDomain}/${selectedConf}/${selectedYear}`}>
                <Button type="primary" size="large">Explore</Button>
            </Link>
        </Space>
    );
} 