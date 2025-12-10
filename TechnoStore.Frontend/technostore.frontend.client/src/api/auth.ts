import { api } from "./http";

export async function login(email: string, password: string) {
  const res = await api.post("/auth/login", { email, password });
  return res.data; // { token: "...", user: {...} }
}

export async function register(data: any) {
  const res = await api.post("/auth/register", data);
  return res.data;
}
