type fetchOptions = {
  method: string;
  headers?: object;
  body?: string;
};

const fetchApi = async (url: string, options: fetchOptions) => {
  const res = await fetch(url, {
    method: options.method,
  });

  if (!res.ok) {
    console.log(res.ok);
    const message =
      (await res.json()).message || `a ${res.statusText} error ocurred`;
    throw new Error(message);
  }
  return await res.json();
};

export const api = {
  GET(url: string) {
    return fetchApi(url, { method: "GET" });
  },
  PATCH(
    url: string,
    headers: fetchOptions["headers"],
    body: fetchOptions["body"]
  ) {
    return fetchApi(url, { method: "PATCH", headers, body });
  },
  DELETE(url: string) {
    return fetchApi(url, { method: "DELETE" });
  },
  POST(url: string) {
    return fetchApi(url, { method: "POST" });
  },
};
