import axiosInstance from '../configs/axios.config';

const UserService = {
  getUsers: async (page = 1, pageSize = 10) => {
    const response = await axiosInstance.get('/users', {
      params: {
        page,
        pageSize,
      },
    });
    return response;
  },

  getUserById: async (id) => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response;
  },

  createUser: async (userData) => {
    const response = await axiosInstance.post('/users', userData);
    return response;
  },

  updateUser: async (id, userData) => {
    const response = await axiosInstance.put(`/users/${id}`, userData);
    return response;
  },

  deleteUser: async (id) => {
    const response = await axiosInstance.delete(`/users/${id}`);
    return response;
  },
};

export default UserService;