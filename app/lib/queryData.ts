"use client";
import { useQuery } from "@tanstack/react-query";

export const useGetUserData = () => {
  return useQuery({
    queryKey: ["userData"],
    queryFn: () =>
      fetch("/api/bot/userData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: 2 }),
      }).then((res) => res.json()),
  });
};
