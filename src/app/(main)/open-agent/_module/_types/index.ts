export type UserRole = 'oa-admin' | 'issuer-admin' | 'operator' | 'auditor';

export type AdminPage =
  | 'dashboard'
  // Entities
  | 'issuers'
  | 'securities'
  | 'security-detail'
  | 'investors'
  // Compliance
  | 'whitelist'
  | 'holds'
  // Operations
  | 'transfers'
  | 'issuance'
  | 'burn'
  | 'cap-table'
  | 'ledger'
  | 'item-classification'
  // Reports
  | 'mshf'
  | 'control-book'
  | 'turnaround'
  | 'export-center'
  // Case Mgmt
  | 'inquiries'
  | 'lost-sh'
  | 'incidents'
  // Blockchain
  | 'blockchain'
  // Legacy (kept for backward compat with existing page components)
  | 'compliance'
  | 'activity'
  | 'reports'
  | 'transfer-requests'
  | 'my-operations'
  | 'settings';

export type Page = AdminPage;

export interface Permissions {
  canCreateIssuer: boolean;
  canEditIssuer: boolean;
  canCreateSecurity: boolean;
  canIssueBurn: boolean;
  canApproveTransfer: boolean;
  canEditCompliance: boolean;
  canManageWhitelist: boolean;
  canManageHolds: boolean;
  canAccessLedger: boolean;
  canAccessReports: boolean;
  canManageSettings: boolean;
  canViewAllIssuers: boolean;
  canCreateTransfer: boolean;
  canViewTransfers: boolean;
  canViewCapTable: boolean;
  canViewSecurities: boolean;
  canViewInvestors: boolean;
  canManageDocuments: boolean;
  canViewActivity: boolean;
  canViewComplianceFiling: boolean;
  canViewHolds: boolean;
  canViewLedger: boolean;
  canEditSecurityDetail: boolean;
  canManageMyOperations: boolean;
}

export interface Issuer {
  id: string;
  name: string;
  ein: string;
  state: string;
  status: 'active' | 'inactive' | 'pending';
  securitiesCount: number;
  investorsCount: number;
  createdAt: string;
  contactName: string;
  contactEmail: string;
  address: string;
  totalSharesIssued: number;
}

export interface Security {
  id: string;
  issuerId: string;
  issuerName: string;
  name: string;
  ticker: string;
  type: 'common-stock' | 'preferred-stock' | 'bond' | 'warrant' | 'option';
  totalAuthorized: number;
  totalIssued: number;
  totalOutstanding: number;
  parValue: number;
  status: 'active' | 'inactive';
  cusip: string;
  createdAt: string;
}

export interface Investor {
  id: string;
  name: string;
  email: string;
  type: 'individual' | 'institutional' | 'trust' | 'broker-dealer';
  status: 'active' | 'pending' | 'suspended';
  accredited: boolean;
  crdNumber?: string;
  taxId: string;
  address: string;
  phone: string;
  kyc: 'approved' | 'pending' | 'rejected';
  createdAt: string;
  totalShares: number;
  totalValue: number;
}

export interface Transfer {
  id: string;
  securityId: string;
  securityName: string;
  fromInvestorId: string;
  fromInvestorName: string;
  toInvestorId: string;
  toInvestorName: string;
  shares: number;
  pricePerShare: number;
  totalAmount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  type: 'secondary' | 'primary' | 'gift' | 'inheritance';
  submittedAt: string;
  completedAt?: string;
  approvedBy?: string;
  notes?: string;
}

export interface TransferRequest {
  id: string;
  investorId: string;
  investorName: string;
  securityId: string;
  securityName: string;
  toName: string;
  toEmail: string;
  shares: number;
  reason: string;
  status: 'pending' | 'under-review' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  documents: string[];
}

export interface LedgerEntry {
  id: string;
  securityId: string;
  securityName: string;
  investorId: string;
  investorName: string;
  type: 'issuance' | 'transfer' | 'burn' | 'adjustment';
  shares: number;
  balanceBefore: number;
  balanceAfter: number;
  timestamp: string;
  reference: string;
  approvedBy: string;
}

export interface Hold {
  id: string;
  investorId: string;
  investorName: string;
  securityId: string;
  securityName: string;
  type: 'regulatory' | 'legal' | 'voluntary';
  shares: number;
  reason: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'released' | 'expired';
  issuedBy: string;
}

export interface Lockup {
  id: string;
  investorId: string;
  investorName: string;
  securityId: string;
  securityName: string;
  shares: number;
  lockupDays: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'released';
  reason: string;
}

export interface Certificate {
  id: string;
  investorId: string;
  securityId: string;
  shares: number;
  issueDate: string;
  cancelDate?: string;
  status: 'active' | 'cancelled' | 'transferred';
  certificateNumber: string;
}

export interface ComplianceProfile {
  issuerId: string;
  issuerName: string;
  exemption: string;
  maxInvestors: number;
  currentInvestors: number;
  formDFiled: boolean;
  blueSkyStates: string[];
  restrictions: string[];
  lastReviewed: string;
  nextReview: string;
  status: 'compliant' | 'review-needed' | 'non-compliant';
}

export interface Balance {
  investorId: string;
  securityId: string;
  securityName: string;
  shares: number;
  vestedShares: number;
  heldShares: number;
  availableShares: number;
  lastUpdated: string;
  currentValue: number;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  status: 'active' | 'expired';
  category: 'kyc' | 'agreement' | 'statement' | 'tax';
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  ipAddress: string;
  details: string;
}

export interface CapTableEntry {
  investorId: string;
  investorName: string;
  investorType: string;
  securityId: string;
  securityName: string;
  shares: number;
  percentage: number;
  issueDate: string;
  certificateIds: string[];
  value: number;
}
