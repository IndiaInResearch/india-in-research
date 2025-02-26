import styles from "./navbar.module.css";
import React from "react";
import { Flex, Input, Typography } from "antd";
import SearchBox from "./search-box";
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";

export default function NavBar() {

    return (
        <>
            <Flex style={{height: "48px"}} align="center" justify="space-between">
                <Title level={2} style={{margin: "0px"}}>IIR.org</Title>
                <SearchBox />
                <Text>User</Text>
            </Flex>
        </>
    )
}