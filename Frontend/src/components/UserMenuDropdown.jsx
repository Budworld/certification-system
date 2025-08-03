import React from "react";
import { Dropdown, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

const UserMenuDropdown = ({ userMenuItems, collapsed, user }) => (
  <Dropdown
    menu={{ items: userMenuItems }}
    placement="bottomRight"
  >
    <div
      style={{
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Avatar icon={<UserOutlined />} />
      {!collapsed && (
        <span style={{ marginLeft: 8 }}>{user?.name || "User"}</span>
      )}
    </div>
  </Dropdown>
);

export default UserMenuDropdown; 