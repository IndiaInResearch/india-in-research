import { Button, Divider, Flex, theme, Typography } from "antd";
import Text from "antd/es/typography/Text";
import { ThemeToggle } from "./theme-context";
import Title from "antd/es/typography/Title";

export default async function Footer() {
    return (
        <>
            <div style={{ height: "256px", display: 'flex', flexDirection: 'column'}}>
                <Divider />
                <div style={{display: 'flex', justifyContent: 'space-around'}}>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <Title level={5}>About</Title>
                        <Text>Philosophy</Text>
                        <Text>Board</Text>
                        <Text>Acknowledgements</Text>
                        <Text>Contact</Text>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <Text>© 2025 IIR.org</Text>
                        <Text>Terms of Service</Text>
                        <Text>Privacy Policy</Text>
                        <Text>Cookie Policy</Text>
                    </div>
                </div>
                <Divider />
                <Flex justify="space-between">
                    <Text>Note: Some data has been analyzed by AI and may be incorrect.</Text>
                    <ThemeToggle />
                </Flex>
            </div>
        </>
    );
}