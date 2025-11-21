"use client";

import { type PropsWithChildren } from "react";
import clsx from "clsx";

interface CardProps extends PropsWithChildren {
  className?: string;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

export function Card({ className, children, title, description, actions }: CardProps) {
  return (
    <section className={clsx("bg-comfort rounded-3xl p-6 shadow-sm", className)}>
      {(title || description) && (
        <header className="mb-4 space-y-1">
          {title && <h3 className="text-2xl font-semibold text-primary-700">{title}</h3>}
          {description && <p className="text-lg text-elderText/80">{description}</p>}
        </header>
      )}
      <div className="space-y-4">{children}</div>
      {actions && <footer className="mt-5 flex flex-wrap gap-3">{actions}</footer>}
    </section>
  );
}

