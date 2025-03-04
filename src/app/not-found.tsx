import { Flex } from "antd";
import Title from "antd/es/typography/Title";

export default function NotFound() {
    return (
        <Flex justify="center" align="center" style={{minHeight: "600px"}}>
            <Title level={3}>404. Not Found :(</Title>
        </Flex>
    )
}