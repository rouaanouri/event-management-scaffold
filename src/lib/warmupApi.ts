export function warmUpApiServer(): void {
  const baseURL = import.meta.env.VITE_API_URL;
  if (!baseURL) return;

  fetch(baseURL, { method: "GET", mode: "no-cors" }).catch(() => {});
}
