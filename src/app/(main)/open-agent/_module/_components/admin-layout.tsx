'use client';

import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowLeftRight,
  BarChart2,
  Book,
  BookOpen,
  Building2,
  ChevronDown,
  ClipboardList,
  Clock,
  Database,
  Download,
  FileBarChart,
  FilePlus,
  Flame,
  LayoutDashboard,
  Link2,
  ListChecks,
  Lock,
  LogOut,
  MessageSquare,
  PanelLeft,
  Settings,
  ShieldCheck,
  Table2,
  Tag,
  TrendingUp,
  UserX,
  Users,
  X,
} from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { Page, UserRole } from '../_types';
import { adminSidebarGroups, isPageVisible } from '../_data/permissions';
import { SearchDialog } from '@/app/(main)/dashboard/_components/sidebar/search-dialog';
import { ThemeSwitcher } from '@/app/(main)/dashboard/_components/sidebar/theme-switcher';
import { LayoutControls } from '@/app/(main)/dashboard/_components/sidebar/layout-controls';

// Icon map
const iconMap: Record<string, React.ElementType> = {
  'layout-dashboard': LayoutDashboard,
  'building-2': Building2,
  'trending-up': TrendingUp,
  'users': Users,
  'arrow-left-right': ArrowLeftRight,
  'file-plus': FilePlus,
  'table-2': Table2,
  'book-open': BookOpen,
  'book': Book,
  'clipboard-list': ClipboardList,
  'shield-check': ShieldCheck,
  'lock': Lock,
  'activity': Activity,
  'bar-chart-2': BarChart2,
  'file-bar-chart': FileBarChart,
  'settings': Settings,
  'list-checks': ListChecks,
  'flame': Flame,
  'tag': Tag,
  'database': Database,
  'clock': Clock,
  'download': Download,
  'message-square': MessageSquare,
  'user-x': UserX,
  'alert-triangle': AlertTriangle,
  'link-2': Link2,
};

const roleLabels: Record<UserRole, string> = {
  'oa-admin': 'OA Admin',
  'issuer-admin': 'Issuer Admin',
  'operator': 'Operator',
  'auditor': 'Auditor',
};

const roleColors: Record<UserRole, string> = {
  'oa-admin': 'bg-blue-600',
  'issuer-admin': 'bg-purple-600',
  'operator': 'bg-green-600',
  'auditor': 'bg-orange-600',
};

interface AdminLayoutProps {
  role: UserRole;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onRoleChange: (role: UserRole) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export function AdminLayout({
  role,
  currentPage,
  onNavigate,
  onRoleChange,
  onLogout,
  children,
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const allRoles: UserRole[] = ['oa-admin', 'issuer-admin', 'operator', 'auditor'];

  const pageTitles: Record<Page, string> = {
    dashboard: 'Dashboard',
    issuers: 'Issuers',
    securities: 'Securities',
    'security-detail': 'Security Detail',
    investors: 'Investors',
    whitelist: 'Whitelist',
    holds: 'Holds & Lockups',
    transfers: 'Transfers',
    issuance: 'Issuance',
    burn: 'Burn',
    'cap-table': 'Cap Table',
    ledger: 'Audit Ledger',
    'item-classification': 'Item Classification',
    mshf: 'MSHF',
    'control-book': 'Control Book',
    turnaround: 'Turnaround',
    'export-center': 'Export Center',
    inquiries: 'Inquiries',
    'lost-sh': 'Lost SH Cases',
    incidents: 'Incidents (Reg S-P)',
    blockchain: 'Blockchain Events',
    // Legacy
    reports: 'Reports',
    compliance: 'Compliance & Filing',
    activity: 'Activity Tracking',
    'transfer-requests': 'Transfer Requests',
    'my-operations': 'My Operations',
    settings: 'Settings',
  };

  // Accent color per section group
  const groupAccents: Record<string, { border: string; label: string }> = {
    'Entities':   { border: 'border-l-blue-400 dark:border-l-blue-500',   label: 'text-blue-500 dark:text-blue-400' },
    'Compliance': { border: 'border-l-amber-400 dark:border-l-amber-500', label: 'text-amber-500 dark:text-amber-400' },
    'Operations': { border: 'border-l-green-400 dark:border-l-green-500', label: 'text-green-500 dark:text-green-400' },
    'Reports':    { border: 'border-l-purple-400 dark:border-l-purple-500',label: 'text-purple-500 dark:text-purple-400' },
    'Case Mgmt':  { border: 'border-l-red-400 dark:border-l-red-500',     label: 'text-red-500 dark:text-red-400' },
    'Blockchain': { border: 'border-l-orange-400 dark:border-l-orange-500',label: 'text-orange-500 dark:text-orange-400' },
  };

  const SidebarContent = () => (
    <div className="flex flex-col" style={{ height: '100%' }}>
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-2 py-3 min-h-0">
        {/* Dashboard — standalone, no section header */}
        <div className="mb-3">
          <button
            type="button"
            onClick={() => { onNavigate('dashboard'); setMobileSidebarOpen(false); }}
            className={cn(
              'flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-sm transition-colors',
              currentPage === 'dashboard'
                ? 'bg-primary text-primary-foreground font-medium'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
            )}
            title={!sidebarOpen ? 'Dashboard' : undefined}
          >
            <LayoutDashboard className="h-4 w-4 shrink-0" />
            {sidebarOpen && <span>Dashboard</span>}
          </button>
        </div>

        {/* Divider before sections */}
        {sidebarOpen && <div className="mb-3 border-t" />}

        {adminSidebarGroups.map((group) => {
          const visibleItems = group.items.filter((item) =>
            isPageVisible(role, item.page),
          );
          if (visibleItems.length === 0) return null;

          const accent = groupAccents[group.label];

          return (
            <div key={group.label} className="mb-4">
              {sidebarOpen && (
                <p className={cn(
                  'mb-1 pl-2 text-[10px] font-semibold uppercase tracking-widest border-l-2',
                  accent?.border ?? 'border-l-muted-foreground/30',
                  accent?.label ?? 'text-muted-foreground',
                )}>
                  {group.label}
                </p>
              )}
              {visibleItems.map((item) => {
                const Icon = iconMap[item.icon] ?? LayoutDashboard;
                const isActive = currentPage === item.page;

                return (
                  <button
                    key={item.page}
                    type="button"
                    onClick={() => {
                      onNavigate(item.page);
                      setMobileSidebarOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground font-medium'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                    )}
                    title={!sidebarOpen ? item.label : undefined}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {sidebarOpen && <span>{item.label}</span>}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t p-2">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {sidebarOpen && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="flex flex-col bg-background overflow-hidden"
        style={{
          transform: 'scale(1.12)',
          transformOrigin: 'top left',
          width: 'calc(100% / 1.12)',
          height: 'calc(100% / 1.12)',
        }}
      >

      {/* ── Full-width TopBar ── */}
      <header className="relative flex h-14 shrink-0 items-center border-b bg-background/95 backdrop-blur gap-3">
        {/* Logo area — same width as sidebar */}
        <div className={cn(
          'flex shrink-0 items-center border-r h-full bg-muted transition-all duration-200',
          sidebarOpen ? 'w-56 px-4' : 'w-14 justify-center px-2',
        )}>
          <img
            src="/oa-logo.png"
            alt="Open Agent"
            className={sidebarOpen ? 'h-9 w-auto' : 'h-7 w-7 object-contain'}
          />
        </div>

        {/* Sidebar toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <PanelLeft className="h-4 w-4" />
        </Button>

        {/* Center title — truly centered across full viewport */}
        <span
          className="absolute left-1/2 -translate-x-1/2 text-[15px] font-semibold tracking-[0.2em] uppercase pointer-events-none select-none text-foreground/80"
          style={{ fontFamily: 'var(--font-manrope)' }}
        >
          Open Agent
        </span>

        <div className="ml-auto flex items-center gap-2 pr-4">
            <SearchDialog />
            <LayoutControls />
            <ThemeSwitcher />

            {/* Role Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-2 text-xs">
                  <span
                    className={cn(
                      'h-2 w-2 rounded-full',
                      roleColors[role],
                    )}
                  />
                  {roleLabels[role]}
                  <ChevronDown className="h-3 w-3 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Switch Role (Demo)
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {allRoles.map((r) => (
                    <DropdownMenuItem
                      key={r}
                      onClick={() => onRoleChange(r)}
                      className={cn('text-sm gap-2', role === r && 'font-medium')}
                    >
                      <span className={cn('h-2 w-2 rounded-full', roleColors[r])} />
                      {roleLabels[r]}
                      {role === r && (
                        <Badge variant="secondary" className="ml-auto text-[10px] py-0">
                          Active
                        </Badge>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Avatar */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                      {role === 'oa-admin' ? 'OA' : role === 'issuer-admin' ? 'IA' : role === 'operator' ? 'OP' : role === 'auditor' ? 'AU' : 'IN'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-xs">
                  <p className="font-medium">
                    {role === 'oa-admin' ? 'Sarah Mitchell' : role === 'issuer-admin' ? 'James Park' : role === 'operator' ? 'Tom Bradley' : role === 'auditor' ? 'Priya Nair' : 'Robert Chambers'}
                  </p>
                  <p className="text-muted-foreground font-normal">{roleLabels[role]}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="text-destructive gap-2">
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
      </header>

      {/* ── Body: sidebar + content ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Desktop Sidebar */}
        <aside className={cn(
          'hidden md:flex flex-col border-r bg-muted transition-all duration-200 overflow-hidden',
          sidebarOpen ? 'w-56' : 'w-14',
        )}>
          <SidebarContent />
        </aside>

        {/* Mobile sidebar overlay */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileSidebarOpen(false)} />
            <aside className="absolute left-0 top-0 flex h-full w-64 flex-col border-r bg-card">
              <div className="flex h-14 items-center justify-between border-b px-4">
                <img src="/oa-logo.png" alt="Open Agent" className="h-9 w-auto shrink-0" />
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setMobileSidebarOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <SidebarContent />
            </aside>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <ScrollArea className="h-full">
            <div className="p-4 md:p-6 @container/main">
              {children}
            </div>
          </ScrollArea>
        </main>
      </div>
      </div>
    </div>
  );
}
