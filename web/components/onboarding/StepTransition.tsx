"use client";

import { ReactNode } from "react";

interface StepTransitionProps {
  children: ReactNode;
  direction: 'forward' | 'back';
}

export default function StepTransition({ children, direction }: StepTransitionProps) {
  return (
    <div
      className={`animate-slideIn ${
        direction === 'forward' ? 'animate-slideInRight' : 'animate-slideInLeft'
      }`}
    >
      {children}
    </div>
  );
}

