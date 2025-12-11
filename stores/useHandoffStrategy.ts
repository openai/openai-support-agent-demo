import { create } from "zustand";
import { handoffStrategy } from "@/config/handoffStrategy";

interface HandoffStrategyState {
  value: "confirm" | "auto";
  setStrategy: (value: "confirm" | "auto") => void;
}

const useHandoffStrategy = create<HandoffStrategyState>((set) => ({
  value: handoffStrategy.value,
  setStrategy: (value) => {
    handoffStrategy.value = value;
    set({ value });
  },
}));

export default useHandoffStrategy;
