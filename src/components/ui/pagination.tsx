"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────
   Root <Pagination>
   ────────────────────────────────────────────── */

export const Pagination = ({
  className,
  ...props
}: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

export const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

export const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

/* ──────────────────────────────────────────────
   Links & buttons
   ────────────────────────────────────────────── */

type PaginationLinkProps = React.ComponentProps<"button"> & {
  isActive?: boolean;
};

export const PaginationLink = ({
  className,
  isActive,
  ...props
}: PaginationLinkProps) => (
  <button
    type="button"
    aria-current={isActive ? "page" : undefined}
    className={cn(
      "inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-full border text-xs font-medium transition-colors",
      "border-transparent bg-transparent px-3 text-foreground hover:bg-accent hover:text-accent-foreground",
      isActive &&
        "border-primary/50 bg-primary/5 text-primary hover:bg-primary/10",
      className
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

export const PaginationPrevious = ({
  className,
  children,
  ...props
}: Omit<PaginationLinkProps, "children"> & { children?: React.ReactNode }) => (
  <PaginationLink
    aria-label="Go to previous page"
    className={cn("gap-1 pl-2.5 hover:text-primary", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>{children ?? "Previous"}</span>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

export const PaginationNext = ({
  className,
  children,
  ...props
}: Omit<PaginationLinkProps, "children"> & { children?: React.ReactNode }) => (
  <PaginationLink
    aria-label="Go to next page"
    className={cn("gap-1 pr-2.5 hover:text-primary", className)}
    {...props}
  >
    <span>{children ?? "Next"}</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

/* ──────────────────────────────────────────────
   Ellipsis
   ────────────────────────────────────────────── */

export const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn(
      "flex h-9 w-9 items-center justify-center text-muted-foreground",
      className
    )}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";
