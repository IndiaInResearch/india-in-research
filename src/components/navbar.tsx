import { tokens } from "@/lib/fluent-ui-tokens"
import styles from "./navbar.module.css";
import { LargeTitle, SearchBox, Text, Title1 } from "@fluentui/react-components";
import React from "react";

export default async function NavBar() {

    return (
        <>
            <div className={styles.flexcontainer} style={{ height: "48px", justifyContent: 'space-between', alignItems: 'center', padding: '0px 16px'}}>
                <div className={styles.flexitem}>
                    <Title1>IIR.org</Title1>
                </div>
                <div>
                    <SearchBox placeholder="Search"/>
                </div>
                <div>
                    <Text>User</Text>
                </div>
            </div>
        </>
    )
}