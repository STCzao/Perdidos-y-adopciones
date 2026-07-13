export const resolvePostLoginRedirect = () => {
  const returnUrl = localStorage.getItem("returnUrl");
  if (returnUrl) localStorage.removeItem("returnUrl");
  return returnUrl?.startsWith("/") && !returnUrl.includes("//") ? returnUrl : "/";
};
