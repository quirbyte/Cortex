export const getSubDomain = () => {
  const hostname = window.location.hostname;
  if (hostname.includes(".localhost")) {
    return hostname.split(".")[0];
  }
  
  const hostWithoutWWW = hostname.replace(/^www\./, "");
  const parts = hostWithoutWWW.split(".");

  if (parts.length > 2) { 
    return parts[0];
  }
  
  return null;
};