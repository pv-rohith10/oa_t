'use client';

import { useState } from 'react';
import { BookOpen, Download, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ledgerEntries } from '../../_data/mock-data';
import { StatsCard } from '../shared/stats-card';
import { StatusBadge } from '../shared/status-badge';
import type { UserRole } from '../../_types';

interface LedgerPageProps {
  role: UserRole;
}

export function LedgerPage({ role }: LedgerPageProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [securityFilter, setSecurityFilter] = useState('all');

  const uniqueSecurities = Array.from(new Set(ledgerEntries.map((e) => e.securityName)));

  const filtered = ledgerEntries.filter((e) => {
    const matchesSearch =
      e.id.toLowerCase().includes(search.toLowerCase()) ||
      e.investorName.toLowerCase().includes(search.toLowerCase()) ||
      e.reference.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || e.type === typeFilter;
    const matchesSecurity = securityFilter === 'all' || e.securityName === securityFilter;
    return matchesSearch && matchesType && matchesSecurity;
  });

  const totalIssuances = ledgerEntries.filter((e) => e.type === 'issuance').length;
  const totalTransfers = ledgerEntries.filter((e) => e.type === 'transfer').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ledger</h1>
          <p className="text-muted-foreground text-sm">
            Immutable record of all share transactions — read-only audit trail
          </p>
        </div>
        <Button size="sm" variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-4">
        <StatsCard title="Total Entries" value={ledgerEntries.length} icon={BookOpen} accent="blue" />
        <StatsCard title="Issuances" value={totalIssuances} accent="green" />
        <StatsCard title="Transfers" value={totalTransfers} accent="purple" />
        <StatsCard title="Adjustments" value={ledgerEntries.filter((e) => e.type === 'adjustment').length} accent="orange" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by ID, investor, or reference..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Entry Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="issuance">Issuance</SelectItem>
            <SelectItem value="transfer">Transfer</SelectItem>
            <SelectItem value="burn">Burn</SelectItem>
            <SelectItem value="adjustment">Adjustment</SelectItem>
          </SelectContent>
        </Select>
        <Select value={securityFilter} onValueChange={setSecurityFilter}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Security" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Securities</SelectItem>
            {uniqueSecurities.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Ledger Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ledger ID</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Security</TableHead>
                <TableHead>Investor</TableHead>
                <TableHead className="text-right">Shares</TableHead>
                <TableHead className="text-right">Balance Before</TableHead>
                <TableHead className="text-right">Balance After</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Approved By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((entry) => (
                <TableRow key={entry.id} className="font-mono text-xs">
                  <TableCell className="text-xs">{entry.id}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(entry.timestamp).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={entry.type} />
                  </TableCell>
                  <TableCell className="text-xs font-sans">{entry.securityName}</TableCell>
                  <TableCell className="text-xs font-sans">{entry.investorName}</TableCell>
                  <TableCell
                    className={`text-right text-xs font-semibold ${
                      entry.shares > 0 ? 'text-green-600' : entry.shares < 0 ? 'text-red-600' : ''
                    }`}
                  >
                    {entry.shares > 0 ? '+' : ''}{entry.shares.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {entry.balanceBefore.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-xs font-medium">
                    {entry.balanceAfter.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-xs">{entry.reference}</TableCell>
                  <TableCell className="text-xs font-sans text-muted-foreground">{entry.approvedBy}</TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-muted-foreground py-8 text-sm">
                    No ledger entries found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Integrity Notice */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-900/20 p-3 flex items-center gap-3">
        <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
        <p className="text-xs text-blue-800 dark:text-blue-300">
          <span className="font-medium">Immutable Ledger</span> — All entries are cryptographically hashed and timestamped.
          No modifications are permitted after confirmation. SEC-compliant audit trail maintained.
        </p>
      </div>
    </div>
  );
}
