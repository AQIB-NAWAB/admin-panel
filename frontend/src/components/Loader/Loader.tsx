import { Spin } from "antd";

function Loader() {
  return (
    <div style={{ textAlign: "center", marginTop: "20%",minHeight: "60vh" }}>
      <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
    </div>
  );
}

export default Loader;
