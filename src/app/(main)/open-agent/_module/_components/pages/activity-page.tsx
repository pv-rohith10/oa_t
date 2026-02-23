'use client';

import { useState } from 'react';
import { Activity, Download, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { activityLogs } from '../../_data/mock-data';
import { StatsCard } from '../shared/stats-card';
import type { UserRole } from '../../_types';

interface ActivityPageProps {
  role: UserRole;
}

const actionTypes = Array.from(new Set(activityLogs.map((l) => l.action)));
const entityTypes = Array.from(new Set(activityLogs.map((l) => l.entityType)));

const roleColors: Record<string, string> = {
  'OA Admin': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Issuer Admin': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'Operator': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'Auditor': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
};

export function ActivityPage({ role }: ActivityPageProps) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');

  const filtered = activityLogs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.entityId.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || log.userRole === roleFilter;
    const matchesEntity = entityFilter === 'all' || log.entityType === entityFilter;
    return matchesSearch && matchesRole && matchesEntity;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Activity Tracking</h1>
          <p className="text-muted-foreground text-sm">Audit log of all user actions on the platform</p>
        </div>
        <Button size="sm" variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Log
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-4">
        <StatsCard title="Total Events" value={activityLogs.length} icon={Activity} accent="blue" />
        <StatsCard title="Today" value={1} accent="green" />
        <StatsCard title="This Week" value={activityLogs.length} accent="purple" />
        <StatsCard title="Users Active" value={4} accent="orange" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search actions, users, or entities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="OA Admin">OA Admin</SelectItem>
            <SelectItem value="Issuer Admin">Issuer Admin</SelectItem>
            <SelectItem value="Operator">Operator</SelectItem>
            <SelectItem value="Auditor">Auditor</SelectItem>
          </SelectContent>
        </Select>
        <Select value={entityFilter} onValueChange={setEntityFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Entity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Entities</SelectItem>
            {entityTypes.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Activity Timeline / Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[10px] font-semibold">
                        {log.userName.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <span className="text-sm font-medium">{log.userName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${roleColors[log.userRole] ?? 'bg-gray-100 text-gray-600'}`}>
                      {log.userRole}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm font-medium">{log.action}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-xs font-medium">{log.entityType}</p>
                      <p className="text-[10px] font-mono text-muted-foreground">{log.entityId}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[260px] truncate">
                    {log.details}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{log.ipAddress}</TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8 text-sm">
                    No activity found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* SEC Compliance Notice */}
      <div className="rounded-lg border border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-900/20 p-3">
        <p className="text-xs text-green-800 dark:text-green-300">
          <span className="font-medium">SEC Rule 17a-4 Compliant</span> — All activity logs are stored in write-once, read-many (WORM) format
          and retained for a minimum of 7 years in accordance with SEC electronic records requirements.
        </p>
      </div>
    </div>
  );
}
