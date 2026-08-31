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

      window.fetch = async (
        input: RequestInfo | URL,
        init: RequestInit = {},
      ) => {
        let url = input.toString();

        // Si la petición empieza con /api/ o api/, la redirigimos obligatoriamente al puerto 5000 de la IP/Host actual
        if (url.startsWith("/api/") || url.startsWith("api/")) {
          const currentProtocol = window.location.protocol; // http: o https:
          const currentHost = window.location.hostname; // localhost o 192.168.1.100
          const cleanPath = url.startsWith("/") ? url : `/${url}`;
          
          url = `${currentProtocol}//${currentHost}:5000${cleanPath}`;
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