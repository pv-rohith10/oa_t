import type { AdminPage, Page, Permissions, UserRole } from '../_types';

// ─── Permissions per role ─────────────────────────────────────────────────────
export function getPermissions(role: UserRole): Permissions {
  switch (role) {
    case 'oa-admin':
      return {
        canCreateIssuer: true,
        canEditIssuer: true,
        canCreateSecurity: true,
        canIssueBurn: true,
        canApproveTransfer: true,
        canEditCompliance: true,
        canManageWhitelist: true,
        canManageHolds: true,
        canAccessLedger: true,
        canAccessReports: true,
        canManageSettings: true,
        canViewAllIssuers: true,
        canCreateTransfer: true,
        canViewTransfers: true,
        canViewCapTable: true,
        canViewSecurities: true,
        canViewInvestors: true,
        canManageDocuments: true,
        canViewActivity: true,
        canViewComplianceFiling: true,
        canViewHolds: true,
        canViewLedger: true,
        canEditSecurityDetail: true,
        canManageMyOperations: false,
      };
    case 'issuer-admin':
      return {
        canCreateIssuer: false,
        canEditIssuer: true,
        canCreateSecurity: true,
        canIssueBurn: true,
        canApproveTransfer: false,
        canEditCompliance: false,
        canManageWhitelist: true,
        canManageHolds: false,
        canAccessLedger: true,
        canAccessReports: true,
        canManageSettings: false,
        canViewAllIssuers: false,
        canCreateTransfer: true,
        canViewTransfers: true,
        canViewCapTable: true,
        canViewSecurities: true,
        canViewInvestors: true,
        canManageDocuments: true,
        canViewActivity: false,
        canViewComplianceFiling: false,
        canViewHolds: false,
        canViewLedger: true,
        canEditSecurityDetail: true,
        canManageMyOperations: true,
      };
    case 'operator':
      return {
        canCreateIssuer: false,
        canEditIssuer: false,
        canCreateSecurity: false,
        canIssueBurn: false,
        canApproveTransfer: true,
        canEditCompliance: false,
        canManageWhitelist: false,
        canManageHolds: false,
        canAccessLedger: false,
        canAccessReports: true,
        canManageSettings: false,
        canViewAllIssuers: false,
        canCreateTransfer: false,
        canViewTransfers: true,
        canViewCapTable: true,
        canViewSecurities: true,
        canViewInvestors: true,
        canManageDocuments: false,
        canViewActivity: false,
        canViewComplianceFiling: false,
        canViewHolds: false,
        canViewLedger: false,
        canEditSecurityDetail: false,
        canManageMyOperations: false,
      };
    case 'auditor':
      return {
        canCreateIssuer: false,
        canEditIssuer: false,
        canCreateSecurity: false,
        canIssueBurn: false,
        canApproveTransfer: false,
        canEditCompliance: false,
        canManageWhitelist: false,
        canManageHolds: false,
        canAccessLedger: true,
        canAccessReports: true,
        canManageSettings: false,
        canViewAllIssuers: false,
        canCreateTransfer: false,
        canViewTransfers: true,
        canViewCapTable: true,
        canViewSecurities: false,
        canViewInvestors: false,
        canManageDocuments: false,
        canViewActivity: false,
        canViewComplianceFiling: false,
        canViewHolds: false,
        canViewLedger: true,
        canEditSecurityDetail: false,
        canManageMyOperations: false,
      };
  }
}

// ─── Page visibility per role ─────────────────────────────────────────────────
const pageVisibility: Record<UserRole, Page[]> = {
  'oa-admin': [
    'dashboard',
    // Entities
    'issuers', 'securities', 'security-detail', 'investors',
    // Compliance
    'whitelist', 'holds',
    // Operations
    'transfers', 'issuance', 'burn', 'cap-table', 'ledger', 'item-classification',
    // Reports
    'mshf', 'control-book', 'turnaround', 'export-center',
    // Case Mgmt
    'inquiries', 'lost-sh', 'incidents',
    // Blockchain
    'blockchain',
    // Legacy
    'compliance', 'activity', 'reports', 'transfer-requests', 'my-operations', 'settings',
  ],
  'issuer-admin': [
    'dashboard',
    // Entities (own issuer scoped)
    'issuers', 'securities', 'security-detail', 'investors',
    // Compliance (own securities)
    'whitelist', 'holds',
    // Operations (own securities)
    'transfers', 'issuance', 'burn', 'cap-table', 'ledger',
    // Reports (own securities)
    'mshf', 'control-book', 'turnaround', 'export-center',
    // Case Mgmt (own)
    'inquiries', 'lost-sh',
    // Legacy
    'compliance', 'reports', 'my-operations',
  ],
  operator: [
    'dashboard',
    // Operator: Transfers only
    'transfers',
    // Legacy
    'transfer-requests',
  ],
  auditor: [
    'dashboard',
    // Entities (read-only, no Issuers)
    'securities', 'investors',
    // Compliance (read-only)
    'whitelist', 'holds',
    // Operations (read-only, no Issuance/Burn)
    'transfers', 'cap-table', 'ledger', 'item-classification',
    // Reports (read-only)
    'mshf', 'control-book', 'turnaround', 'export-center',
    // Case Mgmt (read-only: Incidents only)
    'incidents',
    // Blockchain (read-only)
    'blockchain',
    // Legacy
    'reports',
  ],
};

export function isPageVisible(role: UserRole, page: Page): boolean {
  return pageVisibility[role]?.includes(page) ?? false;
}

export function getDefaultPage(role: UserRole): Page {
  return 'dashboard';
}

// ─── Sidebar nav groups per admin role ───────────────────────────────────────
export interface SidebarNavItem {
  page: AdminPage;
  label: string;
  icon: string;
}

export interface SidebarNavGroup {
  label: string;
  items: SidebarNavItem[];
}

export const adminSidebarGroups: SidebarNavGroup[] = [
  {
    label: 'Entities',
    items: [
      { page: 'issuers', label: 'Issuers', icon: 'building-2' },
      { page: 'securities', label: 'Securities', icon: 'trending-up' },
      { page: 'investors', label: 'Investors', icon: 'users' },
    ],
  },
  {
    label: 'Compliance',
    items: [
      { page: 'whitelist', label: 'Whitelist', icon: 'list-checks' },
      { page: 'holds', label: 'Holds & Lockups', icon: 'lock' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { page: 'transfers', label: 'Transfers', icon: 'arrow-left-right' },
      { page: 'issuance', label: 'Issuance', icon: 'file-plus' },
      { page: 'burn', label: 'Burn', icon: 'flame' },
      { page: 'cap-table', label: 'Cap Table', icon: 'table-2' },
      { page: 'ledger', label: 'Audit Ledger', icon: 'book-open' },
      { page: 'item-classification', label: 'Item Classification', icon: 'tag' },
    ],
  },
  {
    label: 'Reports',
    items: [
      { page: 'mshf', label: 'MSHF', icon: 'database' },
      { page: 'control-book', label: 'Control Book', icon: 'book' },
      { page: 'turnaround', label: 'Turnaround', icon: 'clock' },
      { page: 'export-center', label: 'Export Center', icon: 'download' },
    ],
  },
  {
    label: 'Case Mgmt',
    items: [
      { page: 'inquiries', label: 'Inquiries', icon: 'message-square' },
      { page: 'lost-sh', label: 'Lost SH Cases', icon: 'user-x' },
      { page: 'incidents', label: 'Incidents (Reg S-P)', icon: 'alert-triangle' },
    ],
  },
  {
    label: 'Blockchain',
    items: [
      { page: 'blockchain', label: 'Blockchain Events', icon: 'link-2' },
    ],
  },
];
