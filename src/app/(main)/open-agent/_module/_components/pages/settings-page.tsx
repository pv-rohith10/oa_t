'use client';

import { useState } from 'react';
import { Bell, Globe, Key, Save, Settings, Shield, Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { UserRole } from '../../_types';

interface SettingsPageProps {
  role: UserRole;
}

export function SettingsPage({ role }: SettingsPageProps) {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [auditExport, setAuditExport] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);
  const [autoApprove, setAutoApprove] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const platformUsers = [
    { name: 'Sarah Mitchell', role: 'OA Admin', email: 'smitchell@openagent.io', status: 'active' },
    { name: 'Tom Bradley', role: 'Operator', email: 'tbradley@openagent.io', status: 'active' },
    { name: 'Priya Nair', role: 'Auditor', email: 'pnair@openagent.io', status: 'active' },
    { name: 'James Park', role: 'Issuer Admin', email: 'jpark@meridianbio.com', status: 'active' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground text-sm">Platform configuration and preferences</p>
        </div>
        <Button size="sm" className="gap-2" onClick={handleSave}>
          <Save className="h-4 w-4" />
          {saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="users">Platform Users</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Config</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="mt-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Platform Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Platform Name</Label>
                    <Input defaultValue="Open Agent Transfer Services" />
                  </div>
                  <div className="space-y-2">
                    <Label>Primary Jurisdiction</Label>
                    <Select defaultValue="US">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States (SEC)</SelectItem>
                        <SelectItem value="EU">European Union (ESMA)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Default Transfer Approval Window</Label>
                    <Select defaultValue="48">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24">24 hours</SelectItem>
                        <SelectItem value="48">48 hours</SelectItem>
                        <SelectItem value="72">72 hours</SelectItem>
                        <SelectItem value="168">7 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select defaultValue="ET">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ET">Eastern Time (ET)</SelectItem>
                        <SelectItem value="CT">Central Time (CT)</SelectItem>
                        <SelectItem value="PT">Pacific Time (PT)</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Auto-approve small transfers</p>
                    <p className="text-xs text-muted-foreground">Automatically approve transfers under 1,000 shares</p>
                  </div>
                  <Switch checked={autoApprove} onCheckedChange={setAutoApprove} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  key: 'email',
                  label: 'Email Notifications',
                  description: 'Receive email alerts for pending transfers, approvals, and KYC updates',
                  checked: emailNotifications,
                  onChange: setEmailNotifications,
                },
                {
                  key: 'sms',
                  label: 'SMS Alerts',
                  description: 'Critical alerts via SMS (requires phone number)',
                  checked: smsAlerts,
                  onChange: setSmsAlerts,
                },
                {
                  key: 'audit',
                  label: 'Audit Log Digest',
                  description: 'Weekly digest of all platform activity',
                  checked: auditExport,
                  onChange: setAuditExport,
                },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <Switch checked={item.checked} onCheckedChange={item.onChange} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="text-sm font-medium">Two-Factor Authentication (2FA)</p>
                  <p className="text-xs text-muted-foreground">Required for all OA Admin and Operator users</p>
                </div>
                <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium">Session Configuration</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Session Timeout</Label>
                    <Select defaultValue="30">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="240">4 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Max Failed Login Attempts</Label>
                    <Select defaultValue="5">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 attempts</SelectItem>
                        <SelectItem value="5">5 attempts</SelectItem>
                        <SelectItem value="10">10 attempts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-sm font-medium flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  API Keys
                </p>
                <div className="rounded-lg border p-3 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium font-mono">sk_live_••••••••••••••••••••••••••ab3f</p>
                      <p className="text-[10px] text-muted-foreground">Production API Key · Created 2024-01-01</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs text-destructive">Revoke</Button>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-2 text-xs">
                  <Key className="h-3.5 w-3.5" />
                  Generate New API Key
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Platform Users Tab */}
        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Platform Users
                </CardTitle>
                <CardDescription>Manage admin, operator, and auditor accounts</CardDescription>
              </div>
              <Button size="sm" className="gap-2 text-xs">
                <Users className="h-3.5 w-3.5" />
                Invite User
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {platformUsers.map((user) => (
                  <div key={user.email} className="flex items-center gap-3 rounded-lg border p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                      {user.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">{user.role}</Badge>
                    <Badge className="text-xs bg-green-100 text-green-700 border-0 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">
                      {user.status}
                    </Badge>
                    <Button variant="ghost" size="sm" className="text-xs">Edit</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Config Tab */}
        <TabsContent value="compliance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Compliance Configuration
              </CardTitle>
              <CardDescription>Default settings for SEC compliance and reporting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Default Exemption Type</Label>
                  <Select defaultValue="506b">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="506b">Reg D 506(b)</SelectItem>
                      <SelectItem value="506c">Reg D 506(c)</SelectItem>
                      <SelectItem value="rega">Reg A+</SelectItem>
                      <SelectItem value="regcf">Reg CF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Max Investors per Issuer</Label>
                  <Input type="number" defaultValue={2000} />
                </div>
                <div className="space-y-2">
                  <Label>KYC Provider</Label>
                  <Select defaultValue="alloy">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alloy">Alloy</SelectItem>
                      <SelectItem value="persona">Persona</SelectItem>
                      <SelectItem value="jumio">Jumio</SelectItem>
                      <SelectItem value="manual">Manual Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Ledger Retention (years)</Label>
                  <Select defaultValue="7">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 years</SelectItem>
                      <SelectItem value="7">7 years (SEC Rule 17a-4)</SelectItem>
                      <SelectItem value="10">10 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-900/20 p-3">
                <p className="text-xs text-blue-800 dark:text-blue-300">
                  Compliance settings are governed by SEC, FINRA, and applicable state regulations.
                  Changes to these settings require dual-approval from two OA Admins.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
