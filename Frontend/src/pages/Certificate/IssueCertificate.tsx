import React, { useState, useEffect, useRef } from 'react';
import {
  Layout, Typography, Button, Row, Col, Card, Form, Input, Select,
  Table, Pagination, message, Radio, Space, Modal, Tooltip,
} from 'antd';
import type { RadioChangeEvent } from 'antd';
import { AutoComplete } from 'antd'; 
import {
  ClockCircleOutlined,
  PrinterOutlined,
  CheckCircleOutlined,
  FilePdfOutlined,
  InboxOutlined,
  LoadingOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
} from '@ant-design/icons';
import { MailOutlined, FileDoneOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const { Content } = Layout;

interface Certificate {
  certificateUID: number;
  status: string;
  certificateName: string;
  content: string;
  candidateNumber: string;
  examScheduleUID: number;
  score : number;
  candidateName: string;
}

function generateCertificateHTML(cert: Certificate): string {
  const isToeic = cert.certificateName?.toLowerCase().includes('toeic');
  return `
    <div style="
      width: 1123px;
      height: 794px;
      background-image: url('/certificate/certificate.jpg');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      padding: 80px 80px 60px 80px;
      box-sizing: border-box;
      font-family: Georgia, serif;
      position: relative;
      color: #000;
      text-align: center;
    ">
      ${isToeic ? `<img src="/certificate/logo.jpg" style="height: 120px; width: 300px; margin-bottom: 20px;" />` : ''}

      <h1 style="font-size: 42px; font-weight: bold; margin: 0;">CERTIFICATE OF ACHIEVEMENT</h1>

      <p style="margin-top: 30px; font-size: 18px;">This is to certify that</p>

      <h2 style="font-size: 30px; margin: 8px 0; font-weight: bold; color: #003366; font-family: 'Times New Roman', serif;">
        ${cert.candidateName || '[Candidate Name]'}
      </h2>

      <p style="margin-top: 20px; font-size: 17px;">
        has achieved the following scores on the
      </p>

      <p style="font-size: 22px; margin: 12px 0; font-weight: bold; text-transform: uppercase;">
        ${isToeic ? 'Test of English for International Communication' : cert.certificateName || '[Exam Name]'}
      </p>

      <div style="margin-top: 16px; font-size: 18px;">
        <strong>Score:</strong> ${cert.score}
      </div>

      <p style="margin-top: 40px; font-size: 14px;">
        as administered under the auspices of the
      </p>
      <p style="margin: 4px 0; font-size: 15px;"><strong>National Certification Center</strong></p>
      <p style="margin: 4px 0; font-size: 14px;">Hanoi, Vietnam</p>
      <p style="margin: 4px 0 40px 0; font-size: 14px;">Date: ${new Date().toLocaleDateString()}</p>

      <div style="position: absolute; bottom: 130px; right: 80px; text-align: center;">
        <img src="/certificate/signature.jpg" style="width: 120px;" />
        <div style="border-top: 1px solid black; width: 180px; margin: 4px auto 0;"></div>
        <p style="margin: 4px 0 0; font-size: 14px;">Nguyễn Đại Thành</p>
        <small style="font-size: 12px;">Director, Certification Center</small>
      </div>
    </div>
  `;
}

export default function IssueCertificatePage() {
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [currentPage, setCurrentPage] = useState(1);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);
  const [printModalVisible, setPrintModalVisible] = useState(false);
  const [selectedExamScheduleUID, setSelectedExamScheduleUID] = useState<number | null>(null);
  const pageSize = 21;
;
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedExamScheduleForConfirm, setSelectedExamScheduleForConfirm] = useState<number | null>(null);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [selectedExamScheduleForEmail, setSelectedExamScheduleForEmail] = useState<number | null>(null);
  const [certificateModalData, setCertificateModalData] = useState<Certificate | null>(null);
  const [certificateModalMode, setCertificateModalMode] = useState<'view' | 'issue'>('view');
  const [issuing, setIssuing] = useState(false);

  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [sendingList, setSendingList] = useState<Certificate[]>([]);
  const [sendingIndex, setSendingIndex] = useState<number>(-1); 
  const [emailDone, setEmailDone] = useState(false);

  const [candidateOptions, setCandidateOptions] = useState<string[]>([]);


  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/api/certificate');

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const resData = await res.json();
      if (Array.isArray(resData.data)) {
        setCertificates(resData.data);
      } else {
        setCertificates([]);
      }
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
      message.error('Error loading certificates');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processing': return <ClockCircleOutlined style={{ color: '#faad14' }} />;
      case 'printed': return <PrinterOutlined style={{ color: '#1890ff' }} />;
      case 'issued': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'ready for pickup': return <InboxOutlined style={{ color: '#722ed1' }} />;
      default: return null;
    }
  };

  const handleViewModeChange = (e: RadioChangeEvent) => {
    setViewMode(e.target.value);
    setCurrentPage(1);
  };




  const paginatedData = certificates.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );



  const examSchedulesToPrint = Array.from(
    new Set(
      certificates
        .filter(cert => cert.status === 'PROCESSING')
        .map(cert => cert.examScheduleUID)
    )
  );




  const printCertificates = (certs: Certificate[]) => {
    if (!certs.length) {
      message.warning('Không có chứng chỉ nào cần in');
      return;
    }

    console.log(' Danh sách chứng chỉ chuẩn bị in:', certs);

    const htmlContent = certs
      .map(cert => generateCertificateHTML(cert))
      .join('<div style="page-break-after: always;"></div>');

    const printWindow = window.open('', '_blank', 'width=1000,height=700');
    if (!printWindow) {
      message.error('Không thể mở cửa sổ in (có thể bị trình duyệt chặn)');
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Certificates</title>
          <style>
            body { margin: 0; font-family: Georgia, serif; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>${htmlContent}</body>
      </html>
    `);

    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();

    };
  };


  const confirmPrinted = async (certs: Certificate[]) => {
        console.log(' Danh sách chứng chỉ chuẩn bị in:', certs);

    if (!certs.length) {
      message.warning('Không có chứng chỉ nào để cập nhật');
      return;
    }

    try {
      await Promise.all(
        certs.map(cert =>
          fetch(`http://localhost:3000/api/certificate/${cert.certificateUID}/print`, {
            method: 'PUT',
          })
        )
      );
      message.success(' Đã cập nhật trạng thái sau khi in');
      fetchCertificates();
    } catch (err) {
      console.error(err);
      message.error('Lỗi cập nhật trạng thái');
    }
  };


  const sendCertificatesByEmail = async (certs: Certificate[]) => {
    if (!certs.length) {
      message.warning('Không có chứng chỉ nào để gửi Email');
      return;
    }

    setSendingList(certs);
    setSendingIndex(0);
    setEmailModalOpen(true);

    for (let i = 0; i < certs.length; i++) {
      const cert = certs[i];
      setSendingIndex(i);

      const html = generateCertificateHTML(cert);

      const container = document.createElement('div');
      container.style.width = '1123px';
      container.style.height = '794px';

      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '-9999px';


      container.innerHTML = html;
      document.body.appendChild(container); 
      const canvas = await html2canvas(container, {
        scale: 1,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'pt', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgProps = pdf.getImageProperties(imgData);
      const ratio = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height);
      const imgWidth = imgProps.width * ratio;
      const imgHeight = imgProps.height * ratio;

      const x = (pdfWidth - imgWidth) / 2;
      const y = (pdfHeight - imgHeight) / 2;
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);

      const blob = pdf.output('blob');
      const file = new File([blob], `certificate_${cert.candidateNumber}.pdf`, {
        type: 'application/pdf',
      });

      const formData = new FormData();
      formData.append('pdf', file);

      try {
        await fetch(`http://localhost:3000/api/certificate/${cert.certificateUID}/email`, {
          method: 'POST',
          body: formData,
        });

        await fetch(`http://localhost:3000/api/certificate/${cert.certificateUID}/ready`, {
          method: 'PUT',
        });
      } catch (err) {
        console.error(`Lỗi khi gửi chứng chỉ ${cert.certificateUID}`, err);
      } finally {
        // Đảm bảo xóa container khỏi DOM sau khi hoàn tất
        document.body.removeChild(container);
      }
    }

    message.success('Đã gửi Email và cập nhật trạng thái');
    setEmailModalOpen(false);
    setSendingIndex(-1);
    fetchCertificates();
  };


  const issueCertificate = async () => {
    if (!certificateModalData) return;

    setIssuing(true);

    try {
      const res = await fetch(`http://localhost:3000/api/certificate/${certificateModalData.certificateUID}/issue`, {
        method: 'PUT',
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Failed to issue certificate');
      }

      message.success(`🎓 Đã cấp chứng chỉ cho ${certificateModalData.candidateName}`);
      setCertificateModalData(null);
      fetchCertificates();
    } catch (err) {
      console.error(err);
      message.error('❌ Lỗi khi cấp chứng chỉ');
    } finally {
      setIssuing(false);
    }
  };

  
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      const { candidateNumber, examScheduleUID } = values;

      const queryParams = new URLSearchParams({
        query: candidateNumber, // query là candidateNumber
        examScheduleUID: String(examScheduleUID),
      });

      const res = await fetch(`http://localhost:3000/api/certificate/search?${queryParams.toString()}`, {
        method: 'GET',
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      setCertificates(data.data); // cập nhật danh sách bảng
      setCurrentPage(1); // Reset về trang đầu tiên
      message.success('✔️ Tìm kiếm thành công');
      console.log('Kết quả:', data);

      // Nếu bạn muốn cập nhật danh sách certificate
      // setCertificates(data);

    } catch (err) {
      console.error('❌ Lỗi khi tìm:', err);
      message.error('Không tìm thấy kết quả');
    }
  };


  return (
    <Layout style={{ height: '100vh', background: '#fff', overflow: 'hidden' }}>
      <Content style={{ height: '100%' }}>
        <Row gutter={0} style={{ height: '100%', margin: 0 }}>
          <Col xs={24} sm={6} md={5} style={{ height: '100%' }}>
            <div style={{ height: '100%', overflowY: 'auto' }}>
            <Card
                  title={
                    <span>
                      <SearchOutlined style={{ marginRight: 8 }} />
                      Manual Result Import
                    </span>
                  }
                  bordered={false}
                  style={{ borderRadius: 0, marginBottom: 16 }}
                >
                  <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                      label="Exam Schedule ID"
                      name="examScheduleUID"
                      rules={[{ required: true, message: 'Vui lòng nhập mã ca thi' }]}
                    >
                      <Input placeholder="Enter Exam Schedule ID" />
                    </Form.Item>

                    <Form.Item
                      label="Candidate Number"
                      name="candidateNumber"
                      rules={[{ required: true, message: 'Vui lòng nhập mã thí sinh' }]}
                    >
                      <Input placeholder="Enter Candidate Number" />
                    </Form.Item>

                    <Form.Item label="Candidate Name (optional)" name="name">
                      <Input placeholder="Enter Candidate Name (optional)" />
                    </Form.Item>

                    <Form.Item>
                      <Button type="primary" htmlType="submit" block>
                        Submit
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>

            </div>
          </Col>

          <Col xs={24} sm={18} md={19} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: 8 }}>
              <Card
                bordered={false}
                style={{ borderRadius: 0, minHeight: '100%', margin: 0 }}
                title={
                  <Space style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography.Title level={5} style={{ margin: 0 }}>📋 Certificate List</Typography.Title>
                    <Space>
                      <Button icon={<PrinterOutlined />} onClick={() => setPrintModalVisible(true)}>
                        In chứng chỉ
                      </Button>

                      <Button
                        type="primary"
                        icon={<FileDoneOutlined />}
                        onClick={() => {
                          setSelectedExamScheduleForConfirm(null);
                          setConfirmModalVisible(true);
                        }}
                      >
                        Đã in xong
                      </Button>


                      <Button
                        icon={<MailOutlined />}
                        onClick={() => {
                          setSelectedExamScheduleForEmail(null);
                          setEmailModalVisible(true);
                        }}
                      >
                        Gửi Email
                      </Button>


                      <Radio.Group value={viewMode} onChange={handleViewModeChange} optionType="button">
                        <Radio.Button value="card">Card</Radio.Button>
                        <Radio.Button value="list">Table</Radio.Button>
                      </Radio.Group>
                    </Space>
                  </Space>
                }
              >
                {viewMode === 'card' ? (
                  <Row gutter={[16, 16]}>
                    {paginatedData.map((item) => (
                      <Col xs={24} sm={12} md={8} key={item.certificateUID}>
                        <Card hoverable loading={loading}>
                          <p><strong>Exam Schedule ID:</strong> {item.examScheduleUID}</p>
                          <p><strong>Candidate Number:</strong> {item.candidateNumber}</p>
                          <p><strong>Type:</strong> {item.certificateName}</p>
                          <p><strong>Score:</strong> {item.score !== undefined ? item.score : 'N/A'}</p>
                          <p><strong>Status:</strong> {getStatusIcon(item.status)} {item.status}</p>
                          <p><strong>Content:</strong> {item.content || 'No notes'}</p>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <Table
                    loading={loading}
                    dataSource={paginatedData}
                    columns={[
                      { title: 'Exam Schedule ID', dataIndex: 'examScheduleUID', key: 'exam' },
                      { title: 'Candidate Number', dataIndex: 'candidateNumber', key: 'candidate' },
                      { title: 'Type', dataIndex: 'certificateName', key: 'type' },
                      // {
                      //   title: 'Score',
                      //   dataIndex: 'score',
                      //   key: 'score',
                      //   render: (text: number) => text !== undefined ? text : 'N/A',
                      // },
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
                        render: (text) => <>{getStatusIcon(text)} {text}</>
                      },
                      {
                        title: 'Action',
                        key: 'action',
                        render: (_: any, record: Certificate) => {
                          return (
                            <Space>
                              {record.status === 'PROCESSING' && (
                                <Tooltip title="In chứng chỉ">
                                  <Button
                                    icon={<PrinterOutlined />}
                                    type="primary"
                                    size="small"
                                    onClick={() => printCertificates([record])}
                                  />
                                </Tooltip>
                              )}

                              {record.status === 'PRINTED' && (
                                <>
                                  <Tooltip title="Xem chứng chỉ">
                                    <Button
                                      icon={<EyeOutlined />}
                                      size="small"
                                      onClick={() => {
                                        setCertificateModalData(record);
                                        setCertificateModalMode('view');
                                      }}

                                    />
                                  </Tooltip>
                                  <Tooltip title="Gửi Email">
                                    <Button
                                      icon={<MailOutlined />}
                                      type="dashed"
                                      size="small"
                                      onClick={() => sendCertificatesByEmail([record])}
                                    />
                                  </Tooltip>
                                </>
                              )}

                              {record.status === 'READY FOR PICKUP' && (
                                <>
                                  <Tooltip title="Gửi Email">
                                    <Button
                                      icon={<MailOutlined />}
                                      type="dashed"
                                      size="small"
                                      onClick={() => sendCertificatesByEmail([record])}
                                    />
                                  </Tooltip>
                                  <Tooltip title="Cấp chứng chỉ">
                                    <Button
                                      icon={<CheckCircleOutlined />}
                                      type="primary"
                                      danger
                                      size="small"
                                      onClick={() => {
                                        setCertificateModalData(record);
                                        setCertificateModalMode('issue');
                                      }}

                                    />
                                  </Tooltip>

                                </>
                              )}
                              {record.status === 'ISSUED' && (
                                <Tooltip title="Xem chứng chỉ">
                                  <Button
                                    icon={<EyeOutlined />}
                                    size="small"
                                    onClick={() => {
                                      setCertificateModalData(record);
                                      setCertificateModalMode('view');
                                    }}

                                  />
                                </Tooltip>
                              )}
                            </Space>
                          );
                        },
                      }
                    ]}
                    rowKey="certificateUID"
                    pagination={false}
                  />
                )}
              </Card>
            </div>
            <div style={{ padding: '12px 16px', borderTop: '1px solid #f0f0f0', background: '#fff' }}>
              <Row justify="end">
                <Col>
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={certificates.length}
                    onChange={(page) => setCurrentPage(page)}
                  />
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        <Modal
          title="Gửi chứng chỉ qua Email"
          open={emailModalVisible}
          onCancel={() => setEmailModalVisible(false)}
          onOk={() => {
            const list = certificates.filter(c =>
              c.examScheduleUID === selectedExamScheduleForEmail &&
              (c.status === 'PRINTED' || c.status === 'READY FOR PICKUP')
            );
            sendCertificatesByEmail(list);
            setEmailModalVisible(false);
          }}
          okText="Gửi"
          cancelText="Hủy"
        >
          <Form layout="vertical">
            <Form.Item label="Chọn kỳ thi đã in">
              <Select
                value={selectedExamScheduleForEmail}
                onChange={(value) => setSelectedExamScheduleForEmail(value)}
                placeholder="Chọn Exam Schedule"
              >
                {[...new Set(
                  certificates
                    .filter(c => ['PRINTED', 'READY FOR PICKUP'].includes(c.status))
                    .map(c => c.examScheduleUID)
                )]
                  .map(id => (
                    <Select.Option key={id} value={id}>
                      Kỳ thi #{id}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        
        <Modal
          open={printModalVisible}
          title="Chọn đợt thi để in chứng chỉ"
          onCancel={() => setPrintModalVisible(false)}
          footer={null}
        >
          {examSchedulesToPrint.length === 0 ? (
            <p>Không có đợt thi nào có chứng chỉ đang chờ in.</p>
          ) : (
            <Form
              layout="vertical"
              onFinish={({ selectedUID }) => {
                const list = certificates.filter(
                  c => c.examScheduleUID === selectedUID && c.status === 'PROCESSING'
                );
                setPrintModalVisible(false);
                printCertificates(list);
              }}
            >
              <Form.Item
                label="Chọn đợt thi"
                name="selectedUID"
                rules={[{ required: true, message: 'Vui lòng chọn đợt thi' }]}
              >
                <Select placeholder="Chọn examScheduleUID">
                  {examSchedulesToPrint.map(uid => (
                    <Select.Option key={uid} value={uid}>
                      Đợt thi #{uid}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<PrinterOutlined />}>
                  In chứng chỉ
                </Button>
              </Form.Item>
            </Form>
          )}
        </Modal>

        <Modal
          title="Xác nhận đã in"
          open={confirmModalVisible}
          onCancel={() => setConfirmModalVisible(false)}
          onOk={() => {
            const list = certificates.filter(c => c.examScheduleUID === selectedExamScheduleForConfirm && c.status === 'PROCESSING');
            confirmPrinted(list);
            setConfirmModalVisible(false);
          }}
          okText="Xác nhận"
          cancelText="Hủy"
        >
          <Form layout="vertical">
            <Form.Item label="Chọn kỳ thi chưa in">
              <Select
                value={selectedExamScheduleForConfirm}
                onChange={(value) => setSelectedExamScheduleForConfirm(value)}
                placeholder="Chọn Exam Schedule"
              >
                {[...new Set(certificates.filter(c => c.status === 'PROCESSING').map(c => c.examScheduleUID))]
                  .map(id => <Select.Option key={id} value={id}>Kỳ thi #{id}</Select.Option>)}
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          open={!!certificateModalData}
          onCancel={() => setCertificateModalData(null)}
          onOk={certificateModalMode === 'issue' ? issueCertificate : undefined}
          okText={certificateModalMode === 'issue' ? 'Xác nhận cấp' : undefined}
          confirmLoading={certificateModalMode === 'issue' ? issuing : false}
          footer={certificateModalMode === 'view' ? null : undefined}
          width="100%"
          style={{ top: 0 }}
          bodyStyle={{
            padding: 24,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <div
            style={{
              width: 'fit-content',
              margin: '0 auto',
              background: 'white',
              padding: 24,
            }}
            dangerouslySetInnerHTML={{
              __html: certificateModalData ? generateCertificateHTML(certificateModalData) : '',
            }}
          />
        </Modal>

        <Modal
          open={emailModalOpen}
          onCancel={() => {
            setEmailModalOpen(false);
            setEmailDone(false);
            setSendingList([]); // Reset danh sách nếu cần
            setSendingIndex(0); // Reset chỉ số
          }}
          footer={
            emailDone ? (
              <Button
                type="primary"
                onClick={() => {
                  setEmailModalOpen(false);
                  setEmailDone(false);
                  setSendingList([]);
                  setSendingIndex(0);
                }}
              >
                Đóng
              </Button>
            ) : null
          }
          centered
          title={emailDone ? 'Gửi thành công' : 'Đang gửi Email cho chứng chỉ...'}
        >
          {emailDone ? (
            <div style={{ textAlign: 'center', padding: 24 }}>
              <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 48 }} />
              <div style={{ marginTop: 16, fontSize: 16 }}>Đã gửi tất cả chứng chỉ thành công!</div>
            </div>
          ) : (
            <ul style={{ paddingLeft: 20 }}>
              {sendingList.map((cert, index) => (
                <li
                  key={cert.certificateUID}
                  style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  {index === sendingIndex ? (
                    <>
                      <LoadingOutlined spin />
                      <strong>Đang gửi cho {cert.candidateNumber}...</strong>
                    </>
                  ) : (
                    <>
                      {/* Icon hiển thị cho các mục đã gửi xong TỪNG CÁI một */}
                      {index < sendingIndex ? ( // Nếu chỉ mục nhỏ hơn chỉ mục đang gửi (tức là đã xong)
                        <CheckCircleTwoTone twoToneColor="#52c41a" />
                      ) : ( // Nếu chỉ mục lớn hơn chỉ mục đang gửi (tức là chờ)
                        <ClockCircleOutlined style={{ color: '#d9d9d9' }} /> // Màu xám nhạt cho trạng thái chờ
                      )}
                      <span>Đã gửi cho {cert.candidateNumber}</span>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Modal>





      </Content>
    </Layout>
  );
}
