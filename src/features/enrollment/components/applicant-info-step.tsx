"use client";

// 신청자 정보 단계에서 개인/단체 신청에 공통으로 필요한 입력 필드를 처리합니다.
import { useEffect } from "react";
import type { FieldErrors } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import type { EnrollmentFormInputValues } from "@/features/enrollment/schemas";
import {
  createDefaultGroupValues,
  normalizeParticipantCount,
} from "@/features/enrollment/utils/group-form";

type GroupEnrollmentInputValues = Extract<
  EnrollmentFormInputValues,
  { type: "group" }
>;

export function ApplicantInfoStep() {
  const {
    formState: { errors },
    getValues,
    register,
    setValue,
    watch,
  } = useFormContext<EnrollmentFormInputValues>();

  const motivation = watch("applicant.motivation") ?? "";
  const selectedType = watch("type");
  const headCount = watch("group.headCount");
  const participants = watch("group.participants");
  const isGroupEnrollment = selectedType === "group";
  const groupErrors = errors as FieldErrors<GroupEnrollmentInputValues>;
  const participantListMessage =
    typeof groupErrors.group?.participants?.message === "string"
      ? groupErrors.group.participants.message
      : "";

  useEffect(() => {
    if (!isGroupEnrollment) {
      return;
    }

    const currentGroup = getValues("group") ?? createDefaultGroupValues();

    if (!currentGroup) {
      setValue("group", createDefaultGroupValues(), {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
      return;
    }

    const nextParticipants = normalizeParticipantCount(
      currentGroup.participants,
      Number(currentGroup.headCount),
    );

    if (nextParticipants.length !== currentGroup.participants.length) {
      setValue("group.participants", nextParticipants, {
        shouldDirty: true,
        shouldTouch: false,
        shouldValidate: false,
      });
    }
  }, [getValues, headCount, isGroupEnrollment, participants, setValue]);

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

        {isGroupEnrollment && (
          <div className="grid gap-5 rounded-md border border-slate-200 bg-slate-50 p-5">
            <div>
              <h3 className="text-base font-semibold text-slate-950">
                단체 신청 정보
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                신청 인원수에 맞춰 참가자 명단을 입력해주세요.
              </p>
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="group-organization-name"
                className="text-sm font-medium text-slate-800"
              >
                단체명
              </label>
              <input
                id="group-organization-name"
                type="text"
                placeholder="예: 프로덕트팀"
                aria-invalid={
                  groupErrors.group?.organizationName ? "true" : "false"
                }
                aria-describedby={
                  groupErrors.group?.organizationName
                    ? "group-organization-name-error"
                    : undefined
                }
                className={[
                  "h-10 rounded-md border bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-slate-950/10",
                  groupErrors.group?.organizationName
                    ? "border-red-500"
                    : "border-slate-300 focus:border-slate-950",
                ].join(" ")}
                {...register("group.organizationName")}
              />
              {groupErrors.group?.organizationName?.message && (
                <p
                  id="group-organization-name-error"
                  className="text-sm text-red-600"
                >
                  {groupErrors.group.organizationName.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="group-head-count"
                className="text-sm font-medium text-slate-800"
              >
                신청 인원수
              </label>
              <input
                id="group-head-count"
                type="number"
                min={2}
                max={10}
                inputMode="numeric"
                aria-invalid={groupErrors.group?.headCount ? "true" : "false"}
                aria-describedby={
                  groupErrors.group?.headCount
                    ? "group-head-count-error"
                    : undefined
                }
                className={[
                  "h-10 rounded-md border bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-slate-950/10",
                  groupErrors.group?.headCount
                    ? "border-red-500"
                    : "border-slate-300 focus:border-slate-950",
                ].join(" ")}
                {...register("group.headCount", {
                  valueAsNumber: true,
                })}
              />
              {groupErrors.group?.headCount?.message && (
                <p id="group-head-count-error" className="text-sm text-red-600">
                  {groupErrors.group.headCount.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <div>
                <h4 className="text-sm font-medium text-slate-800">
                  참가자 명단
                </h4>
                <p className="mt-1 text-sm text-slate-600">
                  신청 인원수와 같은 수의 참가자를 입력해야 합니다.
                </p>
              </div>

              {(participants ?? []).map((_, index) => (
                <div
                  key={index}
                  className="grid gap-3 rounded-md border border-slate-200 bg-white p-4 sm:grid-cols-2"
                >
                  <div className="grid gap-2">
                    <label
                      htmlFor={`group-participant-${index}-name`}
                      className="text-sm font-medium text-slate-800"
                    >
                      참가자 {index + 1} 이름
                    </label>
                    <input
                      id={`group-participant-${index}-name`}
                      type="text"
                      placeholder="참가자 이름"
                      aria-invalid={
                        groupErrors.group?.participants?.[index]?.name
                          ? "true"
                          : "false"
                      }
                      aria-describedby={
                        groupErrors.group?.participants?.[index]?.name
                          ? `group-participant-${index}-name-error`
                          : undefined
                      }
                      className={[
                        "h-10 rounded-md border bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-slate-950/10",
                        groupErrors.group?.participants?.[index]?.name
                          ? "border-red-500"
                          : "border-slate-300 focus:border-slate-950",
                      ].join(" ")}
                      {...register(`group.participants.${index}.name`)}
                    />
                    <p
                      id={`group-participant-${index}-name-error`}
                      className="min-h-5 text-sm text-red-600"
                    >
                      {groupErrors.group?.participants?.[index]?.name
                        ?.message ?? ""}
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <label
                      htmlFor={`group-participant-${index}-email`}
                      className="text-sm font-medium text-slate-800"
                    >
                      참가자 {index + 1} 이메일
                    </label>
                    <input
                      id={`group-participant-${index}-email`}
                      type="email"
                      placeholder="participant@example.com"
                      aria-invalid={
                        groupErrors.group?.participants?.[index]?.email
                          ? "true"
                          : "false"
                      }
                      aria-describedby={
                        groupErrors.group?.participants?.[index]?.email
                          ? `group-participant-${index}-email-error`
                          : undefined
                      }
                      className={[
                        "h-10 rounded-md border bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-slate-950/10",
                        groupErrors.group?.participants?.[index]?.email
                          ? "border-red-500"
                          : "border-slate-300 focus:border-slate-950",
                      ].join(" ")}
                      {...register(`group.participants.${index}.email`)}
                    />
                    <p
                      id={`group-participant-${index}-email-error`}
                      className="min-h-5 text-sm text-red-600"
                    >
                      {groupErrors.group?.participants?.[index]?.email
                        ?.message ?? ""}
                    </p>
                  </div>
                </div>
              ))}

              <p className="min-h-5 text-sm text-red-600">
                {participantListMessage}
              </p>
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="group-contact-person"
                className="text-sm font-medium text-slate-800"
              >
                담당자 연락처
              </label>
              <input
                id="group-contact-person"
                type="text"
                placeholder="담당자 이름 또는 연락처"
                aria-invalid={
                  groupErrors.group?.contactPerson ? "true" : "false"
                }
                aria-describedby={
                  groupErrors.group?.contactPerson
                    ? "group-contact-person-error"
                    : undefined
                }
                className={[
                  "h-10 rounded-md border bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-slate-950/10",
                  groupErrors.group?.contactPerson
                    ? "border-red-500"
                    : "border-slate-300 focus:border-slate-950",
                ].join(" ")}
                {...register("group.contactPerson")}
              />
              {groupErrors.group?.contactPerson?.message && (
                <p
                  id="group-contact-person-error"
                  className="text-sm text-red-600"
                >
                  {groupErrors.group.contactPerson.message}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
