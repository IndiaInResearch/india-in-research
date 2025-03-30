import { Button, Divider, Flex, Space, theme, Typography } from "antd";
import Text from "antd/es/typography/Text";
import { ThemeToggle } from "./theme-context";
import Title from "antd/es/typography/Title";
import Link from "next/link";
import SocialIcons from "./socials";

export default async function Footer() {
    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column'}}>
                <Divider />
                <div style={{display: 'flex', justifyContent: 'space-around'}}>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <Title level={5}>About</Title>
                        <Link href="/philosophy">
                            <Button variant="link" color="default" size="small" style={{padding: "0px"}}>Philosophy</Button>
                        </Link>
                        <Link href="/acknowledgements">
                            <Button variant="link" color="default" size="small" style={{padding: "0px"}}>Acknowledgements</Button>
                        </Link>
                        <Link href="/contact">
                            <Button variant="link" color="default" size="small" style={{padding: "0px"}}>Contact</Button>
                        </Link>
                        <Text>Board</Text>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <Title level={5}>&nbsp;</Title>
                        <Text>Terms of Service</Text>
                        <Text>Privacy Policy</Text>
                        <Text>Cookie Policy</Text>
                        <Text>© 2025 India In Research</Text>
                        <br />
                        <br />
                        <SocialIcons />
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