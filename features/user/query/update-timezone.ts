import { useMutation } from "@tanstack/react-query";

export function useUpdateTimezone() {
  return useMutation({
    mutationFn: async (timeZone: string) => {
      const res = await fetch("/api/timezone", {
        method: "GET",
        headers: {
          "X-User-Timezone": timeZone,
        },
        credentials: "same-origin",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Failed to update timezone");
      }

      return res.json();
    },
  });
}
