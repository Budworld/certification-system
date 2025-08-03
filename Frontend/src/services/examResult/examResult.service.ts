import axios from 'axios';

const API_BASE = 'http://localhost:3000/api/exam-result';

export const examResultService = {
  async importManual(data: {
    candidateNumber: string;
    examScheduleUID: number;
    score: number;
    status: string;
  }) {
    console.log('[IMPORT MANUAL] Dữ liệu gửi đi:', data); // 👈 In ra màn hình

    try {
      const response = await axios.post(`${API_BASE}/manual`, data);
      console.log('[IMPORT MANUAL] Phản hồi server:', response.data); // 👈 In kết quả trả về
      return response;
    } catch (error) {
      console.error('[IMPORT MANUAL] Lỗi:', error);
      throw error;
    }
  },

  async importCSV(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    console.log('[IMPORT CSV] File upload:', file.name); // 👈 In tên file

    try {
      const response = await axios.post(`${API_BASE}/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('[IMPORT CSV] Phản hồi server:', response.data); // 👈 In kết quả trả về
      return response;
    } catch (error) {
      console.error('[IMPORT CSV] Lỗi:', error);
      throw error;
    }
  },
};
