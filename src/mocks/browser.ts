// 브라우저 환경에서 MSW Service Worker를 생성하는 설정 파일입니다.
import { setupWorker } from "msw/browser";
import { handlers } from "@/mocks/handlers";

export const worker = setupWorker(...handlers);
