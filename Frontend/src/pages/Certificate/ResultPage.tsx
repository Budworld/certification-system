import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface ExamResult {
  examResultUID: number;
  status: string;
  content: string;
  score: number;
  registrationDetailFID: number;
}

const ResultPage: React.FC = () => {
  const [data, setData] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/exam-result')
      .then((res) => res.json())
      .then((resData) => {
        if (Array.isArray(resData.data)) {
          setData(resData.data);
        } else {
          console.warn('Kết quả không đúng định dạng:', resData);
          setData([]);
        }
      })
      .catch((err) => {
        console.error('Lỗi khi gọi API:', err);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const columns: ColumnsType<ExamResult> = [
    {
      title: 'ID',
      dataIndex: 'examResultUID',
      key: 'examResultUID',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: 'Điểm',
      dataIndex: 'score',
      key: 'score',
    },
    {
      title: 'Mã chi tiết đăng ký',
      dataIndex: 'registrationDetailFID',
      key: 'registrationDetailFID',
    },
  ];

  return (
    <div>
      <h1>Kết quả thi</h1>
      <Table
        dataSource={data}
        columns={columns}
        loading={loading}
        rowKey="examResultUID"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default ResultPage;
