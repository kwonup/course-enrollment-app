"use client";

// 신청자 정보 단계에서 개인/단체 신청에 공통으로 필요한 입력 필드를 처리합니다.
import { useFormContext } from "react-hook-form";
import type { EnrollmentFormInputValues } from "@/features/enrollment/schemas";

export function ApplicantInfoStep() {
  const {
    formState: { errors },
    register,
    watch,
  } = useFormContext<EnrollmentFormInputValues>();
  const motivation = watch("applicant.motivation") ?? "";

  return (
    <section className="rounded-md border border-slate-200 bg-white p-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">신청 정보</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          수강 신청자에게 공통으로 필요한 정보를 입력해주세요.
        </p>
      </div>

      <div className="mt-6 grid gap-5">
        <div className="grid gap-2">
          <label
            htmlFor="applicant-name"
            className="text-sm font-medium text-slate-800"
          >
            이름
          </label>
          <input
            id="applicant-name"
            type="text"
            autoComplete="name"
            placeholder="홍길동"
            aria-invalid={errors.applicant?.name ? "true" : "false"}
            aria-describedby={
              errors.applicant?.name ? "applicant-name-error" : undefined
            }
            className={[
              "h-10 rounded-md border bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-slate-950/10",
              errors.applicant?.name
                ? "border-red-500"
                : "border-slate-300 focus:border-slate-950",
            ].join(" ")}
            {...register("applicant.name")}
          />
          {errors.applicant?.name?.message && (
            <p id="applicant-name-error" className="text-sm text-red-600">
              {errors.applicant.name.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <label
            htmlFor="applicant-email"
            className="text-sm font-medium text-slate-800"
          >
            이메일
          </label>
          <input
            id="applicant-email"
            type="email"
            autoComplete="email"
            placeholder="user@example.com"
            aria-invalid={errors.applicant?.email ? "true" : "false"}
            aria-describedby={
              errors.applicant?.email ? "applicant-email-error" : undefined
            }
            className={[
              "h-10 rounded-md border bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-slate-950/10",
              errors.applicant?.email
                ? "border-red-500"
                : "border-slate-300 focus:border-slate-950",
            ].join(" ")}
            {...register("applicant.email")}
          />
          {errors.applicant?.email?.message && (
            <p id="applicant-email-error" className="text-sm text-red-600">
              {errors.applicant.email.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <label
            htmlFor="applicant-phone"
            className="text-sm font-medium text-slate-800"
          >
            전화번호
          </label>
          <input
            id="applicant-phone"
            type="tel"
            autoComplete="tel"
            placeholder="010-1234-5678"
            aria-invalid={errors.applicant?.phone ? "true" : "false"}
            aria-describedby={
              errors.applicant?.phone ? "applicant-phone-error" : undefined
            }
            className={[
              "h-10 rounded-md border bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-slate-950/10",
              errors.applicant?.phone
                ? "border-red-500"
                : "border-slate-300 focus:border-slate-950",
            ].join(" ")}
            {...register("applicant.phone")}
          />
          {errors.applicant?.phone?.message && (
            <p id="applicant-phone-error" className="text-sm text-red-600">
              {errors.applicant.phone.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-3">
            <label
              htmlFor="applicant-motivation"
              className="text-sm font-medium text-slate-800"
            >
              수강 동기
            </label>
            <span className="text-xs text-slate-500">
              {motivation.length}/300
            </span>
          </div>
          <textarea
            id="applicant-motivation"
            rows={5}
            placeholder="수강 동기를 입력해주세요. 선택 입력입니다."
            aria-invalid={errors.applicant?.motivation ? "true" : "false"}
            aria-describedby={
              errors.applicant?.motivation
                ? "applicant-motivation-error"
                : undefined
            }
            className={[
              "min-h-32 resize-y rounded-md border bg-white px-3 py-2 text-sm leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-slate-950/10",
              errors.applicant?.motivation
                ? "border-red-500"
                : "border-slate-300 focus:border-slate-950",
            ].join(" ")}
            {...register("applicant.motivation")}
          />
          {errors.applicant?.motivation?.message && (
            <p id="applicant-motivation-error" className="text-sm text-red-600">
              {errors.applicant.motivation.message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
