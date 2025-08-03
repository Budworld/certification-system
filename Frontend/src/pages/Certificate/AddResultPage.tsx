import React, { useState } from 'react';
import {
  Button,
  Card,
  Typography,
  Modal,
  Form,
  Input,
  Upload,
  message,
  Select,
} from 'antd';
import {
  UploadOutlined,
  PlusOutlined,
  FileAddOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import { examResultService } from '../../services/examResult/examResult.service';

const { Title, Paragraph } = Typography;

const AddResultPage: React.FC = () => {
  const [manualVisible, setManualVisible] = useState(false);
  const [csvVisible, setCsvVisible] = useState(false);
  const [form] = Form.useForm();

  const handleManualSubmit = async (values: any) => {
    try {
      await examResultService.importManual({
        candidateNumber: values.candidateNumber,
        examScheduleUID: Number(values.examScheduleUID),
        score: Number(values.score),
        status: values.status,
      });

      message.success('Result added successfully!');
      setManualVisible(false);
      form.resetFields();
    } catch (error) {
      console.error(error);
      message.error('Failed to add result!');
    }
  };

  const handleCsvUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;

    try {
      await examResultService.importCSV(file as File);
      message.success('CSV file uploaded successfully!');
      setCsvVisible(false);
      onSuccess('ok');
    } catch (error) {
      console.error(error);
      message.error('CSV upload failed!');
      onError(error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
      <Card
        style={{ maxWidth: 600, width: '100%', textAlign: 'center', padding: '32px' }}
        bordered
      >
        <Title level={2}>
          <SmileOutlined style={{ marginRight: 8 }} />
          Welcome to Add Exam Result Page
        </Title>
        <Paragraph style={{ marginBottom: 32 }}>
          Please choose one of the options below to add a result:
        </Paragraph>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => setManualVisible(true)}
          >
            Add Result Manually
          </Button>

          <Button
            type="dashed"
            size="large"
            icon={<FileAddOutlined />}
            onClick={() => setCsvVisible(true)}
          >
            Upload via CSV File
          </Button>
        </div>
      </Card>

      {/* Manual Entry Modal */}
      <Modal
        title="Add Result Manually"
        open={manualVisible}
        onCancel={() => setManualVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleManualSubmit}>
          <Form.Item
            name="examScheduleUID"
            label="Exam Schedule ID"
            rules={[{ required: true, message: 'Please enter the exam schedule ID' }]}
          >
            <Input type="number" placeholder="Enter exam schedule ID" />
          </Form.Item>

          <Form.Item
            name="candidateNumber"
            label="Candidate Number"
            rules={[{ required: true, message: 'Please enter the candidate number' }]}
          >
            <Input placeholder="Enter candidate number" />
          </Form.Item>

          <Form.Item
            name="score"
            label="Score"
            rules={[{ required: true, message: 'Please enter the score' }]}
          >
            <Input type="number" placeholder="Enter score" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select placeholder="Select status">
              <Select.Option value="passed">Passed</Select.Option>
              <Select.Option value="failed">Failed</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* CSV Upload Modal */}
      <Modal
        title="Upload CSV File"
        open={csvVisible}
        onCancel={() => setCsvVisible(false)}
        footer={null}
      >
        <Upload
          name="file"
          accept=".csv"
          customRequest={handleCsvUpload}
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>Choose CSV file to upload</Button>
        </Upload>
      </Modal>
    </div>
  );
};

export default AddResultPage;
