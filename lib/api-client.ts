// type RequestOptions = {
//   method?: string;
//   headers?: Record<string, string>;
//   body?: any;
//   cookie?: string;
//   params?: Record<string, string | number | boolean | undefined | null>;
//   cache?: RequestCache;
//   next?: NextFetchRequestConfig;
// };

// function buildUrlWithParams(
//   url: string,
//   params?: RequestOptions["params"]
// ): string {
//   if (!params) return url;
//   const filteredParams = Object.fromEntries(
//     Object.entries(params).filter(
//       //the value of the entry must not be undefined nor null
//       ([, value]) => value !== undefined && value !== null
//     )
//   );
//   //if there are no filtered params, return the url itself
//   if (Object.keys(filteredParams).length === 0) return url;
//   const queryString = new URLSearchParams(
//     filteredParams as Record<string, string>
//   ).toString();
//   return `${url}?${queryString}`;
// }

// // Create a separate function for getting server-side cookies that can be imported where needed
// export function getServerCookies() {
//   if (typeof window !== "undefined") return "";

//   // Dynamic import next/headers only on server-side
//   return import("next/headers").then(async ({ cookies }) => {
//     try {
//       const cookieStore = await cookies();

//       return cookieStore
//         .getAll()
//         .map((c) => `${c.name}=${c.value}`)
//         .join("; ");
//     } catch (error) {
//       console.error("Failed to access cookies:", error);
//       return "";
//     }
//   });
// }

// async function fetchApi<T>(
//   url: string,
//   options: RequestOptions = {}
// ): Promise<T> {
//   const {
//     method = "GET",
//     headers = {},
//     body,
//     cookie,
//     params,
//     cache = "no-store",
//     next,
//   } = options;

//   // Get cookies from the request when running on server
//   let cookieHeader = cookie;
//   if (typeof window === "undefined" && !cookie) {
//     cookieHeader = await getServerCookies();
//   }

//   const fullUrl = buildUrlWithParams(`${process.env.API_URL}${url}`, params);

//   const response = await fetch(fullUrl, {
//     method,
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json",
//       ...headers,
//       ...(cookieHeader ? { Cookie: cookieHeader } : {}),
//     },
//     body: body ? JSON.stringify(body) : undefined,
//     credentials: "include",
//     cache,
//     next,
//   });

//   if (!response.ok) {
//     const message = (await response.json()).message || response.statusText;
//     if (typeof window !== "undefined") {
//       useNotifications.getState().addNotification({
//         type: "error",
//         title: "Error",
//         message,
//       });
//     }
//     throw new Error(message);
//   }

//   return response.json();
// }

// export const api = {
//   get<T>(url: string, options?: RequestOptions): Promise<T> {
//     return fetchApi<T>(url, { ...options, method: "GET" });
//   },
//   post<T>(url: string, body?: any, options?: RequestOptions): Promise<T> {
//     return fetchApi<T>(url, { ...options, method: "POST", body });
//   },
//   put<T>(url: string, body?: any, options?: RequestOptions): Promise<T> {
//     return fetchApi<T>(url, { ...options, method: "PUT", body });
//   },
//   patch<T>(url: string, body?: any, options?: RequestOptions): Promise<T> {
//     return fetchApi<T>(url, { ...options, method: "PATCH", body });
//   },
//   delete<T>(url: string, options?: RequestOptions): Promise<T> {
//     return fetchApi<T>(url, { ...options, method: "DELETE" });
//   },
// };

interface fetchOptions {
  method: string;
  body?: object;
}

const fetchApi = async (url: string, options: fetchOptions) => {
  const res = await fetch(url, {
    method: options.method,
    body: JSON.stringify(options.body),
  });
  if (!res.ok) {
    const message =
      (await res.json()).message || `a ${res.statusText} error ocurred`;
    throw new Error(message);
  }
  return await res.json();
};

export const api = {
  get(url: string) {
    return fetchApi(url, { method: "GET" });
  },
  Patch(url: string) {
    return fetchApi(url, { method: "PATCH" });
  },
  DELETE(url: string) {
    return fetchApi(url, { method: "DELETE" });
  },
  POST(url: string) {
    return fetchApi(url, { method: "POST" });
  },
};
