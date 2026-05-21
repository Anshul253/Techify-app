interface ProgressBarProps {
    currentStep: number
    totalSteps: number
  }
  
  export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
    const progress = (currentStep / totalSteps) * 100
  
    return (
      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1 text-zinc-400">
          <span>
            Question {currentStep} of {totalSteps}
          </span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-zinc-800 rounded-full h-1.5">
          <div
            className="bg-gradient-to-r from-indigo-500 to-amber-600 h-1.5 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    )
  }
  
  