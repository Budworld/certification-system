import { Button, Space, Tooltip } from 'antd';
import {
  PrinterOutlined,
  EyeOutlined,
  MailOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { Certificate } from './types'; // nếu có

export const getColumns = ({
  onPrint,
  onView,
  onSendEmail,
  onIssue,
}: {
  onPrint: (cert: Certificate) => void;
  onView: (cert: Certificate) => void;
  onSendEmail: (cert: Certificate) => void;
  onIssue: (cert: Certificate) => void;
}) => [
  { title: 'Exam Schedule ID', dataIndex: 'examScheduleUID', key: 'exam' },
  { title: 'Candidate Number', dataIndex: 'candidateNumber', key: 'candidate' },
  { title: 'Type', dataIndex: 'certificateName', key: 'type' },
  {
    title: 'Content',
    dataIndex: 'content',
    key: 'content',
    render: (text: string | null) => text || 'No notes',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (text) => <>{text}</>, // hoặc dùng icon như trước
  },
  {
    title: 'Action',
    key: 'action',
    render: (_: any, record: Certificate) => {
      const actions = [];

      if (record.status === 'PROCESSING') {
        actions.push(
          <Tooltip title="In chứng chỉ" key="print">
            <Button
              icon={<PrinterOutlined />}
              size="small"
              onClick={() => onPrint(record)}
            />
          </Tooltip>
        );
      }

      if (record.status === 'PRINTED') {
        actions.push(
          <Tooltip title="Xem chứng chỉ" key="view">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => onView(record)}
            />
          </Tooltip>,
          <Tooltip title="Gửi Email" key="email">
            <Button
              icon={<MailOutlined />}
              size="small"
              onClick={() => onSendEmail(record)}
            />
          </Tooltip>
        );
      }

      if (record.status === 'READY FOR PICKUP') {
        actions.push(
          <Tooltip title="Gửi Email" key="email">
            <Button
              icon={<MailOutlined />}
              size="small"
              onClick={() => onSendEmail(record)}
            />
          </Tooltip>,
          <Tooltip title="Cấp chứng chỉ" key="issue">
            <Button
              icon={<CheckCircleOutlined />}
              size="small"
              onClick={() => onIssue(record)}
            />
          </Tooltip>
        );
      }

      return <Space>{actions}</Space>;
    },
  },
];
