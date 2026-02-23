'use client';

import { useState } from 'react';
import { Building2, Plus, Search, ExternalLink, MoreHorizontal, Edit, Eye } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { issuers } from '../../_data/mock-data';
import { getPermissions } from '../../_data/permissions';
import { StatusBadge } from '../shared/status-badge';
import { StatsCard } from '../shared/stats-card';
import type { Issuer, UserRole } from '../../_types';

interface IssuersPageProps {
  role: UserRole;
  onNavigate: (page: string) => void;
}

export function IssuersPage({ role, onNavigate }: IssuersPageProps) {
  const perms = getPermissions(role);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedIssuer, setSelectedIssuer] = useState<Issuer | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const filtered = issuers.filter((i) => {
    const matchesSearch =
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.ein.includes(search) ||
      i.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || i.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = issuers.filter((i) => i.status === 'active').length;
  const pendingCount = issuers.filter((i) => i.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Issuers</h1>
          <p className="text-muted-foreground text-sm">Manage all registered issuers on the platform</p>
        </div>
        {perms.canCreateIssuer && (
          <Button size="sm" className="gap-2" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Issuer
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-3">
        <StatsCard title="Total Issuers" value={issuers.length} icon={Building2} accent="blue" />
        <StatsCard title="Active" value={activeCount} description="issuers" accent="green" trend={{ value: 12.5 }} />
        <StatsCard title="Pending Review" value={pendingCount} accent="orange" />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 @sm/main:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, EIN, or ID..."
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Issuer</TableHead>
                <TableHead>EIN</TableHead>
                <TableHead>State</TableHead>
                <TableHead className="text-right">Securities</TableHead>
                <TableHead className="text-right">Investors</TableHead>
                <TableHead className="text-right">Shares Issued</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((issuer) => (
                <TableRow key={issuer.id} className="group">
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{issuer.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{issuer.id}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{issuer.ein}</TableCell>
                  <TableCell className="text-sm">{issuer.state}</TableCell>
                  <TableCell className="text-right text-sm">{issuer.securitiesCount}</TableCell>
                  <TableCell className="text-right text-sm">{issuer.investorsCount.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-sm font-medium">
                    {issuer.totalSharesIssued.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={issuer.status} />
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
                          onClick={() => { setSelectedIssuer(issuer); setEditOpen(true); }}
                          className="gap-2 text-sm"
                        >
                          <Eye className="h-3.5 w-3.5" /> View Details
                        </DropdownMenuItem>
                        {perms.canEditIssuer && (
                          <DropdownMenuItem className="gap-2 text-sm">
                            <Edit className="h-3.5 w-3.5" /> Edit
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => onNavigate('securities')}
                          className="gap-2 text-sm"
                        >
                          <ExternalLink className="h-3.5 w-3.5" /> View Securities
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8 text-sm">
                    No issuers found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Issuer Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Issuer</DialogTitle>
            <DialogDescription>Register a new issuer on the Open Agent platform</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="issuerName">Legal Name</Label>
                <Input id="issuerName" placeholder="Acme Corporation Inc." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ein">EIN</Label>
                <Input id="ein" placeholder="XX-XXXXXXX" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State of Incorporation</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DE">Delaware</SelectItem>
                    <SelectItem value="NV">Nevada</SelectItem>
                    <SelectItem value="WY">Wyoming</SelectItem>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="TX">Texas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Name</Label>
                <Input id="contactName" placeholder="John Smith" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input id="contactEmail" type="email" placeholder="contact@company.com" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="123 Main St, City, State ZIP" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={() => setCreateOpen(false)}>Create Issuer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Issuer Detail Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedIssuer?.name}</DialogTitle>
            <DialogDescription>Issuer ID: {selectedIssuer?.id}</DialogDescription>
          </DialogHeader>
          {selectedIssuer && (
            <div className="grid gap-3 py-2 text-sm">
              {[
                ['EIN', selectedIssuer.ein],
                ['State', selectedIssuer.state],
                ['Status', <StatusBadge key="s" status={selectedIssuer.status} />],
                ['Contact', selectedIssuer.contactName],
                ['Email', selectedIssuer.contactEmail],
                ['Address', selectedIssuer.address],
                ['Securities', selectedIssuer.securitiesCount],
                ['Investors', selectedIssuer.investorsCount.toLocaleString()],
                ['Shares Issued', selectedIssuer.totalSharesIssued.toLocaleString()],
                ['Created', selectedIssuer.createdAt],
              ].map(([label, value]) => (
                <div key={String(label)} className="flex justify-between border-b pb-2 last:border-0">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">{value as React.ReactNode}</span>
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
