import { Button, Divider, theme, Typography } from "antd";
import Text from "antd/es/typography/Text";
import { ThemeToggle } from "./theme-context";

export default async function Footer() {
    return (
        <>
            <div style={{ height: "256px", display: 'flex', flexDirection: 'column'}}>
                <Divider />
                <div style={{display: 'flex', justifyContent: 'space-around'}}>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <Text>About</Text>
                        <Text>Philosophy</Text>
                        <Text>Board</Text>
                        <Text>Acknowledgements</Text>
                        <Text>© 2025 IIR.org</Text>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <Text>Terms of Service</Text>
                        <Text>Privacy Policy</Text>
                        <Text>Cookie Policy</Text>
                        <Text>© 2025 IIR.org</Text>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <Text>Terms of Service</Text>
                        <Text>Privacy Policy</Text>
                        <Text>Cookie Policy</Text>
                        <Text>© 2025 IIR.org</Text>
                    </div>
                </div>
                <Text>Note: Some data has been analysed by AI and may be incorrect.</Text>
                <Button type="primary">Contact Us</Button>
            </div>
            <ThemeToggle />
            <Button>Contact Us</Button>
        </>
    );
}