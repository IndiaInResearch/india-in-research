import styles from "./navbar.module.css";
import React from "react";
import { Input, Typography } from "antd";
import SearchBox from "./search-box";
import Title from "antd/es/typography/Title";

export default function NavBar() {

    return (
        <>
            <div className={styles.flexcontainer} style={{ height: "48px", justifyContent: 'space-between', alignItems: 'center', padding: '0px 16px'}}>
                <div className={styles.flexitem}>
                    <Title>IIR.org</Title>
                </div>
                <div>
                    <SearchBox />
                </div>
                <div>
                    {/* <Text>User</Text> */}
                </div>
            </div>
        </>
    )
}