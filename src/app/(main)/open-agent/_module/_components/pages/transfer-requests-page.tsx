'use client';

import { useState } from 'react';
import { CheckCircle, Eye, FilePlus, Search, XCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { transferRequests } from '../../_data/mock-data';
import { getPermissions } from '../../_data/permissions';
import { StatusBadge } from '../shared/status-badge';
import { StatsCard } from '../shared/stats-card';
import type { TransferRequest, UserRole } from '../../_types';

interface TransferRequestsPageProps {
  role: UserRole;
}

export function TransferRequestsPage({ role }: TransferRequestsPageProps) {
  const perms = getPermissions(role);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<TransferRequest | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const filtered = transferRequests.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.investorName.toLowerCase().includes(search.toLowerCase()) ||
      r.securityName.toLowerCase().includes(search.toLowerCase()) ||
      r.toName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = transferRequests.filter((r) => r.status === 'pending').length;
  const underReviewCount = transferRequests.filter((r) => r.status === 'under-review').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transfer Requests</h1>
          <p className="text-muted-foreground text-sm">Incoming transfer requests from investors</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-4">
        <StatsCard title="Total Requests" value={transferRequests.length} icon={FilePlus} accent="blue" />
        <StatsCard title="Pending" value={pendingCount} accent="orange" />
        <StatsCard title="Under Review" value={underReviewCount} accent="purple" />
        <StatsCard title="Approved" value={transferRequests.filter((r) => r.status === 'approved').length} accent="green" />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 @sm/main:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by ID, investor, or security..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full @sm/main:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="under-review">Under Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>From Investor</TableHead>
                <TableHead>Security</TableHead>
                <TableHead>Transfer To</TableHead>
                <TableHead className="text-right">Shares</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((req) => (
                <TableRow key={req.id} className="group">
                  <TableCell className="font-mono text-xs">{req.id}</TableCell>
                  <TableCell className="text-sm font-medium">{req.investorName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{req.securityName}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{req.toName}</p>
                      <p className="text-xs text-muted-foreground">{req.toEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-sm font-medium">{req.shares.toLocaleString()}</TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[120px] truncate">{req.reason}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">{req.documents.length} docs</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{req.submittedAt}</TableCell>
                  <TableCell><StatusBadge status={req.status} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => { setSelectedRequest(req); setDetailOpen(true); }}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      {perms.canApproveTransfer && (req.status === 'pending' || req.status === 'under-review') && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => { setSelectedRequest(req); setApproveOpen(true); }}
                          >
                            <CheckCircle className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => { setSelectedRequest(req); setRejectOpen(true); }}
                          >
                            <XCircle className="h-3.5 w-3.5" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-muted-foreground py-8 text-sm">
                    No transfer requests found.
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
            <DialogTitle>Request Details</DialogTitle>
            <DialogDescription>{selectedRequest?.id}</DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-3 py-2 text-sm">
              {[
                ['From Investor', selectedRequest.investorName],
                ['Security', selectedRequest.securityName],
                ['Transfer To', selectedRequest.toName],
                ['Recipient Email', selectedRequest.toEmail],
                ['Shares', selectedRequest.shares.toLocaleString()],
                ['Reason', selectedRequest.reason],
                ['Status', <StatusBadge key="s" status={selectedRequest.status} />],
                ['Submitted', selectedRequest.submittedAt],
                ['Reviewed By', selectedRequest.reviewedBy ?? '—'],
                ['Documents', selectedRequest.documents.join(', ')],
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
            <DialogTitle>Approve Transfer Request</DialogTitle>
            <DialogDescription>This will initiate a transfer for {selectedRequest?.shares.toLocaleString()} shares</DialogDescription>
          </DialogHeader>
          <div className="py-3 text-sm">
            <p className="text-muted-foreground">
              Approving <span className="font-medium text-foreground">{selectedRequest?.id}</span> will create a transfer from{' '}
              <span className="font-medium text-foreground">{selectedRequest?.investorName}</span> to{' '}
              <span className="font-medium text-foreground">{selectedRequest?.toName}</span>.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveOpen(false)}>Cancel</Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => setApproveOpen(false)}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Reject Transfer Request</DialogTitle>
            <DialogDescription>Provide a reason for rejection</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <Label>Rejection Reason</Label>
            <Textarea
              placeholder="e.g., Insufficient documentation..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { setRejectReason(''); setRejectOpen(false); }}>
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
