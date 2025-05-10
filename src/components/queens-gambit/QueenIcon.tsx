import type { SVGProps } from 'react';
import { Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function QueenIcon(props: SVGProps<SVGSVGElement>) {
  const { className, style, ...restProps } = props;

  // The style prop from the parent component (Chessboard.tsx, SolutionBoard.tsx)
  // which includes { fill: '#FFD700', stroke: 'black', strokeWidth: '1px' }
  // will be applied to the Crown SVG element.
  // Lucide icons are standard SVGs and respect these style attributes.
  // The cn utility merges the default "w-full h-full" with any className passed in props.
  return (
    <Crown
      className={cn("w-full h-full", className)}
      style={style}
      {...restProps}
    />
  );
}
