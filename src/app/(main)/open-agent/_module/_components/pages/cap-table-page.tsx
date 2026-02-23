'use client';

import { useState } from 'react';
import { Download, Search, Table2 } from 'lucide-react';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { capTableEntries, capTableChartData } from '../../_data/mock-data';
import { StatsCard } from '../shared/stats-card';
import type { UserRole } from '../../_types';

interface CapTablePageProps {
  role: UserRole;
}

export function CapTablePage({ role }: CapTablePageProps) {
  const [search, setSearch] = useState('');
  const [securityFilter, setSecurityFilter] = useState('all');

  const uniqueSecurities = Array.from(new Set(capTableEntries.map((e) => e.securityName)));

  const filtered = capTableEntries.filter((e) => {
    const matchesSearch =
      e.investorName.toLowerCase().includes(search.toLowerCase()) ||
      e.securityName.toLowerCase().includes(search.toLowerCase());
    const matchesSecurity = securityFilter === 'all' || e.securityName === securityFilter;
    return matchesSearch && matchesSecurity;
  });

  const totalShares = filtered.reduce((sum, e) => sum + e.shares, 0);
  const totalValue = filtered.reduce((sum, e) => sum + e.value, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cap Table</h1>
          <p className="text-muted-foreground text-sm">Capitalization table — all shareholders and ownership</p>
        </div>
        <Button size="sm" variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-3">
        <StatsCard title="Total Entries" value={capTableEntries.length} icon={Table2} accent="blue" />
        <StatsCard
          title="Total Shares"
          value={capTableEntries.reduce((s, e) => s + e.shares, 0).toLocaleString()}
          accent="purple"
        />
        <StatsCard
          title="Total Portfolio Value"
          value={`$${(capTableEntries.reduce((s, e) => s + e.value, 0) / 1_000_000).toFixed(2)}M`}
          accent="green"
        />
      </div>

      <Tabs defaultValue="table">
        <TabsList>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="chart">Chart View</TabsTrigger>
        </TabsList>

        {/* Table View */}
        <TabsContent value="table" className="space-y-4 mt-4">
          <div className="flex flex-col gap-3 @sm/main:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by investor or security..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={securityFilter} onValueChange={setSecurityFilter}>
              <SelectTrigger className="w-full @sm/main:w-56">
                <SelectValue placeholder="Filter by security" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Securities</SelectItem>
                {uniqueSecurities.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Investor</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Security</TableHead>
                    <TableHead className="text-right">Shares</TableHead>
                    <TableHead className="text-right">Ownership %</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Certs</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((entry, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <p className="font-medium text-sm">{entry.investorName}</p>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{entry.investorType}</TableCell>
                      <TableCell className="text-sm">{entry.securityName}</TableCell>
                      <TableCell className="text-right text-sm font-medium tabular-nums">
                        {entry.shares.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${Math.min(entry.percentage, 100)}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-10 text-right">{entry.percentage}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        ${entry.value.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{entry.issueDate}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {entry.certificateIds.length}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length > 0 && (
                    <TableRow className="bg-muted/30 font-semibold">
                      <TableCell colSpan={3} className="text-sm">Totals</TableCell>
                      <TableCell className="text-right text-sm">{totalShares.toLocaleString()}</TableCell>
                      <TableCell />
                      <TableCell className="text-right text-sm">${totalValue.toLocaleString()}</TableCell>
                      <TableCell colSpan={2} />
                    </TableRow>
                  )}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-8 text-sm">
                        No entries found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Chart View */}
        <TabsContent value="chart" className="mt-4">
          <div className="grid grid-cols-1 gap-4 @lg/main:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ownership by Investor</CardTitle>
                <CardDescription>Share of total outstanding shares</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={capTableChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={110}
                      innerRadius={55}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) => `${value}%`}
                      labelLine={false}
                    >
                      {capTableChartData.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [`${value}%`, 'Ownership']}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top Shareholders</CardTitle>
                <CardDescription>Ranked by ownership percentage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {capTableChartData.map((item, idx) => (
                    <div key={item.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground text-xs w-4">{idx + 1}.</span>
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <span className="font-semibold">{item.value}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${item.value}%`, backgroundColor: item.fill }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
