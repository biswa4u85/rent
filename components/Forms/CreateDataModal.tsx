import { Modal } from "antd";
import { usePost } from "@/contexts/usePost";
import { toast } from 'react-toastify';
export const CreateDataModal = ({ resource, close, FormData, data }: any) => {
    const { create, data: respond, loading } = usePost();
    const handleUpdate = (body: any) => {
        create(resource, body)
    }
    if (respond) {
        toast.success(`New ${resource} add successfully`);
        close()
    }
    return (
        <Modal
            open={true}
            onCancel={() => close()}
            footer={null}
        >
            <h1 className="text-sm">{`Add New ${resource}`}</h1>
            <FormData initialValues={data} handleUpdate={handleUpdate} loading={loading} />
        </Modal>
    );
};