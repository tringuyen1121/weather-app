import React, { createContext, useCallback, useContext, useState } from "react";
import type { Units } from "../types/weather";

interface UnitContextType {
  units: Units;
  isMetric: boolean;
  toggleUnits: () => void;
}

const METRIC: Units = {
  temperature: "celsius",
  wind: "kmh",
  precipitation: "mm",
};

const IMPERIAL: Units = {
  temperature: "fahrenheit",
  wind: "mph",
  precipitation: "inch",
};

const UnitContext = createContext<UnitContextType | null>(null);

export const UnitProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMetric, setIsMetric] = useState(true);

  const toggleUnits = useCallback(() => setIsMetric((v) => !v), []);

  return (
    <UnitContext.Provider
      value={{
        units: isMetric ? METRIC : IMPERIAL,
        isMetric,
        toggleUnits,
      }}
    >
      {children}
    </UnitContext.Provider>
  );
};

export const useUnit = (): UnitContextType => {
  const ctx = useContext(UnitContext);
  if (!ctx) throw new Error("useUnit must be used within UnitProvider");
  return ctx;
};
