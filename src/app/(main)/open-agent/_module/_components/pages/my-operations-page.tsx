'use client';

import { ArrowLeftRight, CheckCircle, ClipboardList, Clock, FileText, TrendingUp, XCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { transfers, transferRequests, securities } from '../../_data/mock-data';
import { StatusBadge } from '../shared/status-badge';
import { StatsCard } from '../shared/stats-card';
import type { UserRole } from '../../_types';

// Issuer Admin scoped to ISS-001 (Apex Ventures)
const MY_ISSUER_ID = 'ISS-001';
const MY_ISSUER_SECURITIES = ['SEC-001', 'SEC-002', 'SEC-003'];

interface MyOperationsPageProps {
  role: UserRole;
  onNavigate: (page: string) => void;
}

export function MyOperationsPage({ role, onNavigate }: MyOperationsPageProps) {
  const mySecurities = securities.filter((s) => s.issuerId === MY_ISSUER_ID);
  const myTransfers = transfers.filter((t) => MY_ISSUER_SECURITIES.includes(t.securityId));
  const myRequests = transferRequests.filter((r) => MY_ISSUER_SECURITIES.includes(r.securityId));

  const pendingTransfers = myTransfers.filter((t) => t.status === 'pending');
  const pendingRequests = myRequests.filter((r) => r.status === 'pending' || r.status === 'under-review');
  const completedTransfers = myTransfers.filter((t) => t.status === 'completed');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Operations</h1>
        <p className="text-muted-foreground text-sm">
          Apex Ventures Inc. · Operations overview scoped to your issuer
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-4">
        <StatsCard
          title="My Securities"
          value={mySecurities.length}
          icon={TrendingUp}
          accent="blue"
        />
        <StatsCard
          title="Pending Transfers"
          value={pendingTransfers.length}
          icon={Clock}
          accent="orange"
          description="awaiting action"
        />
        <StatsCard
          title="Pending Requests"
          value={pendingRequests.length}
          icon={ClipboardList}
          accent="purple"
        />
        <StatsCard
          title="Completed (30d)"
          value={completedTransfers.length}
          icon={CheckCircle}
          accent="green"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => onNavigate('securities')}
            >
              <TrendingUp className="h-4 w-4" />
              Manage Securities
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => onNavigate('transfers')}
            >
              <ArrowLeftRight className="h-4 w-4" />
              View Transfers
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => onNavigate('cap-table')}
            >
              <FileText className="h-4 w-4" />
              Cap Table
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => onNavigate('reports')}
            >
              <ClipboardList className="h-4 w-4" />
              Reports
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="transfers">
        <TabsList>
          <TabsTrigger value="transfers">My Transfers ({myTransfers.length})</TabsTrigger>
          <TabsTrigger value="requests">My Requests ({myRequests.length})</TabsTrigger>
          <TabsTrigger value="securities">My Securities ({mySecurities.length})</TabsTrigger>
        </TabsList>

        {/* Transfers Tab */}
        <TabsContent value="transfers" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Security</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead className="text-right">Shares</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myTransfers.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-mono text-xs">{t.id}</TableCell>
                      <TableCell className="text-sm">{t.securityName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{t.fromInvestorName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{t.toInvestorName}</TableCell>
                      <TableCell className="text-right text-sm font-medium">{t.shares.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-sm">
                        {t.totalAmount > 0 ? `$${t.totalAmount.toLocaleString()}` : '—'}
                      </TableCell>
                      <TableCell><StatusBadge status={t.status} /></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{t.submittedAt}</TableCell>
                    </TableRow>
                  ))}
                  {myTransfers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-6 text-sm">
                        No transfers for your securities.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Requests Tab */}
        <TabsContent value="requests" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Investor</TableHead>
                    <TableHead>Security</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead className="text-right">Shares</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myRequests.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-mono text-xs">{r.id}</TableCell>
                      <TableCell className="text-sm font-medium">{r.investorName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{r.securityName}</TableCell>
                      <TableCell className="text-sm">{r.toName}</TableCell>
                      <TableCell className="text-right text-sm font-medium">{r.shares.toLocaleString()}</TableCell>
                      <TableCell><StatusBadge status={r.status} /></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{r.submittedAt}</TableCell>
                    </TableRow>
                  ))}
                  {myRequests.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-6 text-sm">
                        No transfer requests for your securities.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Securities Tab */}
        <TabsContent value="securities" className="mt-4">
          <div className="grid gap-4">
            {mySecurities.map((sec) => {
              const utilization = Math.round((sec.totalIssued / sec.totalAuthorized) * 100);
              return (
                <Card key={sec.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{sec.name}</CardTitle>
                        <CardDescription>{sec.ticker} · {sec.cusip}</CardDescription>
                      </div>
                      <StatusBadge status={sec.status} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Authorized</p>
                        <p className="font-semibold">{sec.totalAuthorized.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Issued</p>
                        <p className="font-semibold">{sec.totalIssued.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Outstanding</p>
                        <p className="font-semibold">{sec.totalOutstanding.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Issuance utilized</span>
                        <span>{utilization}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${utilization}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
