import { PackageSearch } from "lucide-react";

interface EmptyStateProps {
  message: string;
}

function EmptyState({ message }: EmptyStateProps) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "48px 24px",
      textAlign: "center",
      background: "var(--bg-surface)",
      border: "1px dashed var(--border-color)",
      borderRadius: "var(--radius-xl)",
      margin: "24px 0",
      color: "var(--text-muted)",
    }}>
      <PackageSearch size={48} color="var(--primary)" style={{ marginBottom: "16px", opacity: 0.8 }} />
      <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "var(--text-main)", marginBottom: "8px" }}>No Items Found</h3>
      <p style={{ fontSize: "0.95rem", maxWidth: "400px" }}>{message}</p>
    </div>
  );
}

export default EmptyState;