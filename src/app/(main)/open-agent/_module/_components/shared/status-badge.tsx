'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type StatusVariant =
  | 'active'
  | 'inactive'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'completed'
  | 'cancelled'
  | 'suspended'
  | 'under-review'
  | 'compliant'
  | 'review-needed'
  | 'non-compliant'
  | 'released'
  | 'expired'
  | 'issuance'
  | 'transfer'
  | 'burn'
  | 'adjustment'
  | 'secondary'
  | 'primary'
  | 'gift'
  | 'inheritance'
  | 'regulatory'
  | 'legal'
  | 'voluntary';

const variantConfig: Record<StatusVariant, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  inactive: { label: 'Inactive', className: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
  pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  approved: { label: 'Approved', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  completed: { label: 'Completed', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  cancelled: { label: 'Cancelled', className: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
  suspended: { label: 'Suspended', className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
  'under-review': { label: 'Under Review', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
  compliant: { label: 'Compliant', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  'review-needed': { label: 'Review Needed', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  'non-compliant': { label: 'Non-Compliant', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  released: { label: 'Released', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  expired: { label: 'Expired', className: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
  issuance: { label: 'Issuance', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  transfer: { label: 'Transfer', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
  burn: { label: 'Burn', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  adjustment: { label: 'Adjustment', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  secondary: { label: 'Secondary', className: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400' },
  primary: { label: 'Primary', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  gift: { label: 'Gift', className: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400' },
  inheritance: { label: 'Inheritance', className: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400' },
  regulatory: { label: 'Regulatory', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  legal: { label: 'Legal', className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
  voluntary: { label: 'Voluntary', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = variantConfig[status as StatusVariant] ?? {
    label: status,
    className: 'bg-gray-100 text-gray-600',
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        'border-0 text-xs font-medium capitalize',
        config.className,
        className,
      )}
    >
      {config.label}
    </Badge>
  );
}
