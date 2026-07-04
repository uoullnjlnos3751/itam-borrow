// ============================================================
// Database Types — matches schema.sql exactly
// ============================================================

export type UserRole = 'user' | 'admin';

export type AssetStatus =
  | 'available'
  | 'borrowed'
  | 'reserved'
  | 'maintenance'
  | 'damaged'
  | 'lost'
  | 'retired';

export type AssetCondition = 'new' | 'good' | 'fair' | 'poor';

export type RequestStatus =
  | 'pending'
  | 'rejected'
  | 'approved'
  | 'borrowed'
  | 'returned'
  | 'overdue'
  | 'cancelled';

export type NotifyChannel = 'email' | 'teams';

export type NotifyEvent =
  | 'request_submitted'
  | 'request_approved'
  | 'request_rejected'
  | 'due_soon_reminder'
  | 'overdue_alert'
  | 'return_confirmed';

// ---- Table Row Types ----

export interface User {
  id: string;
  entra_object_id: string;
  email: string;
  display_name: string;
  department: string | null;
  subsidiary: string | null;
  role: UserRole;
  is_active: boolean;
  last_login_at: string | null;
  profile_image_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AssetCategory {
  id: string;
  name: string;
  icon: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Asset {
  id: string;
  asset_tag: string;
  name: string;
  category_id: string;
  brand: string | null;
  model: string | null;
  serial_number: string | null;
  status: AssetStatus;
  condition: AssetCondition;
  purchase_date: string | null;
  purchase_price: number | null;
  vendor: string | null;
  warranty_expiry_date: string | null;
  location: string | null;
  subsidiary: string | null;
  image_url: string | null;
  notes: string | null;
  is_borrowable: boolean;
  deleted_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  asset_categories?: AssetCategory;
}

export interface BorrowRequest {
  id: string;
  request_no: string;
  user_id: string;
  asset_id: string;
  reason: string;
  requested_due_date: string;
  status: RequestStatus;
  approved_by: string | null;
  approved_at: string | null;
  rejection_reason: string | null;
  borrowed_at: string | null;
  due_date: string | null;
  returned_at: string | null;
  return_confirmed_by: string | null;
  return_condition_note: string | null;
  
  // Extension Fields
  extension_status: 'pending' | 'approved' | 'rejected' | null;
  extension_requested_date: string | null;
  extension_reason: string | null;
  
  created_at: string;
  updated_at: string;
  // Joined fields
  assets?: Asset;
  users?: User;
  approver?: User;
}

export interface AssetAuditLog {
  id: string;
  asset_id: string | null;
  asset_tag_snapshot: string | null;
  action: string;
  changed_by: string | null;
  change_summary: string | null;
  created_at: string;
}

export interface NotificationLog {
  id: string;
  request_id: string;
  channel: NotifyChannel;
  event_type: NotifyEvent;
  recipient_email: string;
  subject: string | null;
  sent_at: string | null;
  status: string;
  error_message: string | null;
  created_at: string;
}

// ---- View Types ----

export interface AdminDashboardSummary {
  pending_count: number;
  active_borrow_count: number;
  overdue_count: number;
  available_asset_count: number;
}

export interface OverdueRequest {
  id: string;
  request_no: string;
  due_date: string;
  borrower_name: string;
  borrower_email: string;
  asset_name: string;
  asset_tag: string;
  days_overdue: number;
}
