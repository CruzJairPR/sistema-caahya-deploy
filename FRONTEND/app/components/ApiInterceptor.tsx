"use client";

import { useEffect } from "react";

export default function ApiInterceptor({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const originalFetch = window.fetch;

      // Detectamos dinámicamente el host actual (localhost o la IP 192.168.X.X) pero apuntando al puerto 5000 del backend
      const currentHost = window.location.hostname;
      const dynamicApiUrl =
        process.env.NEXT_PUBLIC_API_URL || `http://${currentHost}:5000`;

      window.fetch = async (
        input: RequestInfo | URL,
        init: RequestInit = {},
      ) => {
        let url = input.toString();

        if (url.startsWith("/api/")) {
          url = `${dynamicApiUrl}${url}`;
        }

        const token = localStorage.getItem("token");

        if (token && (url.includes("/api/") || url.includes(":5000"))) {
          init.headers = {
            "Content-Type": "application/json",
            ...init.headers,
            Authorization: `Bearer ${token}`,
          };
        }

        const response = await originalFetch(url, init);

        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("userData");
          window.location.href = "/login";
        }

        return response;
      };
    }
  }, []);

  return <>{children}</>;
}
