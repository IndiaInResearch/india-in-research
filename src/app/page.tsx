import { Button, Flex, Space } from "antd";
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
import Link from "next/link";
import { getData } from "@/utils/data-handlers";
import IndiaGeoMap from "@/components/india-geo-map";

export default async function Home() {

  const neuripsData = await getData('cs', ['neurips'], 2024);
  const institute_to_papers_with_latlon = neuripsData?.indian_institute_to_papers_with_latlon_for_graph;

  return (
    <>
      <Flex justify="space-evenly" align="center" wrap gap={64} style={{minHeight: 600}}>
        <Flex vertical>
          <Title level={1} style={{marginBottom: 0}}>Covering Indian Research.</Title>
          <Title level={1} style={{marginTop: 4}}>Stats and Stories.</Title>
          <Text>We collect, extract and illustrate insights from papers <br />published by Indian Institutes.</Text>
          <Space style={{marginTop: 16}}>
            <Link href="/explore/cs/ai">
              <Button type="primary" size="large">Explore</Button>
            </Link>
            <Link href="/philosophy">
              <Button size="large">Know More</Button>
            </Link>
          </Space>
        </Flex>
        <Flex vertical style={{width: "max(60%, 400px)"}} align="center">
          <IndiaGeoMap width="100%" height="min(800px, 80vw)" data={institute_to_papers_with_latlon || []} />
          <Text>Papers from Indian Institutes in NeurIPS 2024. IIT Delhi and Bombay lead at 3 papers each.
          <Link href="explore/cs/ai/ml/neurips">
              <Text italic>&nbsp;View more...</Text>
          </Link>
          </Text>
          
        </Flex>
      </Flex>
    </>
  );
}
