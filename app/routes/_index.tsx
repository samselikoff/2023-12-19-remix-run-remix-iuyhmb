import type { MetaFunction } from "@remix-run/node";
import { AnimatedProgressBar } from "../components";
import { useState } from "react";
export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const totalSteps = 10;

export default function Index() {
  const [step, setStep] = useState(5);
  const zeroedTotalPages = totalSteps;
  const zeroedCurrentPage = step;
  const zeroedProgressPercentage = step / totalSteps;

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <div className="py-4 flex gap-x-8 px-4">
        <button
          type="button"
          className="bg-blue-200 px-1"
          onClick={() => {
            setStep((prev) => Math.max(0, prev - 1));
          }}
        >
          back
        </button>
        <button
          type="button"
          className="bg-blue-200 px-1"
          onClick={() => {
            setStep((prev) => Math.min(zeroedTotalPages, prev + 1));
          }}
        >
          forward
        </button>
      </div>
      <div className="w-full bg-gray-200 py-4">
        <AnimatedProgressBar
          progress={zeroedProgressPercentage}
          totalSteps={zeroedTotalPages}
          currentStep={zeroedCurrentPage}
        />
      </div>
    </div>
  );
}
