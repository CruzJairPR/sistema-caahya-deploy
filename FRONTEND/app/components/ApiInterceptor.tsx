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
        const token = localStorage.getItem("token");

        if (
          token &&
          typeof input === "string" &&
          (input.includes("/api/") || input.includes("localhost:5000"))
        ) {
          init.headers = {
            "Content-Type": "application/json",
            ...init.headers,
            Authorization: `Bearer ${token}`,
          };
        }

        const response = await originalFetch(input, init);

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
