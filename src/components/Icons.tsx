import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function baseProps(size = 20) {
  return { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
}

export function IconGauge({ size = 20, ...props }: IconProps) {
  return <svg {...baseProps(size)} {...props}><path d="M12 14a2 2 0 1 0-2-2" /><path d="M13.4 10.6 15 9" /><path d="M6.6 15a9 9 0 1 1 10.8 0" /></svg>;
}
export function IconHeart({ size = 20, ...props }: IconProps) {
  return <svg {...baseProps(size)} {...props}><path d="m12 21-1-1C5 14 2 11 2 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 3-3 6-9 12Z" /></svg>;
}
export function IconPlus({ size = 20, ...props }: IconProps) {
  return <svg {...baseProps(size)} {...props}><path d="M12 5v14M5 12h14" /></svg>;
}
export function IconSearch({ size = 20, ...props }: IconProps) {
  return <svg {...baseProps(size)} {...props}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>;
}
export function IconChevronLeft({ size = 20, ...props }: IconProps) {
  return <svg {...baseProps(size)} {...props}><path d="m15 18-6-6 6-6" /></svg>;
}
export function IconChevronRight({ size = 20, ...props }: IconProps) {
  return <svg {...baseProps(size)} {...props}><path d="m9 18 6-6-6-6" /></svg>;
}
export function IconMenu({ size = 20, ...props }: IconProps) {
  return <svg {...baseProps(size)} {...props}><path d="M3 6h18M3 12h18M3 18h18" /></svg>;
}
export function IconX({ size = 20, ...props }: IconProps) {
  return <svg {...baseProps(size)} {...props}><path d="M18 6 6 18M6 6l12 12" /></svg>;
}
export function IconAlertTriangle({ size = 20, ...props }: IconProps) {
  return <svg {...baseProps(size)} {...props}><path d="M12 2 2 20h20L12 2Z" /><path d="M12 8v5M12 17h.01" /></svg>;
}
export function IconCheck({ size = 20, ...props }: IconProps) {
  return <svg {...baseProps(size)} {...props}><path d="m20 6-11 11-5-5" /></svg>;
}
export function IconUser({ size = 20, ...props }: IconProps) {
  return <svg {...baseProps(size)} {...props}><path d="M20 21a8 8 0 1 0-16 0" /><circle cx="12" cy="8" r="4" /></svg>;
}
