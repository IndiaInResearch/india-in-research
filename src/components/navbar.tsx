import styles from "./navbar.module.css";
import React from "react";
import { Flex, Input, Space, Typography } from "antd";
import SearchBox from "./search-box";
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
import Image from "next/image";
import logoImage from "./../../public/logo-cropped.svg";
import Link from "next/link";

export default function NavBar() {

    return (
        <>
            <Flex style={{height: "48px", paddingTop: "16px"}} align="center" justify="space-between">
                <Space style={{marginTop: "16px"}}>
                    <Link href="/">
                        <Image src={logoImage} alt="India in Research" height={36} style={{filter: "var(--logo-color-filter)"}}/>
                    </Link>
                </Space>
                <SearchBox />
                <Text>User</Text>
            </Flex>
        </>
    )
}