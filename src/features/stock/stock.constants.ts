import type { StockMovementType } from "./stock.types";

export const MOVEMENT_TYPE_LABELS: Record<StockMovementType, string> = {
  PURCHASE_ENTRY: "Entrada por compra",
  RETURN_ENTRY: "Entrada por devolução",
  TECHNICIAN_OUTPUT: "Saída para técnico",
  ADJUSTMENT: "Ajuste",
  LOSS: "Perda",
  TRANSFER: "Transferência",
};

export const MOVEMENT_TYPE_OPTIONS = (
  Object.keys(MOVEMENT_TYPE_LABELS) as StockMovementType[]
).map((value) => ({ value, label: MOVEMENT_TYPE_LABELS[value] }));

const ENTRY_TYPES: StockMovementType[] = ["PURCHASE_ENTRY", "RETURN_ENTRY"];
const OUTPUT_TYPES: StockMovementType[] = ["TECHNICIAN_OUTPUT", "LOSS"];

export type MovementDirection = "entry" | "output" | "adjustment" | "transfer";

export function movementDirection(type: StockMovementType): MovementDirection {
  if (type === "ADJUSTMENT") return "adjustment";
  if (type === "TRANSFER") return "transfer";
  if (ENTRY_TYPES.includes(type)) return "entry";
  if (OUTPUT_TYPES.includes(type)) return "output";
  return "transfer";
}

/** Tipos que exigem observação obrigatória. */
export function requiresNote(type: StockMovementType): boolean {
  return type === "LOSS" || type === "ADJUSTMENT";
}
