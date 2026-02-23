'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import type { Page, UserRole } from '../_module/_types';
import { getDefaultPage, isPageVisible } from '../_module/_data/permissions';

import { LoginPage } from '../_module/_components/login-page';
import { AdminLayout } from '../_module/_components/admin-layout';

// Admin Pages
import { DashboardPage } from '../_module/_components/pages/dashboard-page';
import { IssuersPage } from '../_module/_components/pages/issuers-page';
import { SecuritiesPage } from '../_module/_components/pages/securities-page';
import { SecurityDetailPage } from '../_module/_components/pages/security-detail-page';
import { InvestorsPage } from '../_module/_components/pages/investors-page';
import { TransfersPage } from '../_module/_components/pages/transfers-page';
import { CapTablePage } from '../_module/_components/pages/cap-table-page';
import { LedgerPage } from '../_module/_components/pages/ledger-page';
import { ReportsPage } from '../_module/_components/pages/reports-page';
import { CompliancePage } from '../_module/_components/pages/compliance-page';
import { HoldsPage } from '../_module/_components/pages/holds-page';
import { ActivityPage } from '../_module/_components/pages/activity-page';
import { TransferRequestsPage } from '../_module/_components/pages/transfer-requests-page';
import { MyOperationsPage } from '../_module/_components/pages/my-operations-page';
import { SettingsPage } from '../_module/_components/pages/settings-page';

export default function OpenAgentPage() {
  const params = useParams();
  const router = useRouter();

  const urlPage = (params.page as string) ?? 'dashboard';

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>('oa-admin');
  const [hydrated, setHydrated] = useState(false);

  // Restore auth + role from localStorage on mount
  useEffect(() => {
    const auth = localStorage.getItem('oa-auth');
    const role = localStorage.getItem('oa-role') as UserRole | null;
    if (auth === 'true') setIsAuthenticated(true);
    if (role) setCurrentRole(role);
    setHydrated(true);
  }, []);

  function handleLogin() {
    setIsAuthenticated(true);
    localStorage.setItem('oa-auth', 'true');
  }

  function handleLogout() {
    setIsAuthenticated(false);
    setCurrentRole('oa-admin');
    localStorage.removeItem('oa-auth');
    localStorage.removeItem('oa-role');
    router.push('/open-agent/dashboard');
  }

  function handleRoleChange(newRole: UserRole) {
    setCurrentRole(newRole);
    localStorage.setItem('oa-role', newRole);
    const defaultPage = getDefaultPage(newRole);
    router.push(`/open-agent/${defaultPage}`);
  }

  function handleNavigate(page: string) {
    const p = page as Page;
    if (isPageVisible(currentRole, p)) {
      router.push(`/open-agent/${p}`);
    } else {
      router.push(`/open-agent/${getDefaultPage(currentRole)}`);
    }
  }

  // Avoid flash before localStorage is read
  if (!hydrated) return null;

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const currentPage = urlPage as Page;

  function renderPage() {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage role={currentRole} onNavigate={handleNavigate} />;
      case 'issuers':
        return <IssuersPage role={currentRole} onNavigate={handleNavigate} />;
      case 'securities':
        return <SecuritiesPage role={currentRole} onNavigate={handleNavigate} />;
      case 'security-detail':
        return <SecurityDetailPage role={currentRole} onNavigate={handleNavigate} />;
      case 'investors':
        return <InvestorsPage role={currentRole} />;
      case 'transfers':
        return <TransfersPage role={currentRole} />;
      case 'cap-table':
        return <CapTablePage role={currentRole} />;
      case 'ledger':
        return <LedgerPage role={currentRole} />;
      case 'reports':
        return <ReportsPage role={currentRole} />;
      case 'compliance':
        return <CompliancePage role={currentRole} />;
      case 'holds':
        return <HoldsPage role={currentRole} />;
      case 'activity':
        return <ActivityPage role={currentRole} />;
      case 'transfer-requests':
        return <TransferRequestsPage role={currentRole} />;
      case 'my-operations':
        return <MyOperationsPage role={currentRole} onNavigate={handleNavigate} />;
      case 'settings':
        return <SettingsPage role={currentRole} />;
      // Spec pages mapped to closest existing component
      case 'whitelist':
        return <CompliancePage role={currentRole} />;
      case 'issuance':
      case 'burn':
        return <LedgerPage role={currentRole} />;
      case 'item-classification':
        return <ActivityPage role={currentRole} />;
      case 'mshf':
      case 'control-book':
      case 'turnaround':
      case 'export-center':
        return <ReportsPage role={currentRole} />;
      case 'inquiries':
        return <TransferRequestsPage role={currentRole} />;
      case 'lost-sh':
      case 'incidents':
        return <CompliancePage role={currentRole} />;
      case 'blockchain':
        return <ActivityPage role={currentRole} />;
      default:
        return <DashboardPage role={currentRole} onNavigate={handleNavigate} />;
    }
  }

  return (
    <AdminLayout
      role={currentRole}
      currentPage={currentPage}
      onNavigate={handleNavigate}
      onRoleChange={handleRoleChange}
      onLogout={handleLogout}
    >
      {renderPage()}
    </AdminLayout>
  );
}
