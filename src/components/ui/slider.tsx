"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SliderProps {
  value: [number, number];
  min: number;
  max: number;
  step?: number;
  onValueChange: (value: [number, number]) => void;
  className?: string;
  disabled?: boolean;
}

export function Slider({
  value,
  min,
  max,
  step = 1,
  onValueChange,
  className,
  disabled,
}: SliderProps) {
  const [minValue, maxValue] = value;
  const minPercent = ((minValue - min) / (max - min)) * 100;
  const maxPercent = ((maxValue - min) / (max - min)) * 100;

  return (
    <div className={cn("relative h-8 w-full", className)}>
      <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-slate-200 dark:bg-slate-800" />
      <div
        className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-500"
        style={{
          left: `${minPercent}%`,
          width: `${Math.max(maxPercent - minPercent, 0)}%`,
        }}
      />

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={minValue}
        disabled={disabled}
        onChange={(event) => {
          const nextMin = Math.min(Number(event.target.value), maxValue - step);
          onValueChange([nextMin, maxValue]);
        }}
        className="absolute inset-0 h-8 w-full cursor-pointer appearance-none bg-transparent accent-fuchsia-500"
      />

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={maxValue}
        disabled={disabled}
        onChange={(event) => {
          const nextMax = Math.max(Number(event.target.value), minValue + step);
          onValueChange([minValue, nextMax]);
        }}
        className="absolute inset-0 h-8 w-full cursor-pointer appearance-none bg-transparent accent-cyan-500"
      />
    </div>
  );
}
