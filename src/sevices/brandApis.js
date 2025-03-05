import { axiosInstance } from "../axios/axiosInstance";
export const getAllBrands = async () => {
  try {
    const response = await axiosInstance.get("/brand");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchBrand = async (query) => {
  try {
    const response = await axiosInstance.get(`/brand/search?q=${query}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addBrand = async (brandData) => {
  try {
    const response = await axiosInstance.post("/brand", brandData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editBrand = async (brandId, brandData) => {
  try {
    const response = await axiosInstance.patch(`/brand/${brandId}`, brandData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
