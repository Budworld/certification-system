import React from "react";
import { Layout } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import UserMenuDropdown from "./UserMenuDropdown";
import useAuthStore from "../stores/useUserStore";
import { useNotification } from "../hooks";
import { AuthService } from "../services";

const { Header } = Layout;

const MainHeader = ({ collapsed, toggleCollapsed, user }) => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const { message } = useNotification();

  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (e) {
      console.error("Logout failed:", e);
      message.error("Lỗi đăng xuất. Vui lòng thử lại");
      return;
    }
    logout();
    message.success("Đăng xuất thành công");
    navigate("/login");
  };

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Thông tin cá nhân",
      onClick: () => navigate("/profile"),
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: handleLogout,
    },
  ];

  return (
    <Header
      style={{
        padding: "0 16px",
        background: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: "trigger",
        onClick: toggleCollapsed,
        style: {
          fontSize: "18px",
          cursor: "pointer",
          transition: "color 0.3s",
        },
      })}

      <UserMenuDropdown
        userMenuItems={userMenuItems}
        collapsed={collapsed}
        user={user}
      />
    </Header>
  );
};

export default MainHeader;