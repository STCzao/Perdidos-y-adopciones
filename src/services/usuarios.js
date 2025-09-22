import { apiRequest } from "../api";

// Registro
export function registerUser(data) {
  return apiRequest("/usuarios", "POST", data);
}

// Login
export function loginUser(data) {
  return apiRequest("/auth/login", "POST", data);
}

// Perfil (requiere token)
export function getProfile(token) {
  return apiRequest("/usuarios/perfil", "GET", null, token);
}
