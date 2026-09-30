import { AlertTriangle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
}

function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "16px 20px",
      background: "var(--error-bg)",
      border: "1px solid var(--error-border)",
      borderRadius: "var(--radius-md)",
      color: "var(--error)",
      margin: "16px 0",
      fontSize: "0.95rem",
      fontWeight: "500",
    }}>
      <AlertTriangle size={20} style={{ flexShrink: 0 }} />
      <span>{message}</span>
    </div>
  );
}

export default ErrorMessage;