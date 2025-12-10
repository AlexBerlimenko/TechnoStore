import { api } from "./http";

export const getAllProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

export const getProductById = async (id: number) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};
