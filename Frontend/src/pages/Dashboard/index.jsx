import React from 'react';
import { Typography, Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, ShoppingCartOutlined, DollarOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Dashboard = () => {
  return (
    <div>
      <Title level={2}>Dashboard</Title>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Tổng số người dùng"
              value={1128}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Đơn hàng hôm nay"
              value={93}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Doanh thu tháng"
              value={284000000}
              prefix={<DollarOutlined />}
              suffix="VND"
            />
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card title="Thông báo mới">
            <p>Chào mừng bạn đến với hệ thống quản lý. Đây là trang Dashboard mẫu.</p>
            <p>Bạn có thể thêm các thông tin quan trọng ở đây.</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 