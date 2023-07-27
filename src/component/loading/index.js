import { Spin } from "antd";

const LoadingComponent = () => {
  return (
    <div
      style={{
        flex: "1 !important",
        marginTop: -72,
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "space-between",
      }}
    >
      <Spin />
    </div>
  );
};

export default LoadingComponent;
