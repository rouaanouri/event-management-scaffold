import { AxiosError } from "axios";

import i18n from "@/i18n";
import type { ApiErrorResponse } from "@/types";

export function getApiErrorMessage(error: unknown): string {
  // eslint-disable-next-line no-console
  console.error(error);

  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;

    if (data?.message) {
      return data.message;
    }

    if (error.response) {
      return i18n.t("errors.statusFailure", { status: error.response.status });
    }

    if (error.request) {
      return i18n.t("errors.noResponse");
    }
  }

  return i18n.t("errors.unexpected");
}
