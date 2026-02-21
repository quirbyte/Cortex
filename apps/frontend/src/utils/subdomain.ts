export const getSubDomain = () => {
  const hostname = window.location.hostname;
  const hostWithoutWWW = hostname.replace(/^www\./, "");
  const parts = hostWithoutWWW.split(".");
  if (parts.length > 1 && parts[0] !== "localhost") {
    return parts[0];
  }
  return null;
};
