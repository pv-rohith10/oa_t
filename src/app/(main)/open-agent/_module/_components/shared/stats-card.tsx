'use client';

import type { LucideIcon } from 'lucide-react';
import { TrendingDown, TrendingUp } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label?: string;
  };
  className?: string;
  accent?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
}

const accentMap = {
  blue: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
  green: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
  orange: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30',
  red: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
  purple: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30',
};

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  accent = 'blue',
}: StatsCardProps) {
  const isPositive = trend && trend.value >= 0;

  return (
    <Card className={cn('@container/card', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardDescription className="text-sm font-medium">{title}</CardDescription>
          {Icon && (
            <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', accentMap[accent])}>
              <Icon className="h-4 w-4" />
            </div>
          )}
        </div>
        <CardTitle className="text-2xl font-bold tabular-nums">{value}</CardTitle>
        <div className="flex items-center gap-2">
          {trend && (
            <Badge
              variant="outline"
              className={cn(
                'border-0 text-xs font-medium',
                isPositive
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
              )}
            >
              {isPositive ? (
                <TrendingUp className="mr-1 h-3 w-3" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3" />
              )}
              {isPositive ? '+' : ''}{trend.value}%
            </Badge>
          )}
          {description && (
            <span className="text-muted-foreground text-xs">{description}</span>
          )}
        </div>
      </CardHeader>
    </Card>
  );
}
