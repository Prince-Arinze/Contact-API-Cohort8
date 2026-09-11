import type { AlertType } from "../types/contact";

interface AlertProps {
  message: string;
  type: AlertType;
}

export default function Alert({ message, type }: AlertProps) {
  if (!message) return null;

  return <div className={`alert ${type}`}>{message}</div>;
}