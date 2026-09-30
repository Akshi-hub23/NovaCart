import { Loader2 } from "lucide-react";

function LoadingMessage() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "12px",
      padding: "48px 24px",
      color: "var(--primary)",
      fontWeight: "600",
      fontSize: "1.05rem",
    }}>
      <Loader2 size={24} className="spin-icon" style={{ animation: "spin 1s linear infinite" }} />
      <span>Loading catalog items...</span>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default LoadingMessage;