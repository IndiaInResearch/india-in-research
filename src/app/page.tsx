import { Button, Flex, Space } from "antd";
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
import Link from "next/link";

export default async function Home() {

  return (
    <>
      <Flex vertical style={{minHeight: 600}} justify="center">
        <Flex justify="space-around">
          <Flex vertical>
            <Title level={1}>Measuring Impact of Indian Papers</Title>
            <Text>IIR is a platform for measuring the impact of Indian papers.</Text>
            <Space style={{marginTop: 16}}>
              <Link href="/explore/cs/neurips">
                <Button type="primary" size="large">Explore</Button>
              </Link>
              <Button size="large">Know More</Button>
            </Space>
          </Flex>
          
          <Text>Impressive Graph</Text>
        </Flex>
      </Flex>
    </>
  );
}
