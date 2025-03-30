import { Space } from "antd";
import Link from "next/link";
import { BsTwitterX, BsGithub } from "react-icons/bs";
import { SiBluesky } from "react-icons/si";


export default function SocialIcons() {
    return (
        <Space align="baseline" size="middle">
            <Link href="https://x.com/IndiaInResearch" target="_blank" rel="noopener noreferrer">
                <BsTwitterX style={{ fontSize: '20px', color: '#000000'}} />
            </Link>
            <Link href="https://bsky.app/profile/indiainresearch.org" target="_blank" rel="noopener noreferrer">
                <SiBluesky style={{ fontSize: '20px', color: '#000000'}} />
            </Link>
            <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                <BsGithub style={{ fontSize: '20px', color: '#000000'}} />
            </Link>
        </Space>
    )
}