'use client'

import { SearchOutlined } from "@ant-design/icons"
import { Input } from "antd"

export default function SearchBox({
    onChange = () => {}, 
    onPressEnter = () => {}, 
    value = "",
    placeholder = "Search"
} : {
    onChange?: (e: any) => void, 
    onPressEnter?: (e: any) => void, 
    value?: string,
    placeholder?: string
}) {
    return (
        <Input style={{width: "256px"}} placeholder={placeholder} allowClear prefix={<SearchOutlined />} variant="outlined" value={value} onChange={onChange} onPressEnter={onPressEnter}/>
    )
}