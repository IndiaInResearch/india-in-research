import { Button, Divider, Flex, Space, theme, Typography } from "antd";
import Text from "antd/es/typography/Text";
import { ThemeToggle } from "./theme-context";
import Title from "antd/es/typography/Title";
import Link from "next/link";
import SocialIcons from "./socials";

export default async function Footer() {
    return (
        <>
            <Flex vertical>
                <Divider />
                <Flex justify="space-around" gap={64}>
                    <Flex vertical>
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
                    </Flex>
                    <Flex vertical>
                        <Title level={5}>&nbsp;</Title>
                        <Link href="/terms-of-use">
                            <Button variant="link" color="default" size="small" style={{padding: "0px"}}>Terms of Use</Button>
                        </Link>
                        <Link href="/privacy">
                            <Button variant="link" color="default" size="small" style={{padding: "0px"}}>Privacy Policy</Button>
                        </Link>
                        <Link href="/cookies">
                            <Button variant="link" color="default" size="small" style={{padding: "0px"}}>Cookie Policy</Button>
                        </Link>
                        <Link href="#">
                            <Button className="termly-display-preferences" variant="link" color="default" size="small" style={{padding: "0px"}}>Consent Preferences</Button>
                        </Link>
                        <Text>© 2025 India In Research</Text>
                        <br />
                        <br />
                        <SocialIcons />
                    </Flex>
                </Flex>
                <Divider />
                <Flex justify="space-between" gap={64}>
                    <Text>Note: Some data has been analyzed by AI and may be incorrect.</Text>
                    <ThemeToggle />
                </Flex>
            </Flex>
        </>
    );
}