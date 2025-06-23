import React, { useEffect, useState } from "react";
import { Modal, Form, Input, InputNumber, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Product } from "../../constants/interfaces";
import "./Modals.css";

interface EditProductModalProps {
  visible: boolean;
  product: Product | null;
  onFormSubmit: (values: Partial<Product>) => void;
  onImageSubmit: (file: File) => void;
  onCancel: () => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  visible,
  product,
  onFormSubmit,
  onImageSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [file, setFile] = useState<File | null>(null);
  const [formChanged, setFormChanged] = useState(false);

  useEffect(() => {
    if (visible && product) {
      form.setFieldsValue(product);
      setFile(null);
      setFormChanged(false);
    } else {
      form.resetFields();
      setFile(null);
      setFormChanged(false);
    }
  }, [visible, product, form]);

  const handleUploadChange = (info: any) => {
    const newFile = info.file as File;
    if (newFile) {
      setFile(newFile);
      // Immediately submit the new image
      onImageSubmit(newFile);
      // Close the modal after image submission
      onCancel();
    }
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return Upload.LIST_IGNORE;
    }
    return false; // Prevent automatic upload
  };

  const handleFormChange = () => {
    setFormChanged(true);
    if (file) {
      setFile(null); // Clear any selected image if form changes
    }
  };

  const handleFormSubmit = (values: Partial<Product>) => {
    if (!product?.image && !file) {
      message.error("An image is required.");
      return;
    }
    onFormSubmit(values);
  };

  // Generate fileList for Upload component to display preview
  const fileList = file
    ? [
        {
          uid: "-1",
          name: file.name,
          status: "done",
          url: URL.createObjectURL(file),
        },
      ]
    : product?.image
    ? [
        {
          uid: "-1",
          name: "current-image",
          status: "done",
          url: product.image,
        },
      ]
    : [];

  return (
    <Modal
      title="Edit Product"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="form"
          onClick={() => form.submit()}
          disabled={file !== null}
          className="btn"
        >
          Update Product
        </Button>,
      ]}
      width={600}
      aria-label="Edit Product Modal"
      className="product-modal"
    >
      <Form
        form={form}
        onFinish={handleFormSubmit}
        layout="vertical"
        onValuesChange={handleFormChange}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter product name" }]}
        >
          <Input disabled={file !== null} />
        </Form.Item>
        <Form.Item
          name="image"
          label="Image"
          rules={[{ required: true, message: "Please upload an image" }]}
          validateStatus={file || product?.image ? "success" : "error"}
          help={file || product?.image ? undefined : "Please upload an image"}
        >
          <Upload
            listType="picture"
            fileList={fileList}
            onChange={handleUploadChange}
            beforeUpload={beforeUpload}
            accept="image/*"
            maxCount={1}
            showUploadList={{ showPreviewIcon: true, showRemoveIcon: false }}
            disabled={formChanged}
          >
            <Button icon={<UploadOutlined />} disabled={formChanged}>
              Replace Image
            </Button>
          </Upload>
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <Input.TextArea rows={4} disabled={file !== null} />
        </Form.Item>
        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: "Please enter price" }]}
        >
          <InputNumber
            min={0}
            step={0.01}
            style={{ width: "100%" }}
            disabled={file !== null}
          />
        </Form.Item>
        <Form.Item
          name="stock"
          label="Stock"
          rules={[{ required: true, message: "Please enter stock" }]}
        >
          <InputNumber
            min={0}
            step={1}
            style={{ width: "100%" }}
            disabled={file !== null}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProductModal;
