const API_URL = import.meta.env.VITE_API_URL;

// Funcion generica para llamar a la API
export async function apiRequest(
  endpoint,
  method = "GET",
  data = null,
  token = null
) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };

  if (data) options.body = JSON.stringify(data);
  if (token) options.headers["x-token"] = token;

  const res = await fetch(`${API_URL}${endpoint}`, options);

  if (!res.ok) throw new Error(`Error ${res.status}`);

  return res.json();
}
