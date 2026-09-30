import { Check } from "lucide-react";

const STEPS = ["Ordered", "Confirmed", "Processing", "Shipped", "Delivered"];

export default function OrderStatusTimeline({ status, compact = false }: { status: string; compact?: boolean }) {
  const currentStep = STEPS.findIndex((step) => step.toLowerCase() === status.toLowerCase());
  const progress = status.toLowerCase() === "pending" ? 1 : currentStep < 0 ? 0 : currentStep;

  if (status.toLowerCase() === "cancelled") {
    return <div className={`order-timeline-cancelled${compact ? " compact" : ""}`} role="status">Order cancelled</div>;
  }

  return (
    <ol className={`order-timeline${compact ? " compact" : ""}`} aria-label={`Order progress. Current status: ${status}`}>
      {STEPS.map((step, index) => {
        const complete = index < progress || status.toLowerCase() === "delivered";
        const current = index === progress && status.toLowerCase() !== "delivered";
        return (
          <li className={`${complete ? "complete" : ""}${current ? " current" : ""}`} key={step} aria-current={current ? "step" : undefined}>
            <span className="order-timeline-marker" aria-hidden="true">{complete ? <Check size={13} /> : index + 1}</span>
            <span className="order-timeline-label">{step}{current ? ` · ${status === "Pending" ? "Awaiting confirmation" : status}` : ""}</span>
          </li>
        );
      })}
    </ol>
  );
}
