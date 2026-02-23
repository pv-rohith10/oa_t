'use client';

import { useState } from 'react';
import { Plus, Search, TrendingUp, MoreHorizontal, Eye, Flame } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { securities } from '../../_data/mock-data';
import { getPermissions } from '../../_data/permissions';
import { StatusBadge } from '../shared/status-badge';
import { StatsCard } from '../shared/stats-card';
import type { Security, UserRole } from '../../_types';

interface SecuritiesPageProps {
  role: UserRole;
  onNavigate: (page: string, data?: unknown) => void;
}

export function SecuritiesPage({ role, onNavigate }: SecuritiesPageProps) {
  const perms = getPermissions(role);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedSecurity, setSelectedSecurity] = useState<Security | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const filtered = securities.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.ticker.toLowerCase().includes(search.toLowerCase()) ||
      s.cusip.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || s.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const typeLabels: Record<string, string> = {
    'common-stock': 'Common Stock',
    'preferred-stock': 'Preferred Stock',
    'bond': 'Bond',
    'warrant': 'Warrant',
    'option': 'Option',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Securities</h1>
          <p className="text-muted-foreground text-sm">All securities registered on the platform</p>
        </div>
        {perms.canCreateSecurity && (
          <Button size="sm" className="gap-2" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Issue Security
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-4">
        <StatsCard title="Total Securities" value={securities.length} icon={TrendingUp} accent="purple" />
        <StatsCard title="Common Stock" value={securities.filter((s) => s.type === 'common-stock').length} accent="blue" />
        <StatsCard title="Preferred Stock" value={securities.filter((s) => s.type === 'preferred-stock').length} accent="green" />
        <StatsCard title="Other Types" value={securities.filter((s) => !['common-stock', 'preferred-stock'].includes(s.type)).length} accent="orange" />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 @sm/main:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, ticker, or CUSIP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full @sm/main:w-44">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="common-stock">Common Stock</SelectItem>
            <SelectItem value="preferred-stock">Preferred Stock</SelectItem>
            <SelectItem value="bond">Bond</SelectItem>
            <SelectItem value="warrant">Warrant</SelectItem>
            <SelectItem value="option">Option</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Security</TableHead>
                <TableHead>Issuer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>CUSIP</TableHead>
                <TableHead className="text-right">Authorized</TableHead>
                <TableHead className="text-right">Issued</TableHead>
                <TableHead className="w-[120px]">Utilization</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((sec) => {
                const utilization = Math.round((sec.totalIssued / sec.totalAuthorized) * 100);
                return (
                  <TableRow key={sec.id} className="group">
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{sec.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{sec.ticker}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{sec.issuerName}</TableCell>
                    <TableCell className="text-sm">{typeLabels[sec.type] ?? sec.type}</TableCell>
                    <TableCell className="font-mono text-xs">{sec.cusip}</TableCell>
                    <TableCell className="text-right text-sm">{sec.totalAuthorized.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-sm font-medium">{sec.totalIssued.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Progress value={utilization} className="h-1.5" />
                        <p className="text-[10px] text-muted-foreground">{utilization}%</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={sec.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedSecurity(sec);
                              setDetailOpen(true);
                            }}
                            className="gap-2 text-sm"
                          >
                            <Eye className="h-3.5 w-3.5" /> View Detail
                          </DropdownMenuItem>
                          {perms.canIssueBurn && (
                            <DropdownMenuItem className="gap-2 text-sm text-destructive focus:text-destructive">
                              <Flame className="h-3.5 w-3.5" /> Burn Shares
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground py-8 text-sm">
                    No securities found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Security Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Issue New Security</DialogTitle>
            <DialogDescription>Create a new security class for an issuer</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label>Issuer</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select issuer" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ISS-001">Apex Ventures Inc.</SelectItem>
                    <SelectItem value="ISS-002">Meridian Biotech LLC</SelectItem>
                    <SelectItem value="ISS-003">Solaris Energy Corp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Security Name</Label>
                <Input placeholder="Apex Common Stock" />
              </div>
              <div className="space-y-2">
                <Label>Ticker Symbol</Label>
                <Input placeholder="APEX" />
              </div>
              <div className="space-y-2">
                <Label>Security Type</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="common-stock">Common Stock</SelectItem>
                    <SelectItem value="preferred-stock">Preferred Stock</SelectItem>
                    <SelectItem value="bond">Bond</SelectItem>
                    <SelectItem value="warrant">Warrant</SelectItem>
                    <SelectItem value="option">Option</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Par Value ($)</Label>
                <Input type="number" placeholder="0.001" step="0.001" />
              </div>
              <div className="space-y-2">
                <Label>Total Authorized Shares</Label>
                <Input type="number" placeholder="10,000,000" />
              </div>
              <div className="space-y-2">
                <Label>CUSIP</Label>
                <Input placeholder="XXXXX00XC" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={() => setCreateOpen(false)}>Issue Security</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{selectedSecurity?.name}</DialogTitle>
            <DialogDescription>{selectedSecurity?.ticker} · {selectedSecurity?.cusip}</DialogDescription>
          </DialogHeader>
          {selectedSecurity && (
            <div className="space-y-3 py-2 text-sm">
              {[
                ['ID', selectedSecurity.id],
                ['Issuer', selectedSecurity.issuerName],
                ['Type', typeLabels[selectedSecurity.type]],
                ['Par Value', `$${selectedSecurity.parValue}`],
                ['Total Authorized', selectedSecurity.totalAuthorized.toLocaleString()],
                ['Total Issued', selectedSecurity.totalIssued.toLocaleString()],
                ['Total Outstanding', selectedSecurity.totalOutstanding.toLocaleString()],
                ['Status', <StatusBadge key="s" status={selectedSecurity.status} />],
                ['Created', selectedSecurity.createdAt],
              ].map(([label, value]) => (
                <div key={String(label)} className="flex justify-between border-b pb-2 last:border-0">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">{value as React.ReactNode}</span>
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailOpen(false)}>Close</Button>
            {perms.canEditSecurityDetail && (
              <Button onClick={() => { setDetailOpen(false); onNavigate('security-detail'); }}>
                Full Detail View
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
