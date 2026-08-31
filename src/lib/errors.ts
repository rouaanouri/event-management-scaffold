import { AxiosError } from "axios";

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
      return `فشل الطلب برمز الحالة ${error.response.status}.`;
    }

    if (error.request) {
      return "لم يصل أي رد من الخادم. راجع إعدادات CORS على الخادم أو حالة الاتصال.";
    }
  }

  return "حدث خطأ غير متوقع. حاول مرة أخرى.";
}
