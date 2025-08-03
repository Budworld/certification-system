import { DingdingOutlined } from "@ant-design/icons";

const SiderBrand = ({ collapsed }) => {
  return (
    <div
      style={{
        height: 48,
        margin: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "flex-start",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))",
        borderRadius: 10,
        padding: "0 12px",
        fontWeight: 600,
        fontSize: 18,
        color: "#fff",
        letterSpacing: 1,
        transition: "all 0.3s ease",
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        gap: collapsed ? 0 : 8,
      }}
    >
      <DingdingOutlined style={{ fontSize: 24 }} />
      {!collapsed && <span style={{ whiteSpace: "nowrap" }}>ACCI</span>}
    </div>
  );
};

export default SiderBrand;