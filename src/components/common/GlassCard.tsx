/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  glow = false,
  ...props 
}) => {
  return (
    <motion.div
      className={`
        panel-base
        ${className}
      `}
      {...props}
    >
      {glow && (
        <div className="absolute -inset-1 bg-accent/10 blur-2xl opacity-50 -z-10" />
      )}
      {children}
    </motion.div>
  );
};
