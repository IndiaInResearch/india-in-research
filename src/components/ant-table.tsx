'use client'

import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";

export default function AntTable({dataSource, columns, style, rowKey, pagination}: {
    dataSource: any,
    columns: ColumnsType,
    style?: any,
    rowKey?: (record: any) => string,
    pagination?: any
}) {

    const screens = useBreakpoint();

    if (pagination == undefined || pagination == null) {
        pagination = { pageSize: 6, showSizeChanger: false, simple: screens.md ? false : {readOnly: true} }
    }
    
    return <Table 
        dataSource={dataSource} 
        columns={columns} 
        pagination={pagination} 
        scroll={{x: true, scrollToFirstRowOnChange: true}}
        style={style} 
        rowKey={rowKey}
    />
}