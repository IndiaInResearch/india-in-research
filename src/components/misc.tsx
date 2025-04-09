import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";

export function ReportIssueButton() {
    return (
        <>
            <Tooltip title="Report an issue">
                <Button type="text" size="large" shape="circle" icon={<ExclamationCircleOutlined />} href="mailto:report@indiainresearch.org" />
            </Tooltip>
        </>
    )
}