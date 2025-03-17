import { Flex, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export default function LoadingComp() {
    return (
        <Flex justify="center" align="center" style={{width: "100%", minHeight: 600}}>
            <Spin indicator={<LoadingOutlined spin />} size="large"/>
        </Flex>
    )
}