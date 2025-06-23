import React, { useEffect, useState } from "react";
import { Modal, Form, Input, InputNumber, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Product } from "../../constants/interfaces";
import "./Modals.css";

interface CreateProductModalProps {
  visible: boolean;
  onSubmit: (values: Partial<Product>, file: File) => void;
  onCancel: () => void;
}

const CreateProductModal: React.FC<CreateProductModalProps> = ({
  visible,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    if (!visible) {
      form.resetFields();
      setFileList([]);
    }
  }, [visible, form]);

  const handleUploadChange = ({ fileList }: any) => {
    setFileList(fileList.slice(-1)); // Keep only the latest file
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return Upload.LIST_IGNORE;
    }
    return false; 
  };

  const handleSubmit = (values: Partial<Product>) => {
    const file = fileList[0]?.originFileObj as File;
    if (!file) {
      message.error("Please upload an image");
      return;
    }
    onSubmit(values, file);
  };

  return (
    <Modal
      title="Create Product"
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={600}
      aria-label="Create Product Modal"
      className="product-modal"
      footer={
        <>
          <Button key="cancel" onClick={onCancel}>
            Cancel
          </Button>
          <Button className="btn" onClick={() => form.submit()}>
            Create Product
          </Button>
        </>
      }
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter product name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="image"
          label="Image"
          rules={[{ required: true, message: "Please upload an image" }]}
          valuePropName="fileList"
          getValueFromEvent={(e) => e?.fileList}
        >
          <Upload
            listType="picture"
            fileList={fileList}
            onChange={handleUploadChange}
            beforeUpload={beforeUpload}
            accept="image/*"
            maxCount={1}
            showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
          >
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: "Please enter price" }]}
        >
          <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="stock"
          label="Stock"
          rules={[{ required: true, message: "Please enter stock" }]}
        >
          <InputNumber min={0} step={1} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateProductModal;
