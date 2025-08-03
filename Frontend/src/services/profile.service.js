import axiosInstance from '../configs/axios.config';

const ProfileService = {
  getProfile: async () => {
    const response = await axiosInstance.get('/profile');
    return response;
  },

  updateProfile: async (profileData) => {
    const response = await axiosInstance.put('/profile', profileData);
    return response;
  },

  changePassword: async (passwordData) => {
    const response = await axiosInstance.put('/profile/change-password', passwordData);
    return response;
  },
};

export default ProfileService; 