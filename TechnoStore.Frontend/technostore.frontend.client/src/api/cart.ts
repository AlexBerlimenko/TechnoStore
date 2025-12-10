import { api } from "./http";

export const getCart = async () => {
  const response = await api.get("/cart");
  return response.data;
};

export const addToCart = async (productId: number, quantity: number = 1) => {
  const response = await api.post(`/cart/add?productId=${productId}&quantity=${quantity}`);
  return response.data;
};

export const updateCart = async (itemId: number, quantity: number) => {
  const response = await api.put(`/cart/update?itemId=${itemId}&quantity=${quantity}`);
  return response.data;
};

export const removeCartItem = async (itemId: number) => {
  const response = await api.delete(`/cart/remove?itemId=${itemId}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await api.delete("/cart/clear");
  return response.data;
};
