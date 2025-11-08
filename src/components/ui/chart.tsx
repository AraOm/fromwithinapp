"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────
   Types
   ────────────────────────────────────────────────────────────── */

export type ChartConfig = {
  [key: string]: {
    label?: string;
    color?: string;
  };
};

type ChartContextType = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextType | undefined>(
  undefined
);

export function useChart() {
  const ctx = React.useContext(ChartContext);
  if (!ctx) {
    throw new Error("useChart must be used within a ChartContainer");
  }
  return ctx;
}

/* ──────────────────────────────────────────────────────────────
   ChartContainer
   ────────────────────────────────────────────────────────────── */

export type ChartContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  config: ChartConfig;
};

export function ChartContainer({
  children,
  className,
  config,
  ...props
}: ChartContainerProps) {
  const cssVars: React.CSSProperties = {};

  // Expose each series color as a CSS variable like --color-<key>
  Object.entries(config).forEach(([key, value]) => {
    if (value?.color) {
      (cssVars as any)[`--color-${key}`] = value.color;
    }
  });

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        className={cn(
          "flex h-full w-full flex-col gap-2 text-xs text-foreground",
          className
        )}
        style={cssVars}
        {...props}
      >
        <RechartsPrimitive.ResponsiveContainer>
          {children as React.ReactNode}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

/* ──────────────────────────────────────────────────────────────
   Tooltip wrappers
   ────────────────────────────────────────────────────────────── */

export type ChartTooltipProps = React.ComponentPropsWithoutRef<
  typeof RechartsPrimitive.Tooltip
>;

export function ChartTooltip(props: ChartTooltipProps) {
  return <RechartsPrimitive.Tooltip {...props} />;
}

export type ChartTooltipContentProps = {
  active?: boolean;
  payload?: any[];   // looser typing so TS is happy
  label?: any;
  className?: string;
  indicator?: "dot" | "line" | "dashed";
  hideLabel?: boolean;
};

export function ChartTooltipContent({
  active,
  payload,
  label,
  className,
  indicator = "dot",
  hideLabel = false,
}: ChartTooltipContentProps) {
  const { config } = useChart();

  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const items = Array.isArray(payload) ? payload : [payload];

  return (
    <div
      className={cn(
        "min-w-[180px] rounded-2xl border bg-background/95 px-3 py-2 text-xs shadow-lg backdrop-blur",
        className
      )}
    >
      {!hideLabel && label != null && (
        <div className="mb-1 text-[0.7rem] font-medium text-muted-foreground">
          {String(label)}
        </div>
      )}

      <div className="flex flex-col gap-1">
        {items.map((item, idx) => {
          if (!item) return null;

          const dataKey = item.dataKey as string | undefined;
          const conf = dataKey ? config[dataKey] : undefined;

          return (
            <div
              key={idx}
              className="flex items-center justify-between gap-2 text-[0.7rem]"
            >
              <div className="flex items-center gap-1.5">
                {indicator === "dot" && (
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{
                      backgroundColor:
                        (conf && conf.color) || item.color || "currentColor",
                    }}
                  />
                )}
                <span className="font-medium">
                  {conf?.label || dataKey || item.name}
                </span>
              </div>

              <span className="tabular-nums font-semibold">
                {item.value as any}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Legend wrappers
   ────────────────────────────────────────────────────────────── */

export type ChartLegendProps = React.ComponentPropsWithoutRef<
  typeof RechartsPrimitive.Legend
>;

export function ChartLegend(props: ChartLegendProps) {
  return <RechartsPrimitive.Legend {...props} />;
}

export type ChartLegendContentProps = {
  payload?: any[];
  className?: string;
};

export function ChartLegendContent({
  payload,
  className,
}: ChartLegendContentProps) {
  const { config } = useChart();

  if (!payload || payload.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-3 text-[0.7rem]", className)}>
      {payload.map((entry, idx) => {
        if (!entry) return null;

        const dataKey = entry.dataKey as string | undefined;
        const conf = dataKey ? config[dataKey] : undefined;

        return (
          <div key={idx} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{
                backgroundColor:
                  (conf && conf.color) || entry.color || "currentColor",
              }}
            />
            <span className="font-medium">
              {conf?.label || dataKey || entry.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}
