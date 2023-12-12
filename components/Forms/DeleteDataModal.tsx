import { Modal, Row, Col, Button } from "antd";
import { useDelete } from "@/contexts/useDelete";
import { toast } from 'react-toastify';
export const DeleteDataModal = ({ resource, close, data }: any) => {
    const { remove, data: respond, loading } = useDelete();
    const handleUpdate = (body: any) => {
        remove(resource, { id: body?.id })
    }
    if (respond) {
        toast.success(`${resource} remove successfully`);
        close()
    }
    return (
        <Modal
            open={true}
            onCancel={() => close()}
            footer={null}
        >
            <h1 className="pb-2 text-sm">Are you sure you want to delete this?</h1>
            <p className="pb-2">This action cannot be undone. This will be deleted forever.</p>
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
                        Delete
                    </Button>
                </Col>
            </Row>
        </Modal>
    );
};