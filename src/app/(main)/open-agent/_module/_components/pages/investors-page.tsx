'use client';

import { useState } from 'react';
import { Plus, Search, Users, Shield, MoreHorizontal, Eye, Ban } from 'lucide-react';

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
import { investors } from '../../_data/mock-data';
import { getPermissions } from '../../_data/permissions';
import { StatusBadge } from '../shared/status-badge';
import { StatsCard } from '../shared/stats-card';
import type { Investor, UserRole } from '../../_types';

interface InvestorsPageProps {
  role: UserRole;
}

export function InvestorsPage({ role }: InvestorsPageProps) {
  const perms = getPermissions(role);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const filtered = investors.filter((inv) => {
    const matchesSearch =
      inv.name.toLowerCase().includes(search.toLowerCase()) ||
      inv.email.toLowerCase().includes(search.toLowerCase()) ||
      inv.id.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || inv.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const typeLabels: Record<string, string> = {
    individual: 'Individual',
    institutional: 'Institutional',
    trust: 'Trust',
    'broker-dealer': 'Broker-Dealer',
  };

  const kycColors: Record<string, string> = {
    approved: 'text-green-600',
    pending: 'text-yellow-600',
    rejected: 'text-red-600',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Investors</h1>
          <p className="text-muted-foreground text-sm">Registered investor registry</p>
        </div>
        {perms.canCreateIssuer && (
          <Button size="sm" className="gap-2" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Investor
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-4">
        <StatsCard title="Total Investors" value={investors.length} icon={Users} accent="blue" />
        <StatsCard title="Active" value={investors.filter((i) => i.status === 'active').length} accent="green" trend={{ value: 5.1 }} />
        <StatsCard title="KYC Pending" value={investors.filter((i) => i.kyc === 'pending').length} accent="orange" />
        <StatsCard title="Accredited" value={investors.filter((i) => i.accredited).length} accent="purple" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="individual">Individual</SelectItem>
            <SelectItem value="institutional">Institutional</SelectItem>
            <SelectItem value="trust">Trust</SelectItem>
            <SelectItem value="broker-dealer">Broker-Dealer</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Investor</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Accredited</TableHead>
                <TableHead>KYC</TableHead>
                <TableHead className="text-right">Total Shares</TableHead>
                <TableHead className="text-right">Portfolio Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((inv) => (
                <TableRow key={inv.id} className="group">
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{inv.name}</p>
                      <p className="text-xs text-muted-foreground">{inv.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{typeLabels[inv.type]}</TableCell>
                  <TableCell>
                    {inv.accredited ? (
                      <Badge className="gap-1 text-xs bg-green-100 text-green-700 border-0 hover:bg-green-100">
                        <Shield className="h-3 w-3" /> Yes
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs text-muted-foreground">No</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs font-medium capitalize ${kycColors[inv.kyc]}`}>
                      {inv.kyc}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-sm font-medium">
                    {inv.totalShares.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    {inv.totalValue > 0 ? `$${inv.totalValue.toLocaleString()}` : '—'}
                  </TableCell>
                  <TableCell><StatusBadge status={inv.status} /></TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => { setSelectedInvestor(inv); setDetailOpen(true); }}
                          className="gap-2 text-sm"
                        >
                          <Eye className="h-3.5 w-3.5" /> View Profile
                        </DropdownMenuItem>
                        {perms.canManageHolds && inv.status === 'active' && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 text-sm text-destructive focus:text-destructive">
                              <Ban className="h-3.5 w-3.5" /> Suspend
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
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8 text-sm">
                    No investors found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Investor Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{selectedInvestor?.name}</DialogTitle>
            <DialogDescription>{selectedInvestor?.id}</DialogDescription>
          </DialogHeader>
          {selectedInvestor && (
            <div className="space-y-3 py-2 text-sm">
              {[
                ['Email', selectedInvestor.email],
                ['Phone', selectedInvestor.phone],
                ['Type', typeLabels[selectedInvestor.type]],
                ['Tax ID', selectedInvestor.taxId],
                ['Accredited', selectedInvestor.accredited ? 'Yes' : 'No'],
                ['CRD Number', selectedInvestor.crdNumber ?? '—'],
                ['KYC Status', <StatusBadge key="k" status={selectedInvestor.kyc} />],
                ['Account Status', <StatusBadge key="s" status={selectedInvestor.status} />],
                ['Total Shares', selectedInvestor.totalShares.toLocaleString()],
                ['Portfolio Value', `$${selectedInvestor.totalValue.toLocaleString()}`],
                ['Address', selectedInvestor.address],
                ['Member Since', selectedInvestor.createdAt],
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

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Add New Investor</DialogTitle>
            <DialogDescription>Register a new investor profile</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label>Full Legal Name</Label>
                <Input placeholder="First Last" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="investor@email.com" />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input placeholder="+1 (XXX) XXX-XXXX" />
              </div>
              <div className="space-y-2">
                <Label>Investor Type</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="institutional">Institutional</SelectItem>
                    <SelectItem value="trust">Trust</SelectItem>
                    <SelectItem value="broker-dealer">Broker-Dealer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Accredited Investor</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Address</Label>
                <Input placeholder="123 Main St, City, State ZIP" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={() => setCreateOpen(false)}>Create Investor</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
