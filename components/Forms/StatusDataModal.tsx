import { Modal, Row, Col, Button } from "antd";
import { usePatch } from "@/contexts/usePatch";
import { toast } from 'react-toastify';
export const StatusDataModal = ({ resource, close, data }: any) => {
    const { edit, data: respond, loading } = usePatch();
    const handleUpdate = (body: any) => {
        edit(resource, { ...body, status: (data.status == "active" ? "inactive" : "active") })
    }
    if (respond) {
        toast.success(`Status update successfully`);
        close()
    }
    return (
        <Modal
            open={true}
            onCancel={() => close()}
            footer={null}
        >
            <h1 className="pb-2 text-sm">{`Are you sure you want to ${data.status == "active" ? "inactive" : "active"} this?`}</h1>
            <Row gutter={20}>
                <Col>
                    <Button onClick={() => close(null)} size="large">
                        Cancel
                    </Button>
                </Col>
                <Col>
                    <Button
                        loading={loading}
                        onClick={() => handleUpdate(data)}
                        size="large"
                        type="primary"
                        danger
                    >
                        {data.status == "active" ? "INACTIVE" : "ACTIVE"}
                    </Button>
                </Col>
            </Row>
        </Modal>
    );
};