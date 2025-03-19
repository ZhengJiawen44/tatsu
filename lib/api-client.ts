type fetchOptions = {
  method: string;
  headers?: object;
  body?: string | FormData;
};

const fetchApi = async (url: string, options: fetchOptions) => {
  console.log(options.body);

  const res = await fetch(url, {
    method: options.method,
    body: options.body,
  });

  if (!res.ok) {
    const message =
      (await res.json()).message || `a ${res.statusText} error ocurred`;
    throw new Error(message);
  }
  return await res.json();
};

export const api = {
  GET({ url }: { url: string }) {
    return fetchApi(url, { method: "GET" });
  },
  PATCH({
    url,
    headers,
    body,
  }: {
    url: string;
    headers?: fetchOptions["headers"];
    body?: fetchOptions["body"];
  }) {
    return fetchApi(url, { method: "PATCH", headers, body });
  },
  DELETE({ url }: { url: string }) {
    return fetchApi(url, { method: "DELETE" });
  },
  POST({
    url,
    headers,
    body,
  }: {
    url: string;
    headers?: fetchOptions["headers"];
    body: fetchOptions["body"];
  }) {
    return fetchApi(url, { method: "POST", headers, body });
  },
};
