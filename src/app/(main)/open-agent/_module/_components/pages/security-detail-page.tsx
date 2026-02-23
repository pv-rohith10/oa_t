'use client';

import { ArrowLeft, Flame, Plus, TrendingUp } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { securities, capTableEntries, ledgerEntries } from '../../_data/mock-data';
import { getPermissions } from '../../_data/permissions';
import { StatsCard } from '../shared/stats-card';
import { StatusBadge } from '../shared/status-badge';
import type { UserRole } from '../../_types';

// Use the first active security as default detail
const security = securities[0];

const issuanceHistory = [
  { month: 'Mar 22', shares: 2_000_000 },
  { month: 'Sep 22', shares: 1_500_000 },
  { month: 'Jan 23', shares: 800_000 },
  { month: 'Jun 23', shares: 500_000 },
  { month: 'Dec 23', shares: 200_000 },
];

interface SecurityDetailPageProps {
  role: UserRole;
  onNavigate: (page: string) => void;
}

export function SecurityDetailPage({ role, onNavigate }: SecurityDetailPageProps) {
  const perms = getPermissions(role);
  const utilization = Math.round((security.totalIssued / security.totalAuthorized) * 100);

  const secCapTable = capTableEntries.filter((e) => e.securityId === security.id);
  const secLedger = ledgerEntries.filter((e) => e.securityId === security.id);

  return (
    <div className="space-y-6">
      {/* Back & Header */}
      <div className="flex items-start gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 mt-1"
          onClick={() => onNavigate('securities')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{security.name}</h1>
            <StatusBadge status={security.status} />
          </div>
          <p className="text-muted-foreground text-sm">
            {security.ticker} · {security.cusip} · {security.issuerName}
          </p>
        </div>
        <div className="flex gap-2">
          {perms.canIssueBurn && (
            <>
              <Button size="sm" variant="outline" className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10">
                <Flame className="h-4 w-4" /> Burn
              </Button>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" /> Issue Shares
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-4">
        <StatsCard
          title="Total Authorized"
          value={security.totalAuthorized.toLocaleString()}
          icon={TrendingUp}
          accent="blue"
        />
        <StatsCard
          title="Total Issued"
          value={security.totalIssued.toLocaleString()}
          description={`${utilization}% utilized`}
          accent="purple"
        />
        <StatsCard
          title="Outstanding"
          value={security.totalOutstanding.toLocaleString()}
          accent="green"
        />
        <StatsCard
          title="Treasury"
          value={(security.totalIssued - security.totalOutstanding).toLocaleString()}
          description="reserved shares"
          accent="orange"
        />
      </div>

      {/* Utilization Bar */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Share Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Issued</span>
              <span>{utilization}% of authorized</span>
            </div>
            <Progress value={utilization} className="h-3" />
            <div className="flex justify-between text-xs">
              <span className="font-medium">{security.totalIssued.toLocaleString()} issued</span>
              <span className="text-muted-foreground">{(security.totalAuthorized - security.totalIssued).toLocaleString()} available</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="holders">Cap Table</TabsTrigger>
          {perms.canAccessLedger && <TabsTrigger value="ledger">Ledger</TabsTrigger>}
          <TabsTrigger value="issuance">Issuance History</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 gap-4 @lg/main:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-base">Security Details</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                {[
                  ['Security ID', security.id],
                  ['Issuer', security.issuerName],
                  ['Type', security.type.replace(/-/g, ' ')],
                  ['Par Value', `$${security.parValue}`],
                  ['CUSIP', security.cusip],
                  ['Ticker', security.ticker],
                  ['Created', security.createdAt],
                  ['Status', <StatusBadge key="s" status={security.status} />],
                ].map(([label, value]) => (
                  <div key={String(label)} className="flex justify-between border-b pb-2 last:border-0">
                    <span className="text-muted-foreground capitalize">{label}</span>
                    <span className="font-medium capitalize">{value as React.ReactNode}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Share Distribution</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'Issued to Investors', value: security.totalOutstanding, total: security.totalIssued, color: 'bg-primary' },
                  { label: 'Treasury Shares', value: security.totalIssued - security.totalOutstanding, total: security.totalIssued, color: 'bg-muted-foreground' },
                  { label: 'Available to Issue', value: security.totalAuthorized - security.totalIssued, total: security.totalAuthorized, color: 'bg-muted' },
                ].map((item) => (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-medium">{item.value.toLocaleString()}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.color}`}
                        style={{ width: `${(item.value / item.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Cap Table Tab */}
        <TabsContent value="holders" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Shareholders</CardTitle>
              <CardDescription>{secCapTable.length} registered holders</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Investor</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Shares</TableHead>
                    <TableHead className="text-right">Ownership %</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                    <TableHead>Issue Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {secCapTable.map((entry, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium text-sm">{entry.investorName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{entry.investorType}</TableCell>
                      <TableCell className="text-right text-sm">{entry.shares.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-sm font-medium">{entry.percentage}%</TableCell>
                      <TableCell className="text-right text-sm">${entry.value.toLocaleString()}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{entry.issueDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ledger Tab */}
        {perms.canAccessLedger && (
          <TabsContent value="ledger" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ledger Entries</CardTitle>
                <CardDescription>All recorded transactions for this security</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Investor</TableHead>
                      <TableHead className="text-right">Shares</TableHead>
                      <TableHead className="text-right">Balance Before</TableHead>
                      <TableHead className="text-right">Balance After</TableHead>
                      <TableHead>Reference</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {secLedger.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(entry.timestamp).toLocaleDateString()}
                        </TableCell>
                        <TableCell><StatusBadge status={entry.type} /></TableCell>
                        <TableCell className="text-sm">{entry.investorName}</TableCell>
                        <TableCell className={`text-right text-sm font-medium ${entry.shares > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {entry.shares > 0 ? '+' : ''}{entry.shares.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-sm">{entry.balanceBefore.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-sm font-semibold">{entry.balanceAfter.toLocaleString()}</TableCell>
                        <TableCell className="font-mono text-xs">{entry.reference}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Issuance History Tab */}
        <TabsContent value="issuance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Issuance History</CardTitle>
              <CardDescription>Shares issued over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={issuanceHistory}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`} />
                  <Tooltip
                    formatter={(v: number) => [v.toLocaleString(), 'Shares']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="shares" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
