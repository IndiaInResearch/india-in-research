'use client'

import { SearchOutlined } from "@ant-design/icons"
import { Input } from "antd"

export default function SearchBox() {
    return (
        <Input style={{width: "256px"}} placeholder="Search" allowClear onPressEnter={e => console.log(e.target)} prefix={<SearchOutlined />} variant="outlined"/>
    )
}