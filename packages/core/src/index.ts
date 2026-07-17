export const redshieldWorksCoreModuleId = "redshieldworks-core" as const;

export type RedshieldWorksSensitivity = "public" | "internal" | "confidential" | "restricted" | "secret";

export interface RedshieldWorksActorRef {
  actorId: string;
  actorType: "human" | "agent" | "service_account" | "system" | "module";
}

export interface RedshieldWorksEvidenceRef {
  evidenceId: string;
  sensitivity: RedshieldWorksSensitivity;
}

export * from "./notice-action-work-items";
export * from "./generated/index";
