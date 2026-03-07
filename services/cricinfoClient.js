export const fetchCricinfoHTML = async (url) => {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "User-Agent": navigator.userAgent
    }
  });

  return await res.text();
};
