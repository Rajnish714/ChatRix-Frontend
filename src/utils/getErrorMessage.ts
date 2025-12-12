import { AxiosError } from "axios";
import { ApiError } from "@/types/auth.types";

export function getErrorMessage(error: unknown): string {
  const err = error as AxiosError<ApiError>;

  return (
    err.response?.data?.message ||
    err.message ||
    "Something went wrong"
  );
}