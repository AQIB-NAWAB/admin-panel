import React from "react";
import { Modal, Image, Typography } from "antd";
import { Product } from "../../constants/interfaces";

const { Text } = Typography;

interface ViewProductModalProps {
  visible: boolean;
  product: Product | null;
  onCancel: () => void;
}

const ViewProductModal: React.FC<ViewProductModalProps> = ({
  visible,
  product,
  onCancel,
}) => {
  if (!product) {
    return null;
  }
  return (
    <Modal
      title="Product Details"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      aria-label="Product Details Modal"
    >
      {product && (
        <div className="modal-content">
          <Image
            src={product.image}
            alt={product.name}
            width={150}
            height={150}
            style={{ borderRadius: 8, marginBottom: 16 }}
          />
          <br />
          <br />

          <Text strong>Name:</Text>
          <Text> {product.name}</Text>
          <br />
          <Text strong>Description:</Text>
          <Text> {product.description || "N/A"}</Text>
          <br />
          <Text strong>Price:</Text>
          <Text> ${product.price}</Text>
          <br />
          <Text strong>Stock:</Text>
          <Text> {product.stock}</Text>
          <br />
          <Text strong>Created At:</Text>
          <Text> {new Date(product.createdAt).toLocaleString()}</Text>
          <br />
          <Text strong>Updated At:</Text>
          <Text> {new Date(product.updatedAt).toLocaleString()}</Text>
        </div>
      )}
    </Modal>
  );
};

export default ViewProductModal;
