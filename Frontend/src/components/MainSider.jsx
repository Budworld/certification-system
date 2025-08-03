import {
  DashboardOutlined,
  SettingOutlined,
  UserOutlined,
  CreditCardOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import SiderBrand from "./SideBrand"
const { Sider } = Layout;

const MainSider = ({ collapsed, location }) => {
  const navigate = useNavigate();
  const menuItems = [
    {
      key: "/registrations",
      icon: <FormOutlined />,
      label: "Đăng ký thi",
      onClick: () => navigate("/registrations"),
    },
    {
      key: "/payments",
      icon: <CreditCardOutlined />,
      label: "Thanh toán",
      onClick: () => navigate("/payments"),
    },
    {
      key: "/users",
      icon: <UserOutlined />,
      label: "Người dùng",
      onClick: () => navigate("/users"),
    },
  ];

  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <SiderBrand collapsed={collapsed} />
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
      />
    </Sider>
  );
};

export default MainSider;