import React from "react";
import { Flex, Input, Space, Typography } from "antd";
import Image from "next/image";
import logoImage from "./../../public/logo-cropped.svg";
import Link from "next/link";
import SocialIcons from "./socials";

export default function NavBar() {

    return (
        <>
            <Flex style={{height: "48px", paddingTop: "16px", paddingLeft: "min(5vw, 50px)", paddingRight: "min(5vw, 50px)"}} align="center" justify="space-between">
                <Space style={{marginTop: "16px"}}>
                    <Link href="/">
                        <Image src={logoImage} alt="India in Research" height={36} style={{filter: "var(--logo-color-filter)"}}/>
                    </Link>
                </Space>
                <SocialIcons />
            </Flex>
        </>
    )
}