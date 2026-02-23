'use client';

import { useState } from 'react';
import { Lock, Plus, Search, Unlock, MoreHorizontal } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { holds, lockups } from '../../_data/mock-data';
import { getPermissions } from '../../_data/permissions';
import { StatusBadge } from '../shared/status-badge';
import { StatsCard } from '../shared/stats-card';
import type { UserRole } from '../../_types';

interface HoldsPageProps {
  role: UserRole;
}

export function HoldsPage({ role }: HoldsPageProps) {
  const perms = getPermissions(role);
  const [search, setSearch] = useState('');
  const [placeHoldOpen, setPlaceHoldOpen] = useState(false);

  const activeHolds = holds.filter((h) => h.status === 'active');
  const activeLockups = lockups.filter((l) => l.status === 'active');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Holds & Lockups</h1>
          <p className="text-muted-foreground text-sm">Regulatory holds and lockup agreements on investor shares</p>
        </div>
        {perms.canManageHolds && (
          <Button size="sm" className="gap-2" onClick={() => setPlaceHoldOpen(true)}>
            <Lock className="h-4 w-4" />
            Place Hold
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-4">
        <StatsCard title="Active Holds" value={activeHolds.length} icon={Lock} accent="red" />
        <StatsCard title="Active Lockups" value={activeLockups.length} accent="orange" />
        <StatsCard title="Released Holds" value={holds.filter((h) => h.status === 'released').length} accent="green" />
        <StatsCard
          title="Shares Under Hold"
          value={activeHolds.reduce((s, h) => s + h.shares, 0).toLocaleString()}
          accent="purple"
        />
      </div>

      <Tabs defaultValue="holds">
        <TabsList>
          <TabsTrigger value="holds">Holds ({holds.length})</TabsTrigger>
          <TabsTrigger value="lockups">Lockups ({lockups.length})</TabsTrigger>
        </TabsList>

        {/* Holds Tab */}
        <TabsContent value="holds" className="mt-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by investor or security..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 max-w-sm"
            />
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hold ID</TableHead>
                    <TableHead>Investor</TableHead>
                    <TableHead>Security</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Shares</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Issued By</TableHead>
                    <TableHead>Status</TableHead>
                    {perms.canManageHolds && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {holds
                    .filter((h) => {
                      const s = search.toLowerCase();
                      return !s || h.investorName.toLowerCase().includes(s) || h.securityName.toLowerCase().includes(s);
                    })
                    .map((hold) => (
                      <TableRow key={hold.id} className="group">
                        <TableCell className="font-mono text-xs">{hold.id}</TableCell>
                        <TableCell className="text-sm font-medium">{hold.investorName}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{hold.securityName}</TableCell>
                        <TableCell><StatusBadge status={hold.type} /></TableCell>
                        <TableCell className="text-right text-sm font-medium">{hold.shares.toLocaleString()}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{hold.startDate}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{hold.endDate ?? '—'}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{hold.issuedBy}</TableCell>
                        <TableCell><StatusBadge status={hold.status} /></TableCell>
                        {perms.canManageHolds && (
                          <TableCell className="text-right">
                            {hold.status === 'active' && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100">
                                    <MoreHorizontal className="h-3.5 w-3.5" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem className="gap-2 text-sm text-green-600 focus:text-green-600">
                                    <Unlock className="h-3.5 w-3.5" /> Release Hold
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Hold reasons */}
          <div className="grid grid-cols-1 gap-3 @lg/main:grid-cols-3">
            {holds.map((hold) => (
              <Card key={hold.id} className="border-l-4" style={{
                borderLeftColor: hold.type === 'regulatory' ? '#ef4444' : hold.type === 'legal' ? '#f97316' : '#3b82f6'
              }}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{hold.investorName}</CardTitle>
                    <StatusBadge status={hold.status} />
                  </div>
                  <CardDescription className="text-xs">{hold.securityName} · {hold.shares.toLocaleString()} shares</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{hold.reason}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Lockups Tab */}
        <TabsContent value="lockups" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lockup ID</TableHead>
                    <TableHead>Investor</TableHead>
                    <TableHead>Security</TableHead>
                    <TableHead className="text-right">Shares</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Start</TableHead>
                    <TableHead>End</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lockups.map((lockup) => (
                    <TableRow key={lockup.id}>
                      <TableCell className="font-mono text-xs">{lockup.id}</TableCell>
                      <TableCell className="text-sm font-medium">{lockup.investorName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{lockup.securityName}</TableCell>
                      <TableCell className="text-right text-sm font-medium">{lockup.shares.toLocaleString()}</TableCell>
                      <TableCell className="text-sm">{lockup.lockupDays} days</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{lockup.startDate}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{lockup.endDate}</TableCell>
                      <TableCell><StatusBadge status={lockup.status} /></TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">{lockup.reason}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Place Hold Dialog */}
      <Dialog open={placeHoldOpen} onOpenChange={setPlaceHoldOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Place New Hold</DialogTitle>
            <DialogDescription>Restrict share transfers for a specific investor and security</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Investor</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select investor" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="INV-001">Robert Chambers</SelectItem>
                  <SelectItem value="INV-007">Diana Foster</SelectItem>
                  <SelectItem value="INV-003">Jennifer Patel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Security</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select security" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="SEC-001">Apex Common Stock</SelectItem>
                  <SelectItem value="SEC-002">Apex Series A Preferred</SelectItem>
                  <SelectItem value="SEC-004">Meridian Common Shares</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Hold Type</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regulatory">Regulatory</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                    <SelectItem value="voluntary">Voluntary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Shares to Hold</Label>
                <Input type="number" placeholder="0" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Reason</Label>
              <Textarea placeholder="Reason for placing this hold..." rows={3} />
            </div>
            <div className="space-y-2">
              <Label>End Date (optional)</Label>
              <Input type="date" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPlaceHoldOpen(false)}>Cancel</Button>
            <Button onClick={() => setPlaceHoldOpen(false)}>Place Hold</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
