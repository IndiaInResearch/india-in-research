import { Flex, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export default function Loading() {
    return (
        <Flex justify="center" align="center" style={{width: "100%", minHeight: 600}}>
            <Spin indicator={<LoadingOutlined spin />} size="large"/>
        </Flex>
    )
}