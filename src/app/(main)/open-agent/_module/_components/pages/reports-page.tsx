'use client';

import { useState } from 'react';
import { BarChart2, Download, FileBarChart, FileText, TrendingUp } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatsCard } from '../shared/stats-card';
import type { UserRole } from '../../_types';

const monthlyTransferData = [
  { month: 'Jul', approved: 8, rejected: 1, completed: 6 },
  { month: 'Aug', approved: 10, rejected: 2, completed: 9 },
  { month: 'Sep', approved: 12, rejected: 1, completed: 11 },
  { month: 'Oct', approved: 9, rejected: 3, completed: 8 },
  { month: 'Nov', approved: 14, rejected: 0, completed: 13 },
  { month: 'Dec', approved: 11, rejected: 2, completed: 10 },
  { month: 'Jan', approved: 13, rejected: 1, completed: 11 },
];

const investorGrowthData = [
  { month: 'Jul', individual: 58, institutional: 12, trust: 8 },
  { month: 'Aug', individual: 62, institutional: 13, trust: 9 },
  { month: 'Sep', individual: 65, institutional: 14, trust: 9 },
  { month: 'Oct', individual: 70, institutional: 15, trust: 10 },
  { month: 'Nov', individual: 75, institutional: 15, trust: 10 },
  { month: 'Dec', individual: 79, institutional: 16, trust: 11 },
  { month: 'Jan', individual: 83, institutional: 17, trust: 11 },
];

const savedReports = [
  { id: 'RPT-001', name: 'Q4 2024 Transfer Summary', type: 'Transfer', date: '2025-01-05', status: 'ready' },
  { id: 'RPT-002', name: 'Annual Cap Table Report', type: 'Cap Table', date: '2025-01-10', status: 'ready' },
  { id: 'RPT-003', name: 'KYC Status Report', type: 'Compliance', date: '2025-01-12', status: 'ready' },
  { id: 'RPT-004', name: 'Investor Growth Q4', type: 'Investor', date: '2025-01-08', status: 'ready' },
  { id: 'RPT-005', name: 'Ledger Audit Trail 2024', type: 'Ledger', date: '2025-01-15', status: 'pending' },
];

interface ReportsPageProps {
  role: UserRole;
}

export function ReportsPage({ role }: ReportsPageProps) {
  const [period, setPeriod] = useState('6m');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground text-sm">Analytics and exportable reports for the platform</p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last Month</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" variant="outline" className="gap-2 h-8 text-xs">
            <Download className="h-3.5 w-3.5" />
            Export All
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-4">
        <StatsCard title="Transfers Processed" value="66" icon={BarChart2} accent="blue" trend={{ value: 14.2 }} />
        <StatsCard title="Approval Rate" value="92%" accent="green" trend={{ value: 3.1 }} />
        <StatsCard title="New Investors" value="25" accent="purple" trend={{ value: 8.3 }} />
        <StatsCard title="Total Share Value" value="$18.3M" icon={TrendingUp} accent="orange" trend={{ value: 22.5 }} />
      </div>

      <Tabs defaultValue="transfers">
        <TabsList>
          <TabsTrigger value="transfers">Transfers</TabsTrigger>
          <TabsTrigger value="investors">Investors</TabsTrigger>
          <TabsTrigger value="saved">Saved Reports</TabsTrigger>
        </TabsList>

        {/* Transfers Chart */}
        <TabsContent value="transfers" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Transfer Activity</CardTitle>
              <CardDescription>Monthly transfer approval and completion breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyTransferData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="approved" name="Approved" fill="var(--chart-2)" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="completed" name="Completed" fill="var(--chart-1)" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="rejected" name="Rejected" fill="var(--chart-5)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-4 @lg/main:grid-cols-3">
            {[
              { label: 'Average Approval Time', value: '2.3 days', sub: 'from submission to approval' },
              { label: 'Average Processing Time', value: '4.1 days', sub: 'from approval to completion' },
              { label: 'Rejection Rate', value: '8.4%', sub: 'avg across all issuers' },
            ].map((item) => (
              <Card key={item.label}>
                <CardHeader className="pb-2">
                  <CardDescription>{item.label}</CardDescription>
                  <CardTitle className="text-2xl">{item.value}</CardTitle>
                  <p className="text-xs text-muted-foreground">{item.sub}</p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Investors Chart */}
        <TabsContent value="investors" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Investor Growth</CardTitle>
              <CardDescription>Cumulative investors by type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={investorGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="individual" name="Individual" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="institutional" name="Institutional" stroke="var(--chart-2)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="trust" name="Trust" stroke="var(--chart-3)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Saved Reports */}
        <TabsContent value="saved" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Saved Reports</CardTitle>
                <CardDescription>Generated reports ready for download</CardDescription>
              </div>
              <Button size="sm" className="gap-2 text-xs">
                <FileBarChart className="h-3.5 w-3.5" />
                Generate New
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {savedReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{report.name}</p>
                      <p className="text-xs text-muted-foreground">{report.type} · {report.date}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        report.status === 'ready'
                          ? 'text-green-700 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400'
                          : 'text-yellow-700 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20'
                      }
                    >
                      {report.status}
                    </Badge>
                    {report.status === 'ready' && (
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
