import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { z } from "zod";

interface ProgressBarProps {
  progress: number; // progress in percentage
  totalSteps: number; // total number of steps
  currentStep: number; // current step
}

interface StepProps {
  step: number;
  currentStep: number;
  stepPercentage: number;
  overallProgressPercentage: number;
  totalSteps: number;
  height: number;
  stepScale: number;
}

const StepPropsSchema = z.object({
  stepPercentage: z.number().min(0).max(1),
  overallProgressPercentage: z.number().min(0).max(1),
  totalSteps: z.number().int().min(0),
  currentStep: z.number().int().min(0),
  step: z.number().int().min(0),
  height: z.number().min(0),
  stepScale: z.number().min(0),
});

const DotColors = {
  completed: `var(--brand-accent)`,
  current: `var(--brand-primary)`,
  future: `var(--gray-300)`,
};

const BarColors = {
  // complete: "var(--brand-primary-light)",
  complete: `var(--brand-accent)`,
  incomplete: `var(--gray-300)`,
};

function validateProps(props: any, schema: any): StepProps {
  const result = schema.safeParse(props);

  if (result.success) {
    return result.data;
  } else {
    console.error(result.error);
    throw new Error(`Invalid props`);
  }
}

function Step(props: StepProps) {
  // const validatedProps = validateProps(props, StepPropsSchema);
  const {
    step,
    stepPercentage,
    overallProgressPercentage,
    currentStep,
    totalSteps,
    height,
    stepScale,
  } = props;
  // } = validatedProps;

  let color = DotColors.future;
  if (Math.abs(stepPercentage - overallProgressPercentage) <= 0.005) {
    color = DotColors.current;
  } else if (stepPercentage < overallProgressPercentage) {
    color = DotColors.completed;
  }
  // const [initialColor] = useState(color);
  const h = height * stepScale;

  let isCurrent = color === DotColors.current;

  return (
    <motion.div
      key={step}
      style={{
        position: `absolute`,
        top: `50%`,
        left: `${(step / totalSteps) * 100}%`, // Position the dot based on the step
        transform: `translate(-50%, -50%)`,
        height: h,
        width: h,
        borderRadius: `50%`,
        // background: color,
      }}
      initial={{
        //   // left: `${(step / totalSteps) * 100}%`,
        backgroundColor: color, // Initial color
      }}
      animate={{
        // left: `${(step / totalSteps) * 100}%`,
        backgroundColor: color, // Color to animate to
      }}
      transition={{
        duration: 0.1,
        // duration: 10,
        ease: `easeInOut`, // Add easing function here
        backgroundColor: {
          duration: 0.2,
          delay: isCurrent ? 0.2 : 0,
          ease: `easeInOut`,
        }, // Specify easing for color transition
      }}
    ></motion.div>
  );
}
export const AnimatedProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  totalSteps,
  currentStep,
}) => {
  if (currentStep < 0) return null;

  const percentage = progress * 100;

  // Create an array of steps
  const zeroedStepsArray = Array.from({ length: totalSteps + 1 }, (_, i) => {
    return {
      index: i,
      progressPercentage: i / totalSteps,
    };
  });

  // const [animatedProgress, setAnimatedProgress] = useState(progress);

  const height = 8;
  const stepScale = 1.75;
  return (
    <div
      className={`mx-4`}
      style={{ position: `relative`, height, marginTop: height * stepScale }}
    >
      <div
        style={{
          position: `absolute`,
          top: 0,
          left: 0,
          height,
          width: `100%`,
          backgroundColor: BarColors.incomplete,
        }}
      ></div>

      <motion.div
        style={{
          position: `absolute`,
          top: 0,
          left: 0,
          height, // Height of the top border
          borderTopRightRadius: height * 0.5, // Radius of the top border,
          borderBottomRightRadius: height * 0.5, // Radius of the top border,
          background: BarColors.complete, // Gradient color
          width: `${percentage}%`, // Set width based on progress
        }}
        animate={{ width: `${percentage}%` }} // End state of the animation
        transition={{ duration: 0.5 }} // Transition properties
      />

      {zeroedStepsArray.map((step) => {
        return (
          <Step
            key={step.index}
            step={step.index}
            height={height}
            stepScale={stepScale}
            stepPercentage={step.progressPercentage}
            overallProgressPercentage={percentage / 100}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        );
      })}
    </div>
  );
};
