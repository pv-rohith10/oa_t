'use client';

import {
  AlertTriangle,
  ArrowLeftRight,
  ArrowRight,
  BarChart2,
  BookOpen,
  Building2,
  CheckCircle,
  CheckCircle2,
  CheckSquare,
  Clock,
  Database,
  Download,
  FileKey,
  HelpCircle,
  Link2,
  Lock,
  MessageSquare,
  MinusCircle,
  PlusCircle,
  ScrollText,
  Shield,
  ShieldCheck,
  ShieldOff,
  Tag,
  TrendingDown,
  TrendingUp,
  Unlock,
  UserMinus,
  UserPlus,
  Users,
  XCircle,
  type LucideIcon,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Pie,
  PieChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from '@/components/ui/chart';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  activityLogs,
  issuers,
  investors,
  securities,
  transfers,
} from '../../_data/mock-data';
import { StatusBadge } from '../shared/status-badge';
import type { UserRole } from '../../_types';
import { cn } from '@/lib/utils';

// ─── Inline mock data for new dashboard metrics ───────────────────────────────

const turnaroundMock = { onTime: 47, total: 50, pct: 94.0 };

const inquiryMock = { open: 3, inProgress: 2, overdue: 1 };

const blockchainMock = {
  status: 'synced' as 'synced' | 'behind' | 'down',
  chain: 'Ethereum',
  lastBlock: 18_429_331,
  lastUpdatedAt: new Date(Date.now() - 15_000).toISOString(),
};

const mshfData = [
  { id: 'SEC-001', name: 'Apex Common Stock', mshfTotal: 845_000, cbOutstanding: 845_000, matched: true, diff: 0 },
  { id: 'SEC-002', name: 'Apex Series A Preferred', mshfTotal: 250_000, cbOutstanding: 250_000, matched: true, diff: 0 },
  { id: 'SEC-003', name: 'Apex Series A Warrants', mshfTotal: 300_000, cbOutstanding: 300_000, matched: true, diff: 0 },
  { id: 'SEC-004', name: 'Meridian Common Shares', mshfTotal: 9_500_000, cbOutstanding: 9_500_000, matched: true, diff: 0 },
  { id: 'SEC-005', name: 'Meridian Convertible Note', mshfTotal: 3_000_000, cbOutstanding: 3_000_000, matched: true, diff: 0 },
  { id: 'SEC-006', name: 'Solaris Common Stock', mshfTotal: 2_000_000, cbOutstanding: 2_000_000, matched: true, diff: 0 },
];

const sixMonthTrend = [
  { month: 'Sep', pct: 96.2, onTime: 77, total: 80, inProgress: false },
  { month: 'Oct', pct: 88.5, onTime: 77, total: 87, inProgress: false },
  { month: 'Nov', pct: 93.1, onTime: 81, total: 87, inProgress: false },
  { month: 'Dec', pct: 91.7, onTime: 66, total: 72, inProgress: false },
  { month: 'Jan', pct: 94.0, onTime: 47, total: 50, inProgress: false },
  { month: 'Feb*', pct: 62.0, onTime: 8, total: 13, inProgress: true },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function relativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ─── Event type → icon/color map ─────────────────────────────────────────────

const eventTypeMap: Record<string, { icon: LucideIcon; colorClass: string; bgClass: string }> = {
  Transfer: { icon: ArrowRight, colorClass: 'text-blue-600', bgClass: 'bg-blue-100 dark:bg-blue-900/30' },
  TransferApproved: { icon: CheckCircle, colorClass: 'text-green-600', bgClass: 'bg-green-100 dark:bg-green-900/30' },
  TransferRejected: { icon: XCircle, colorClass: 'text-red-600', bgClass: 'bg-red-100 dark:bg-red-900/30' },
  TransferSettled: { icon: CheckCircle2, colorClass: 'text-green-700', bgClass: 'bg-green-100 dark:bg-green-900/30' },
  TransferRequest: { icon: ArrowRight, colorClass: 'text-blue-600', bgClass: 'bg-blue-100 dark:bg-blue-900/30' },
  Hold: { icon: Shield, colorClass: 'text-orange-600', bgClass: 'bg-orange-100 dark:bg-orange-900/30' },
  HoldReleased: { icon: ShieldOff, colorClass: 'text-amber-600', bgClass: 'bg-amber-100 dark:bg-amber-900/30' },
  Lockup: { icon: Lock, colorClass: 'text-orange-600', bgClass: 'bg-orange-100 dark:bg-orange-900/30' },
  LockupExpired: { icon: Unlock, colorClass: 'text-amber-600', bgClass: 'bg-amber-100 dark:bg-amber-900/30' },
  Security: { icon: PlusCircle, colorClass: 'text-green-600', bgClass: 'bg-green-100 dark:bg-green-900/30' },
  Investor: { icon: UserPlus, colorClass: 'text-blue-600', bgClass: 'bg-blue-100 dark:bg-blue-900/30' },
  Compliance: { icon: ShieldCheck, colorClass: 'text-purple-600', bgClass: 'bg-purple-100 dark:bg-purple-900/30' },
  Ledger: { icon: ScrollText, colorClass: 'text-gray-600', bgClass: 'bg-gray-100 dark:bg-gray-800' },
  Blockchain: { icon: Link2, colorClass: 'text-orange-600', bgClass: 'bg-orange-100 dark:bg-orange-900/30' },
  Burn: { icon: MinusCircle, colorClass: 'text-red-600', bgClass: 'bg-red-100 dark:bg-red-900/30' },
  WhitelistAdd: { icon: UserPlus, colorClass: 'text-teal-600', bgClass: 'bg-teal-100 dark:bg-teal-900/30' },
  WhitelistRemove: { icon: UserMinus, colorClass: 'text-teal-600', bgClass: 'bg-teal-100 dark:bg-teal-900/30' },
};

function getEventStyle(entityType: string) {
  return eventTypeMap[entityType] ?? { icon: Tag, colorClass: 'text-gray-500', bgClass: 'bg-gray-100 dark:bg-gray-800' };
}

// ─── TurnaroundGauge ─────────────────────────────────────────────────────────

function TurnaroundGauge({ pct, total, onTime }: { pct: number; total: number; onTime: number }) {
  const isPass = pct >= 90;
  const fillColor = isPass ? 'hsl(142 76% 36%)' : 'hsl(0 84% 60%)';

  const gaugeConfig: ChartConfig = {
    onTime: { label: 'On Time', color: fillColor },
    missed: { label: 'Missed', color: 'hsl(var(--muted))' },
  };

  const gaugeData = [
    { name: 'onTime', value: pct },
    { name: 'missed', value: 100 - pct },
  ];

  return (
    <div className="flex flex-col items-center gap-1">
      <ChartContainer config={gaugeConfig} className="h-[130px] w-[130px]">
        <PieChart>
          <Pie
            data={gaugeData}
            cx="50%"
            cy="50%"
            innerRadius={44}
            outerRadius={60}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            strokeWidth={0}
          >
            <Cell fill={fillColor} />
            <Cell fill="hsl(var(--muted))" />
            <Label
              content={({ viewBox }) => {
                if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                  const cx = viewBox.cx as number;
                  const cy = viewBox.cy as number;
                  return (
                    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
                      <tspan
                        x={cx}
                        y={cy}
                        style={{ fontSize: '17px', fontWeight: 700, fill: 'hsl(var(--foreground))' }}
                      >
                        {pct.toFixed(1)}%
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
      <span className={cn('text-sm font-semibold', isPass ? 'text-green-600' : 'text-red-600')}>
        {isPass ? '✓ Pass' : '✗ Fail'}
      </span>
      <span className="text-[11px] text-muted-foreground text-center">
        {onTime} of {total} on time
      </span>
    </div>
  );
}

// ─── ActivityFeed ─────────────────────────────────────────────────────────────

function ActivityFeed({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base">Recent Activity</CardTitle>
          <CardDescription>Latest system events — audit journal</CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="text-xs" onClick={() => onNavigate('activity')}>
          View All →
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {activityLogs.map((log) => {
          const { icon: Icon, colorClass, bgClass } = getEventStyle(log.entityType);
          const initials = log.userName.split(' ').map((n) => n[0]).join('');
          return (
            <div
              key={log.id}
              className="flex items-start gap-3 px-6 py-2.5 hover:bg-muted/30 transition-colors border-b last:border-0"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold">
                {initials}
              </div>
              <div className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-md', bgClass)}>
                <Icon className={cn('h-3.5 w-3.5', colorClass)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium leading-tight truncate">{log.action}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug line-clamp-1">{log.details}</p>
              </div>
              <div className="shrink-0 text-right">
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                  {relativeTime(log.timestamp)}
                </span>
                <p className="text-[10px] text-muted-foreground">{log.userRole}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

// ─── MshfReconciliationCard ───────────────────────────────────────────────────

function MshfReconciliationCard({ onNavigate }: { onNavigate: (page: string) => void }) {
  const allMatched = mshfData.every((m) => m.matched);
  const matchedCount = mshfData.filter((m) => m.matched).length;

  return (
    <Card className={cn(!allMatched && 'border-red-400 dark:border-red-700')}>
      <CardHeader className="pb-0">
        <div
          className={cn(
            'rounded-lg px-4 py-2 -mx-2',
            allMatched
              ? 'bg-green-50 dark:bg-green-950/40'
              : 'bg-red-50 dark:bg-red-950/40',
          )}
        >
          <CardTitle
            className={cn(
              'text-sm font-semibold',
              allMatched ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400',
            )}
          >
            MSHF – Control Book Reconciliation
          </CardTitle>
          <p
            className={cn(
              'text-xs mt-0.5',
              allMatched ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500',
            )}
          >
            {allMatched
              ? `✓ All ${matchedCount} securities reconciled`
              : `${matchedCount} of ${mshfData.length} securities reconciled`}
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-0 mt-3">
        <div className="max-h-[200px] overflow-y-auto">
          {mshfData.map((sec) => (
            <button
              key={sec.id}
              type="button"
              className="flex w-full items-center gap-3 px-6 py-2.5 hover:bg-muted/30 cursor-pointer border-b last:border-0 text-left"
              onClick={() => onNavigate('securities')}
            >
              {sec.matched ? (
                <CheckCircle className="h-3.5 w-3.5 shrink-0 text-green-600" />
              ) : (
                <XCircle className="h-3.5 w-3.5 shrink-0 text-red-600" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{sec.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  MSHF: {sec.mshfTotal.toLocaleString()} | CB: {sec.cbOutstanding.toLocaleString()}
                </p>
              </div>
              <span
                className={cn(
                  'shrink-0 text-xs font-medium',
                  sec.matched ? 'text-green-600' : 'text-red-600',
                )}
              >
                {sec.matched
                  ? 'Matched'
                  : sec.diff > 0
                    ? `+${sec.diff.toLocaleString()}`
                    : sec.diff.toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── OverissuanceCard ─────────────────────────────────────────────────────────

function OverissuanceCard({ onNavigate }: { onNavigate: (page: string) => void }) {
  const withUtilization = securities.map((s) => {
    const pct = Math.round((s.totalOutstanding / s.totalAuthorized) * 1000) / 10;
    const status =
      s.totalOutstanding / s.totalAuthorized > 1
        ? 'critical'
        : s.totalOutstanding / s.totalAuthorized >= 0.9
          ? 'warning'
          : 'safe';
    return { ...s, pct, status };
  });

  const safeCount = withUtilization.filter((s) => s.status === 'safe').length;
  const warnCount = withUtilization.filter((s) => s.status === 'warning').length;
  const critCount = withUtilization.filter((s) => s.status === 'critical').length;
  const headerStatus = critCount > 0 ? 'critical' : warnCount > 0 ? 'warning' : 'safe';

  const headerBg = {
    safe: 'bg-green-50 dark:bg-green-950/40',
    warning: 'bg-amber-50 dark:bg-amber-950/40',
    critical: 'bg-red-50 dark:bg-red-950/40',
  }[headerStatus];

  const headerText = {
    safe: 'text-green-700 dark:text-green-400',
    warning: 'text-amber-700 dark:text-amber-400',
    critical: 'text-red-700 dark:text-red-400',
  }[headerStatus];

  return (
    <Card className={cn(critCount > 0 && 'border-red-400 dark:border-red-700')}>
      <CardHeader className="pb-0">
        <div className={cn('rounded-lg px-4 py-2 -mx-2', headerBg)}>
          <CardTitle className={cn('text-sm font-semibold', headerText)}>
            Overissuance Monitor
          </CardTitle>
          <p className="text-xs mt-0.5 text-muted-foreground">
            {safeCount} safe · {warnCount} warning · {critCount} over-issued
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-0 mt-3">
        <div className="max-h-[200px] overflow-y-auto">
          {withUtilization.map((sec) => {
            const barColor =
              sec.status === 'safe'
                ? 'hsl(142 76% 36%)'
                : sec.status === 'warning'
                  ? 'hsl(38 92% 50%)'
                  : 'hsl(0 84% 60%)';
            return (
              <button
                key={sec.id}
                type="button"
                className="flex w-full flex-col px-6 py-2.5 hover:bg-muted/30 cursor-pointer border-b last:border-0 text-left gap-1"
                onClick={() => onNavigate('security-detail')}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium truncate flex-1">{sec.name}</p>
                  {sec.status === 'critical' ? (
                    <span className="text-[10px] text-red-600 font-semibold ml-2 flex items-center gap-0.5">
                      <AlertTriangle className="h-3 w-3" /> OVERISSUED
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground ml-2 tabular-nums">{sec.pct}%</span>
                  )}
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(sec.pct, 100)}%`,
                      backgroundColor: barColor,
                    }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground tabular-nums">
                  {sec.totalOutstanding.toLocaleString()} / {sec.totalAuthorized.toLocaleString()}
                </p>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── TA Admin Dashboard ───────────────────────────────────────────────────────

function TAAdminDashboard({ onNavigate }: { onNavigate: (page: string) => void }) {
  const pendingCount = transfers.filter((t) => t.status === 'pending').length;
  const activeIssuers = issuers.filter((i) => i.status === 'active').length;

  const dotColor = {
    synced: 'bg-green-500',
    behind: 'bg-amber-500',
    down: 'bg-red-500',
  }[blockchainMock.status];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          OA Admin ·{' '}
          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Row 1: Entity Summary Cards */}
      <div className="*:data-[slot=card]:shadow-xs *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:py-4 *:data-[slot=card]:gap-3 grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @4xl/main:grid-cols-4">
        {/* Total Issuers */}
        <Card
          className="@container/card cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
          onClick={() => onNavigate('issuers')}
        >
          <CardHeader>
            <CardDescription>Total Issuers</CardDescription>
            <CardTitle className="text-xl @[250px]/card:text-2xl font-semibold tabular-nums">
              {issuers.length}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <TrendingUp className="size-3" />
                +12.5%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="text-xs text-muted-foreground">
            {activeIssuers} active this quarter
          </CardFooter>
        </Card>

        {/* Total Securities */}
        <Card
          className="@container/card cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
          onClick={() => onNavigate('securities')}
        >
          <CardHeader>
            <CardDescription>Total Securities</CardDescription>
            <CardTitle className="text-xl @[250px]/card:text-2xl font-semibold tabular-nums">
              {securities.length}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <TrendingUp className="size-3" />
                +8.3%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="text-xs text-muted-foreground">
            {securities.filter((s) => s.status === 'active').length} active across all issuers
          </CardFooter>
        </Card>

        {/* Total Investors */}
        <Card
          className="@container/card cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
          onClick={() => onNavigate('investors')}
        >
          <CardHeader>
            <CardDescription>Total Investors</CardDescription>
            <CardTitle className="text-xl @[250px]/card:text-2xl font-semibold tabular-nums">
              {investors.length.toLocaleString()}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <TrendingUp className="size-3" />
                +5.1%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="text-xs text-muted-foreground">
            {investors.filter((i) => i.status === 'active').length} active investors
          </CardFooter>
        </Card>

        {/* Pending Transfers */}
        <Card
          className={cn(
            '@container/card cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5',
            pendingCount > 0 && 'bg-amber-50/80 dark:bg-amber-950/20',
            pendingCount > 10 && 'border-amber-400',
          )}
          onClick={() => onNavigate('transfers')}
        >
          <CardHeader>
            <CardDescription>Pending Transfers</CardDescription>
            <CardTitle
              className={cn(
                'text-xl @[250px]/card:text-2xl font-semibold tabular-nums',
                pendingCount > 0 ? 'text-amber-600' : 'text-green-600',
              )}
            >
              {pendingCount}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <TrendingDown className="size-3" />
                -2.4%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="text-xs text-muted-foreground">
            {pendingCount === 0 ? 'No items awaiting review' : `${pendingCount} awaiting review`}
          </CardFooter>
        </Card>
      </div>

      {/* Row 2: Performance & Health Cards */}
      <div className="*:data-[slot=card]:shadow-xs *:data-[slot=card]:py-4 *:data-[slot=card]:gap-3 grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @4xl/main:grid-cols-4">
        {/* Turnaround % */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Routine Turnaround</CardDescription>
            <CardTitle className="text-xs text-muted-foreground font-normal">
              Current month · SEC Rule 17Ad-2
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center pb-4">
            <TurnaroundGauge
              pct={turnaroundMock.pct}
              total={turnaroundMock.total}
              onTime={turnaroundMock.onTime}
            />
          </CardContent>
        </Card>

        {/* Open Inquiry Cases */}
        <Card
          className={cn(
            '@container/card cursor-pointer transition-all hover:shadow-md',
            inquiryMock.open + inquiryMock.inProgress > 0 && 'bg-orange-50/80 dark:bg-orange-950/20',
            inquiryMock.open + inquiryMock.inProgress > 5 && 'bg-orange-100 dark:bg-orange-950/40',
          )}
        >
          <CardHeader>
            <CardDescription>Open Inquiry Cases</CardDescription>
            <CardTitle className="text-3xl @[250px]/card:text-4xl font-bold tabular-nums">
              {inquiryMock.open + inquiryMock.inProgress}
            </CardTitle>
            <CardAction>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                <MessageSquare className="h-4 w-4" />
              </div>
            </CardAction>
          </CardHeader>
          <CardFooter className="text-sm text-muted-foreground">
            {inquiryMock.open + inquiryMock.inProgress === 0
              ? '✓ No open cases'
              : `${inquiryMock.open} open · ${inquiryMock.inProgress} in progress`}
          </CardFooter>
        </Card>

        {/* Overdue Inquiry Cases */}
        <Card
          className={cn(
            '@container/card relative cursor-pointer transition-all hover:shadow-md',
            inquiryMock.overdue > 0 && 'bg-red-50/80 dark:bg-red-950/20',
          )}
        >
          {inquiryMock.overdue > 0 && (
            <span className="absolute top-4 right-4 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          )}
          <CardHeader>
            <CardDescription>Overdue Inquiries</CardDescription>
            <CardTitle
              className={cn(
                'text-3xl @[250px]/card:text-4xl font-bold tabular-nums',
                inquiryMock.overdue > 0 && 'text-red-600',
              )}
            >
              {inquiryMock.overdue}
            </CardTitle>
            <CardAction>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </CardAction>
          </CardHeader>
          <CardFooter className="text-sm text-muted-foreground">
            {inquiryMock.overdue === 0
              ? '✓ All inquiries on track'
              : 'past SLA — Rule 17Ad-5'}
          </CardFooter>
        </Card>

        {/* Blockchain Listener Health */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Blockchain Listener</CardDescription>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <span className={cn('h-3 w-3 rounded-full shrink-0', dotColor)} />
              {blockchainMock.chain}
            </CardTitle>
            <CardAction>
              <Badge
                variant="outline"
                className={cn(
                  'text-xs capitalize',
                  blockchainMock.status === 'synced'
                    ? 'border-green-300 text-green-700 bg-green-50 dark:bg-green-950/40 dark:text-green-400'
                    : blockchainMock.status === 'behind'
                      ? 'border-amber-300 text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400'
                      : 'border-red-300 text-red-700 bg-red-50 dark:bg-red-950/40 dark:text-red-400',
                )}
              >
                {blockchainMock.status}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-0.5">
            <p className="font-mono text-xs text-muted-foreground tabular-nums">
              Block #{blockchainMock.lastBlock.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">{relativeTime(blockchainMock.lastUpdatedAt)}</p>
          </CardFooter>
        </Card>
      </div>

      {/* Row 3: Reconciliation Cards */}
      <div className="grid grid-cols-1 gap-4 @4xl/main:grid-cols-2">
        <MshfReconciliationCard onNavigate={onNavigate} />
        <OverissuanceCard onNavigate={onNavigate} />
      </div>

      {/* Row 4: Activity Feed */}
      <ActivityFeed onNavigate={onNavigate} />

      {/* Row 5: Quick Actions */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Quick Actions
        </p>
        <div className="grid grid-cols-1 gap-3 @xl/main:grid-cols-2 @4xl/main:grid-cols-4">
          {/* Approve Transfers */}
          <button
            type="button"
            onClick={() => onNavigate('transfers')}
            className="group flex items-start gap-3 rounded-lg border bg-card p-4 text-left transition-all hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <CheckSquare className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold">Approve Transfers</span>
                {pendingCount > 0 && (
                  <Badge className="h-5 px-1.5 text-[10px] bg-amber-500 text-white border-0 tabular-nums">
                    {pendingCount}
                  </Badge>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                {pendingCount > 0 ? `${pendingCount} transfers awaiting review` : 'No pending transfers'}
              </p>
            </div>
            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground mt-0.5 transition-transform group-hover:translate-x-0.5" />
          </button>

          {/* Review Inquiries */}
          <button
            type="button"
            onClick={() => onNavigate('inquiries')}
            className="group flex items-start gap-3 rounded-lg border bg-card p-4 text-left transition-all hover:shadow-md hover:border-orange-300 hover:-translate-y-0.5"
          >
            <div
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors group-hover:text-white',
                inquiryMock.overdue > 0
                  ? 'bg-red-100 text-red-600 group-hover:bg-red-600 dark:bg-red-900/30 dark:text-red-400'
                  : 'bg-orange-100 text-orange-600 group-hover:bg-orange-500 dark:bg-orange-900/30 dark:text-orange-400',
              )}
            >
              <MessageSquare className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold">Review Inquiries</span>
                {inquiryMock.overdue > 0 && (
                  <Badge className="h-5 px-1.5 text-[10px] bg-red-500 text-white border-0 tabular-nums">
                    {inquiryMock.overdue} overdue
                  </Badge>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                {inquiryMock.open + inquiryMock.inProgress} open · {inquiryMock.overdue} past SLA
              </p>
            </div>
            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground mt-0.5 transition-transform group-hover:translate-x-0.5" />
          </button>

          {/* Resolve Unmapped Events */}
          <button
            type="button"
            className="group flex items-start gap-3 rounded-lg border bg-card p-4 text-left transition-all hover:shadow-md hover:border-violet-300 hover:-translate-y-0.5"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600 transition-colors group-hover:bg-violet-600 group-hover:text-white dark:bg-violet-900/30 dark:text-violet-400">
              <HelpCircle className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-semibold">Resolve Unmapped Events</span>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                Review blockchain events without a ledger match
              </p>
            </div>
            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground mt-0.5 transition-transform group-hover:translate-x-0.5" />
          </button>

          {/* Export Reports */}
          <button
            type="button"
            onClick={() => onNavigate('reports')}
            className="group flex items-start gap-3 rounded-lg border bg-card p-4 text-left transition-all hover:shadow-md hover:border-blue-300 hover:-translate-y-0.5"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-900/30 dark:text-blue-400">
              <Download className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-semibold">Export Reports</span>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                Generate MSHF, ledger, and compliance reports
              </p>
            </div>
            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground mt-0.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Issuer Admin Dashboard ───────────────────────────────────────────────────

function IssuerAdminDashboard({ onNavigate }: { onNavigate: (page: string) => void }) {
  // Scoped to issuer admin's issuer (mock: ISS-001 — Apex Ventures Inc.)
  const mySecurities = securities.filter((s) => s.issuerId === 'ISS-001');
  const myPending = transfers.filter((t) => t.status === 'pending');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Issuer Admin · Apex Ventures Inc.</p>
      </div>

      {/* Row 1: Scoped Summary Cards */}
      <div className="*:data-[slot=card]:shadow-xs *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:py-4 *:data-[slot=card]:gap-3 grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @4xl/main:grid-cols-4">
        <Card
          className="@container/card cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
          onClick={() => onNavigate('securities')}
        >
          <CardHeader>
            <CardDescription>My Securities</CardDescription>
            <CardTitle className="text-xl @[250px]/card:text-2xl font-semibold tabular-nums">
              {mySecurities.length}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <TrendingUp className="size-3" />
                +8.3%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-xs">
            <div className="flex gap-2 font-medium">
              Portfolio on track <TrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">for your issuer</div>
          </CardFooter>
        </Card>

        <Card
          className="@container/card cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
          onClick={() => onNavigate('investors')}
        >
          <CardHeader>
            <CardDescription>My Investors</CardDescription>
            <CardTitle className="text-xl @[250px]/card:text-2xl font-semibold tabular-nums">
              {investors.filter((i) => i.status === 'active').length}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <TrendingUp className="size-3" />
                +5.1%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-xs">
            <div className="flex gap-2 font-medium">
              Active holders increasing <TrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">with active holdings in your securities</div>
          </CardFooter>
        </Card>

        <Card
          className={cn(
            '@container/card cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5',
            myPending.length > 0 && 'bg-amber-50/80 dark:bg-amber-950/20',
          )}
          onClick={() => onNavigate('transfers')}
        >
          <CardHeader>
            <CardDescription>Pending Transfers</CardDescription>
            <CardTitle
              className={cn(
                'text-xl @[250px]/card:text-2xl font-semibold tabular-nums',
                myPending.length > 0 ? 'text-amber-600' : 'text-green-600',
              )}
            >
              {myPending.length}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <TrendingDown className="size-3" />
                -2.4%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-xs">
            <div className="flex gap-2 font-medium">
              {myPending.length === 0 ? (
                <>All transfers clear <TrendingUp className="size-4 text-green-600" /></>
              ) : (
                <>Fewer pending than last month <TrendingDown className="size-4" /></>
              )}
            </div>
            <div className="text-muted-foreground">
              {myPending.length === 0 ? 'No items awaiting review' : `${myPending.length} awaiting review`}
            </div>
          </CardFooter>
        </Card>

        {/* Turnaround Gauge */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Routine Turnaround</CardDescription>
            <CardTitle className="text-xs text-muted-foreground font-normal">Current month</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center pb-3">
            <TurnaroundGauge
              pct={turnaroundMock.pct}
              total={turnaroundMock.total}
              onTime={turnaroundMock.onTime}
            />
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Activity Feed */}
      <ActivityFeed onNavigate={onNavigate} />

      {/* Row 3: Quick Actions */}
      <div className="flex gap-3">
        <Button
          className="gap-2 bg-green-600 hover:bg-green-700"
          onClick={() => onNavigate('transfers')}
        >
          <CheckSquare className="h-4 w-4" />
          Approve Transfers
          {myPending.length > 0 && (
            <Badge className="ml-1 h-5 min-w-5 px-1.5 text-[10px] bg-white/20 text-white border-0 tabular-nums">
              {myPending.length}
            </Badge>
          )}
        </Button>
        <Button
          variant="outline"
          className="gap-2 border-green-300 hover:border-green-400 text-green-700 hover:text-green-800"
          onClick={() => onNavigate('cap-table')}
        >
          <BarChart2 className="h-4 w-4" />
          View Cap Table
        </Button>
      </div>
    </div>
  );
}

// ─── Operator Dashboard ───────────────────────────────────────────────────────

function OperatorDashboard({ onNavigate }: { onNavigate: (page: string) => void }) {
  // All transfers shown as "mine" in mock
  const myTransfers = transfers;
  const pendingCount = myTransfers.filter((t) => t.status === 'pending').length;
  const approvedCount = myTransfers.filter((t) => ['approved', 'completed'].includes(t.status)).length;
  const rejectedCount = myTransfers.filter((t) => t.status === 'rejected').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Operator · Your submitted transfers</p>
      </div>

      {/* Row 1: Transfer Summary Cards */}
      <div className="*:data-[slot=card]:shadow-xs *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:py-4 *:data-[slot=card]:gap-3 grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @4xl/main:grid-cols-4">
        <Card
          className="@container/card cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
          onClick={() => onNavigate('transfers')}
        >
          <CardHeader>
            <CardDescription>My Transfers</CardDescription>
            <CardTitle className="text-xl @[250px]/card:text-2xl font-semibold tabular-nums">
              {myTransfers.length}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <TrendingUp className="size-3" />
                +14.2%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-xs">
            <div className="flex gap-2 font-medium">
              Transfer activity up <TrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">all time submissions</div>
          </CardFooter>
        </Card>

        <Card
          className={cn(
            '@container/card cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5',
            pendingCount > 0 && 'bg-amber-50/80 dark:bg-amber-950/20',
          )}
          onClick={() => onNavigate('transfers')}
        >
          <CardHeader>
            <CardDescription>Pending</CardDescription>
            <CardTitle
              className={cn(
                'text-xl @[250px]/card:text-2xl font-semibold tabular-nums',
                pendingCount > 0 && 'text-amber-600',
              )}
            >
              {pendingCount}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <TrendingDown className="size-3" />
                -3.1%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-xs">
            <div className="flex gap-2 font-medium">
              Fewer pending <TrendingDown className="size-4" />
            </div>
            <div className="text-muted-foreground">awaiting approval</div>
          </CardFooter>
        </Card>

        <Card
          className="@container/card cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
          onClick={() => onNavigate('transfers')}
        >
          <CardHeader>
            <CardDescription>Approved</CardDescription>
            <CardTitle className="text-xl @[250px]/card:text-2xl font-semibold tabular-nums text-green-600">
              {approvedCount}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <TrendingUp className="size-3" />
                +3.1%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-xs">
            <div className="flex gap-2 font-medium">
              Approval rate improving <TrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">approved or completed</div>
          </CardFooter>
        </Card>

        <Card
          className={cn(
            '@container/card cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5',
            rejectedCount > 0 && 'bg-red-50/80 dark:bg-red-950/20',
          )}
          onClick={() => onNavigate('transfers')}
        >
          <CardHeader>
            <CardDescription>Rejected</CardDescription>
            <CardTitle
              className={cn(
                'text-xl @[250px]/card:text-2xl font-semibold tabular-nums',
                rejectedCount > 0 && 'text-red-600',
              )}
            >
              {rejectedCount}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <TrendingDown className="size-3" />
                -1.2%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-xs">
            <div className="flex gap-2 font-medium">
              {rejectedCount === 0 ? (
                <>None rejected <TrendingUp className="size-4 text-green-600" /></>
              ) : (
                <>Fewer rejections <TrendingDown className="size-4" /></>
              )}
            </div>
            <div className="text-muted-foreground">vs prior period</div>
          </CardFooter>
        </Card>
      </div>

      {/* Row 2: Recent Transfers Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base">Recent Transfers</CardTitle>
            <CardDescription>Your last {myTransfers.length} submitted transfers</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="text-xs" onClick={() => onNavigate('transfers')}>
            View All →
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Transfer ID</TableHead>
                <TableHead className="text-xs">Security</TableHead>
                <TableHead className="text-xs">From</TableHead>
                <TableHead className="text-xs">To</TableHead>
                <TableHead className="text-xs text-right">Amount</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs">Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myTransfers.slice(0, 10).map((t) => (
                <TableRow key={t.id} className="cursor-pointer hover:bg-muted/30">
                  <TableCell className="font-mono text-xs text-blue-600 underline">{t.id}</TableCell>
                  <TableCell className="text-xs font-medium truncate max-w-[120px]">
                    {t.securityName}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground truncate max-w-[100px]">
                    {t.fromInvestorName}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground truncate max-w-[100px]">
                    {t.toInvestorName}
                  </TableCell>
                  <TableCell className="text-xs text-right font-medium tabular-nums">
                    {t.totalAmount > 0 ? `$${t.totalAmount.toLocaleString()}` : '—'}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={t.status} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{t.submittedAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Row 3: Primary CTA */}
      <div className="flex justify-center">
        <Button
          size="lg"
          className="gap-2 h-12 px-8 text-base bg-[#E65100] hover:bg-[#BF360C] text-white"
          onClick={() => onNavigate('transfer-requests')}
        >
          <PlusCircle className="h-5 w-5" />
          New Transfer Request
        </Button>
      </div>
    </div>
  );
}

// ─── Auditor Dashboard ────────────────────────────────────────────────────────

function AuditorDashboard({ onNavigate }: { onNavigate: (page: string) => void }) {
  const trendConfig: ChartConfig = {
    pct: { label: 'Turnaround %' },
  };

  const quickLinks = [
    { label: 'View MSHF', icon: Database, page: 'ledger' },
    { label: 'View Control Book', icon: BookOpen, page: 'ledger' },
    { label: 'View Turnaround Reports', icon: Clock, page: 'reports' },
    { label: 'View Audit Ledger', icon: ScrollText, page: 'ledger' },
    { label: 'Export All Reports', icon: Download, page: 'reports' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Auditor · Read-only regulatory view ·{' '}
          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Row 1: Static System Overview Cards */}
      <div className="*:data-[slot=card]:shadow-xs *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:py-4 *:data-[slot=card]:gap-3 grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @4xl/main:grid-cols-4">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Issuers</CardDescription>
            <CardTitle className="text-xl @[250px]/card:text-2xl font-semibold tabular-nums">
              {issuers.length}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-xs">
            <div className="flex gap-2 font-medium">System-wide coverage</div>
            <div className="text-muted-foreground">read-only regulatory view</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Securities</CardDescription>
            <CardTitle className="text-xl @[250px]/card:text-2xl font-semibold tabular-nums">
              {securities.length}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-xs">
            <div className="flex gap-2 font-medium">All registered securities</div>
            <div className="text-muted-foreground">across all issuers</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Investors</CardDescription>
            <CardTitle className="text-xl @[250px]/card:text-2xl font-semibold tabular-nums">
              {investors.length}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-xs">
            <div className="flex gap-2 font-medium">Registered investor registry</div>
            <div className="text-muted-foreground">system-wide total</div>
          </CardFooter>
        </Card>

        {/* Total Transfers — clickable for auditor */}
        <Card
          className="@container/card cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
          onClick={() => onNavigate('transfers')}
        >
          <CardHeader>
            <CardDescription>Total Transfers (All Time)</CardDescription>
            <CardTitle className="text-xl @[250px]/card:text-2xl font-semibold tabular-nums">
              {transfers.length.toLocaleString()}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <TrendingUp className="size-3" />
                +9.7%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-xs">
            <div className="flex gap-2 font-medium">
              Transfer volume rising <TrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">click to view full audit trail</div>
          </CardFooter>
        </Card>
      </div>

      {/* Row 2: Regulatory Performance */}
      <div className="grid grid-cols-1 gap-4 @4xl/main:grid-cols-3">
        {/* Turnaround Gauge */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Routine Turnaround %</CardTitle>
            <CardDescription>Current month · Rule 17Ad-2</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pb-4">
            <TurnaroundGauge
              pct={turnaroundMock.pct}
              total={turnaroundMock.total}
              onTime={turnaroundMock.onTime}
            />
            <p className="mt-2 text-xs text-muted-foreground text-center">
              Based on {turnaroundMock.total} routine items this month
            </p>
          </CardContent>
        </Card>

        {/* 6-Month Trend Chart — spans 2 cols */}
        <Card className="@4xl/main:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">6-Month Turnaround Trend</CardTitle>
            <CardDescription>Monthly % — SEC 90% threshold (Rule 17Ad-2)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={trendConfig} className="h-[200px] w-full">
              <BarChart
                data={sixMonthTrend}
                margin={{ top: 20, right: 32, bottom: 4, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" width={36} />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload as (typeof sixMonthTrend)[0];
                    return (
                      <div className="rounded-lg border bg-background px-3 py-2 text-xs shadow-sm">
                        <p className="font-semibold mb-0.5">{label}</p>
                        {d.inProgress ? (
                          <p className="text-muted-foreground">In progress — {d.pct}% so far</p>
                        ) : (
                          <p className="text-muted-foreground">
                            {d.pct}% · {d.onTime}/{d.total} on time
                          </p>
                        )}
                      </div>
                    );
                  }}
                />
                <ReferenceLine
                  y={90}
                  stroke="hsl(0 84% 60%)"
                  strokeDasharray="5 3"
                  label={{
                    value: 'SEC 90%',
                    position: 'right',
                    fontSize: 10,
                    fill: 'hsl(0 84% 60%)',
                  }}
                />
                <Bar dataKey="pct" radius={[3, 3, 0, 0]}>
                  {sixMonthTrend.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={
                        entry.inProgress
                          ? 'hsl(var(--muted-foreground))'
                          : entry.pct >= 90
                            ? 'hsl(142 76% 36%)'
                            : 'hsl(0 84% 60%)'
                      }
                      fillOpacity={entry.inProgress ? 0.4 : 1}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
            <p className="text-[10px] text-muted-foreground mt-1">* Feb is in progress — bar shown at partial opacity</p>
          </CardContent>
        </Card>
      </div>

      {/* MSHF Reconciliation */}
      <MshfReconciliationCard onNavigate={onNavigate} />

      {/* Row 3: Quick Access Links */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Quick Access
        </p>
        <div className="grid grid-cols-1 gap-2 @xl/main:grid-cols-2 @4xl/main:grid-cols-5">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.label}
                type="button"
                onClick={() => onNavigate(link.page)}
                className="flex items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-purple-50 dark:hover:bg-purple-950/30 w-full"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <span className="flex-1 text-xs font-medium">{link.label}</span>
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main DashboardPage ───────────────────────────────────────────────────────

interface DashboardPageProps {
  role: UserRole;
  onNavigate: (page: string) => void;
}

export function DashboardPage({ role, onNavigate }: DashboardPageProps) {
  switch (role) {
    case 'oa-admin':
      return <TAAdminDashboard onNavigate={onNavigate} />;
    case 'issuer-admin':
      return <IssuerAdminDashboard onNavigate={onNavigate} />;
    case 'operator':
      return <OperatorDashboard onNavigate={onNavigate} />;
    case 'auditor':
      return <AuditorDashboard onNavigate={onNavigate} />;
    default:
      return <TAAdminDashboard onNavigate={onNavigate} />;
  }
}
