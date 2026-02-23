'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle, Edit, FileText, Plus, Shield, ShieldCheck } from 'lucide-react';

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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { complianceProfiles } from '../../_data/mock-data';
import { getPermissions } from '../../_data/permissions';
import { StatusBadge } from '../shared/status-badge';
import { StatsCard } from '../shared/stats-card';
import type { ComplianceProfile, UserRole } from '../../_types';

interface CompliancePageProps {
  role: UserRole;
}

const filings = [
  { id: 'FIL-001', issuer: 'Apex Ventures Inc.', type: 'Form D', filed: '2022-04-01', status: 'accepted', exemption: '506(b)' },
  { id: 'FIL-002', issuer: 'Meridian Biotech LLC', type: 'Form D', filed: '2021-08-15', status: 'accepted', exemption: '506(c)' },
  { id: 'FIL-003', issuer: 'Solaris Energy Corp', type: 'Form D Amendment', filed: '2024-02-01', status: 'pending', exemption: 'Reg A+' },
  { id: 'FIL-004', issuer: 'Apex Ventures Inc.', type: 'Blue Sky Notice', filed: '2024-07-10', status: 'accepted', exemption: '506(b)' },
];

export function CompliancePage({ role }: CompliancePageProps) {
  const perms = getPermissions(role);
  const [selectedProfile, setSelectedProfile] = useState<ComplianceProfile | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [filingOpen, setFilingOpen] = useState(false);

  const compliantCount = complianceProfiles.filter((p) => p.status === 'compliant').length;
  const reviewCount = complianceProfiles.filter((p) => p.status === 'review-needed').length;
  const nonCompliantCount = complianceProfiles.filter((p) => p.status === 'non-compliant').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Compliance & Filing</h1>
          <p className="text-muted-foreground text-sm">SEC exemption profiles and regulatory filings</p>
        </div>
        {perms.canEditCompliance && (
          <Button size="sm" className="gap-2" onClick={() => setFilingOpen(true)}>
            <Plus className="h-4 w-4" />
            New Filing
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-3">
        <StatsCard title="Compliant" value={compliantCount} icon={ShieldCheck} accent="green" />
        <StatsCard title="Review Needed" value={reviewCount} icon={AlertTriangle} accent="orange" />
        <StatsCard title="Non-Compliant" value={nonCompliantCount} icon={Shield} accent="red" />
      </div>

      {/* Compliance Profiles */}
      <div>
        <h2 className="text-base font-semibold mb-3">Issuer Compliance Profiles</h2>
        <div className="grid gap-4">
          {complianceProfiles.map((profile) => {
            const investorUtilization = Math.round((profile.currentInvestors / profile.maxInvestors) * 100);
            return (
              <Card key={profile.issuerId} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{profile.issuerName}</CardTitle>
                      <CardDescription className="mt-0.5">
                        {profile.exemption} · {profile.currentInvestors} / {profile.maxInvestors} investors
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={profile.status} />
                      {perms.canEditCompliance && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => { setSelectedProfile(profile); setDetailOpen(true); }}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm @lg/main:grid-cols-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Exemption</p>
                      <p className="font-medium">{profile.exemption}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Form D Filed</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        {profile.formDFiled ? (
                          <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-3.5 w-3.5 text-yellow-600" />
                        )}
                        <span className="font-medium">{profile.formDFiled ? 'Yes' : 'Pending'}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Last Reviewed</p>
                      <p className="font-medium">{profile.lastReviewed}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Next Review</p>
                      <p className="font-medium">{profile.nextReview}</p>
                    </div>
                  </div>

                  {/* Investor utilization */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Investor capacity</span>
                      <span>{investorUtilization}% utilized</span>
                    </div>
                    <Progress value={investorUtilization} className="h-1.5" />
                  </div>

                  {/* Restrictions */}
                  {profile.restrictions.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1.5">Restrictions</p>
                      <div className="flex flex-wrap gap-1.5">
                        {profile.restrictions.map((r) => (
                          <Badge key={r} variant="secondary" className="text-[10px]">{r}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Blue Sky States */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1.5">Blue Sky States</p>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.blueSkyStates.map((s) => (
                        <Badge key={s} variant="outline" className="text-[10px] font-mono">{s}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Filings */}
      <div>
        <h2 className="text-base font-semibold mb-3">Recent Filings</h2>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Filing ID</TableHead>
                  <TableHead>Issuer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Exemption</TableHead>
                  <TableHead>Filed Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filings.map((filing) => (
                  <TableRow key={filing.id}>
                    <TableCell className="font-mono text-xs">{filing.id}</TableCell>
                    <TableCell className="text-sm">{filing.issuer}</TableCell>
                    <TableCell className="text-sm">{filing.type}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{filing.exemption}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{filing.filed}</TableCell>
                    <TableCell>
                      <StatusBadge status={filing.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs">
                        <FileText className="h-3 w-3" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* New Filing Dialog */}
      <Dialog open={filingOpen} onOpenChange={setFilingOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Submit New Filing</DialogTitle>
            <DialogDescription>File a new SEC form or notice</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
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
              <Label>Filing Type</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="form-d">Form D (Initial)</SelectItem>
                  <SelectItem value="form-d-amend">Form D (Amendment)</SelectItem>
                  <SelectItem value="blue-sky">Blue Sky Notice</SelectItem>
                  <SelectItem value="reg-a">Reg A+ Offering Circular</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Filing Date</Label>
              <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFilingOpen(false)}>Cancel</Button>
            <Button onClick={() => setFilingOpen(false)}>Submit Filing</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
