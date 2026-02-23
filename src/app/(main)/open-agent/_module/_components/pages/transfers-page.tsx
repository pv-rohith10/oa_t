'use client';

import { useState } from 'react';
import { ArrowLeftRight, CheckCircle, Search, XCircle, MoreHorizontal, Eye, Plus } from 'lucide-react';

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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { transfers } from '../../_data/mock-data';
import { getPermissions } from '../../_data/permissions';
import { StatusBadge } from '../shared/status-badge';
import { StatsCard } from '../shared/stats-card';
import type { Transfer, UserRole } from '../../_types';

interface TransfersPageProps {
  role: UserRole;
}

export function TransfersPage({ role }: TransfersPageProps) {
  const perms = getPermissions(role);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = transfers.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.securityName.toLowerCase().includes(search.toLowerCase()) ||
      t.fromInvestorName.toLowerCase().includes(search.toLowerCase()) ||
      t.toInvestorName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = transfers.filter((t) => t.status === 'pending').length;
  const approvedCount = transfers.filter((t) => t.status === 'approved').length;
  const completedCount = transfers.filter((t) => t.status === 'completed').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transfers</h1>
          <p className="text-muted-foreground text-sm">
            {perms.canApproveTransfer
              ? 'Review and approve share transfer requests'
              : 'View all share transfer records'}
          </p>
        </div>
        {perms.canCreateTransfer && !perms.canApproveTransfer && (
          <Button size="sm" className="gap-2" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            New Transfer
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-4">
        <StatsCard title="Total Transfers" value={transfers.length} icon={ArrowLeftRight} accent="blue" />
        <StatsCard title="Pending" value={pendingCount} accent="orange" description="awaiting action" />
        <StatsCard title="Approved" value={approvedCount} accent="purple" />
        <StatsCard title="Completed" value={completedCount} accent="green" />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 @sm/main:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by ID, security, or investor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full @sm/main:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Security</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Shares</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow key={t.id} className="group">
                  <TableCell className="font-mono text-xs">{t.id}</TableCell>
                  <TableCell>
                    <p className="text-sm font-medium">{t.securityName}</p>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{t.fromInvestorName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{t.toInvestorName}</TableCell>
                  <TableCell><StatusBadge status={t.type} /></TableCell>
                  <TableCell className="text-right text-sm font-medium">{t.shares.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-sm">
                    {t.totalAmount > 0 ? `$${t.totalAmount.toLocaleString()}` : '—'}
                  </TableCell>
                  <TableCell><StatusBadge status={t.status} /></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{t.submittedAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => { setSelectedTransfer(t); setDetailOpen(true); }}
                          className="gap-2 text-sm"
                        >
                          <Eye className="h-3.5 w-3.5" /> View Details
                        </DropdownMenuItem>
                        {perms.canApproveTransfer && t.status === 'pending' && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => { setSelectedTransfer(t); setApproveOpen(true); }}
                              className="gap-2 text-sm text-green-600 focus:text-green-600"
                            >
                              <CheckCircle className="h-3.5 w-3.5" /> Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => { setSelectedTransfer(t); setRejectOpen(true); }}
                              className="gap-2 text-sm text-destructive focus:text-destructive"
                            >
                              <XCircle className="h-3.5 w-3.5" /> Reject
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-muted-foreground py-8 text-sm">
                    No transfers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Transfer Details</DialogTitle>
            <DialogDescription>{selectedTransfer?.id}</DialogDescription>
          </DialogHeader>
          {selectedTransfer && (
            <div className="space-y-3 py-2 text-sm">
              {[
                ['Security', selectedTransfer.securityName],
                ['From', selectedTransfer.fromInvestorName],
                ['To', selectedTransfer.toInvestorName],
                ['Type', <StatusBadge key="t" status={selectedTransfer.type} />],
                ['Shares', selectedTransfer.shares.toLocaleString()],
                ['Price/Share', selectedTransfer.pricePerShare > 0 ? `$${selectedTransfer.pricePerShare}` : 'N/A'],
                ['Total Amount', selectedTransfer.totalAmount > 0 ? `$${selectedTransfer.totalAmount.toLocaleString()}` : 'N/A'],
                ['Status', <StatusBadge key="s" status={selectedTransfer.status} />],
                ['Submitted', selectedTransfer.submittedAt],
                ['Completed', selectedTransfer.completedAt ?? '—'],
                ['Approved By', selectedTransfer.approvedBy ?? '—'],
                ['Notes', selectedTransfer.notes ?? '—'],
              ].map(([label, value]) => (
                <div key={String(label)} className="flex justify-between border-b pb-2 last:border-0 gap-4">
                  <span className="text-muted-foreground shrink-0">{label}</span>
                  <span className="font-medium text-right">{value as React.ReactNode}</span>
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Approve Transfer</DialogTitle>
            <DialogDescription>
              Approve transfer of {selectedTransfer?.shares.toLocaleString()} shares ({selectedTransfer?.id})
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-lg border bg-muted/30 p-4 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Security</span>
                <span className="font-medium">{selectedTransfer?.securityName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shares</span>
                <span className="font-medium">{selectedTransfer?.shares.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">From → To</span>
                <span className="font-medium text-right">
                  {selectedTransfer?.fromInvestorName} → {selectedTransfer?.toInvestorName}
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              By approving, you confirm this transfer complies with SEC regulations and all KYC/AML requirements have been met.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveOpen(false)}>Cancel</Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => setApproveOpen(false)}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirm Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Reject Transfer</DialogTitle>
            <DialogDescription>Provide a reason for rejecting {selectedTransfer?.id}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <Label>Rejection Reason</Label>
            <Textarea
              placeholder="e.g., Missing KYC documentation, compliance hold..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { setRejectReason(''); setRejectOpen(false); }}>
              <XCircle className="h-4 w-4 mr-2" />
              Reject Transfer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
