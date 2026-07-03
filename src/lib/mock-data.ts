import { User, Asset, AssetCategory, BorrowRequest, AdminDashboardSummary, OverdueRequest } from './database.types';

// ---- Mock Users ----
export const mockUsers: User[] = [
  {
    id: 'user-001',
    entra_object_id: 'mock-oid-001',
    email: 'jakkrit@trrgroup.com',
    display_name: 'จักรกฤษณ์ ศิริวัฒน์',
    department: 'IT Support',
    subsidiary: 'PS',
    role: 'user',
    is_active: true,
    last_login_at: new Date().toISOString(),
    created_at: '2024-01-15T08:00:00Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'admin-001',
    entra_object_id: 'mock-oid-admin',
    email: 'it.admin@trrgroup.com',
    display_name: 'IT Admin',
    department: 'IT',
    subsidiary: 'PS',
    role: 'admin',
    is_active: true,
    last_login_at: new Date().toISOString(),
    created_at: '2024-01-01T08:00:00Z',
    updated_at: new Date().toISOString(),
  },
];

// ---- Mock Categories ----
export const mockCategories: AssetCategory[] = [
  { id: 'cat-01', name: 'Notebook', icon: 'laptop_mac', is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-02', name: 'Desktop PC', icon: 'desktop_windows', is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-03', name: 'Monitor', icon: 'monitor', is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-04', name: 'Printer', icon: 'print', is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-05', name: 'Projector', icon: 'videocam', is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-06', name: 'Network Equipment', icon: 'router', is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-07', name: 'Mobile Device', icon: 'smartphone', is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-08', name: 'Peripheral', icon: 'mouse', is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-09', name: 'Adapter/Cable', icon: 'cable', is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-10', name: 'Other', icon: 'devices_other', is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
];

// ---- Mock Assets ----
export const mockAssets: Asset[] = [
  {
    id: 'asset-001', asset_tag: 'TAG-88291-LX', name: 'MacBook Pro 16"', category_id: 'cat-01',
    brand: 'Apple', model: '16-inch M3 Pro', serial_number: 'C02DR4ABCDEF',
    status: 'available', condition: 'good', purchase_date: '2024-03-15', purchase_price: 89900,
    vendor: 'iStudio', warranty_expiry_date: '2027-03-15', location: 'คลัง IT ชั้น 22',
    subsidiary: 'PS', image_url: null, notes: null, is_borrowable: true, deleted_at: null,
    created_by: 'admin-001', created_at: '2024-03-15T00:00:00Z', updated_at: '2024-03-15T00:00:00Z',
    asset_categories: { id: 'cat-01', name: 'Notebook', icon: 'laptop_mac', is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  },
  {
    id: 'asset-002', asset_tag: 'TAG-51022-PJ', name: 'Projector Epson EB-X06', category_id: 'cat-05',
    brand: 'Epson', model: 'EB-X06', serial_number: 'EPSON-PJ-002',
    status: 'borrowed', condition: 'good', purchase_date: '2023-08-10', purchase_price: 18900,
    vendor: 'Advice', warranty_expiry_date: '2026-08-10', location: 'คลัง IT ชั้น 22',
    subsidiary: 'PS', image_url: null, notes: null, is_borrowable: true, deleted_at: null,
    created_by: 'admin-001', created_at: '2023-08-10T00:00:00Z', updated_at: '2024-07-01T00:00:00Z',
    asset_categories: { id: 'cat-05', name: 'Projector', icon: 'videocam', is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  },
  {
    id: 'asset-003', asset_tag: 'TAG-77451-AD', name: 'USB-C Hub Adapter', category_id: 'cat-09',
    brand: 'Ugreen', model: '9-in-1 Hub', serial_number: 'UG-HUB-003',
    status: 'available', condition: 'good', purchase_date: '2024-04-01', purchase_price: 1990,
    vendor: 'Lazada', warranty_expiry_date: '2025-04-01', location: 'คลัง IT ชั้น 22',
    subsidiary: 'PS', image_url: null, notes: null, is_borrowable: true, deleted_at: null,
    created_by: 'admin-001', created_at: '2024-04-01T00:00:00Z', updated_at: '2024-04-01T00:00:00Z',
    asset_categories: { id: 'cat-09', name: 'Adapter/Cable', icon: 'cable', is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  },
  {
    id: 'asset-004', asset_tag: 'TAG-30021-MS', name: 'Logitech MX Master 3S', category_id: 'cat-08',
    brand: 'Logitech', model: 'MX Master 3S', serial_number: 'LOGI-MX-004',
    status: 'available', condition: 'good', purchase_date: '2024-02-14', purchase_price: 3490,
    vendor: 'JIB', warranty_expiry_date: '2026-02-14', location: 'คลัง IT ชั้น 22',
    subsidiary: 'PS', image_url: null, notes: null, is_borrowable: true, deleted_at: null,
    created_by: 'admin-001', created_at: '2024-02-14T00:00:00Z', updated_at: '2024-02-14T00:00:00Z',
    asset_categories: { id: 'cat-08', name: 'Peripheral', icon: 'mouse', is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  },
  {
    id: 'asset-005', asset_tag: 'TAG-77621-MN', name: 'Dell UltraSharp 27"', category_id: 'cat-03',
    brand: 'Dell', model: 'U2723QE', serial_number: 'DELL-MON-005',
    status: 'maintenance', condition: 'fair', purchase_date: '2023-06-01', purchase_price: 18900,
    vendor: 'Synnex', warranty_expiry_date: '2026-06-01', location: 'ศูนย์ซ่อม',
    subsidiary: 'PS', image_url: null, notes: 'ส่งซ่อมจอมีเส้น', is_borrowable: false, deleted_at: null,
    created_by: 'admin-001', created_at: '2023-06-01T00:00:00Z', updated_at: '2024-06-15T00:00:00Z',
    asset_categories: { id: 'cat-03', name: 'Monitor', icon: 'monitor', is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  },
  {
    id: 'asset-006', asset_tag: 'TAG-77451-CB', name: 'USB-C Hub Adapter (ชำรุด)', category_id: 'cat-09',
    brand: 'Anker', model: '7-in-1', serial_number: 'ANK-HUB-006',
    status: 'damaged', condition: 'poor', purchase_date: '2022-11-01', purchase_price: 1290,
    vendor: 'Shopee', warranty_expiry_date: '2023-11-01', location: 'คลัง IT ชั้น 22',
    subsidiary: 'PS', image_url: null, notes: 'พอร์ต USB เสีย', is_borrowable: false, deleted_at: null,
    created_by: 'admin-001', created_at: '2022-11-01T00:00:00Z', updated_at: '2024-05-01T00:00:00Z',
    asset_categories: { id: 'cat-09', name: 'Adapter/Cable', icon: 'cable', is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  },
];

// ---- Mock Borrow Requests ----
export const mockBorrowRequests: BorrowRequest[] = [
  {
    id: 'br-001', request_no: 'BR-2569-0041', user_id: 'user-001', asset_id: 'asset-001',
    reason: 'ใช้สำหรับพรีเซนต์งานที่ลูกค้า วันที่ 8 ก.ค. 2569',
    requested_due_date: '2026-07-10', status: 'borrowed',
    approved_by: 'admin-001', approved_at: '2026-07-02T10:00:00Z', rejection_reason: null,
    borrowed_at: '2026-07-02T10:00:00Z', due_date: '2026-07-10', returned_at: null,
    return_confirmed_by: null, return_condition_note: null,
    created_at: '2026-07-02T09:00:00Z', updated_at: '2026-07-02T10:00:00Z',
    assets: mockAssets[0], users: mockUsers[0],
  },
  {
    id: 'br-002', request_no: 'BR-2569-0044', user_id: 'user-001', asset_id: 'asset-002',
    reason: 'ประชุมลูกค้าต่างจังหวัด',
    requested_due_date: '2026-07-05', status: 'pending',
    approved_by: null, approved_at: null, rejection_reason: null,
    borrowed_at: null, due_date: null, returned_at: null,
    return_confirmed_by: null, return_condition_note: null,
    created_at: '2026-07-02T14:00:00Z', updated_at: '2026-07-02T14:00:00Z',
    assets: mockAssets[1], users: mockUsers[0],
  },
  {
    id: 'br-003', request_no: 'BR-2569-0022', user_id: 'user-001', asset_id: 'asset-004',
    reason: 'ใช้แทนเมาส์เก่าที่เสีย',
    requested_due_date: '2026-06-30', status: 'returned',
    approved_by: 'admin-001', approved_at: '2026-06-20T08:00:00Z', rejection_reason: null,
    borrowed_at: '2026-06-20T08:30:00Z', due_date: '2026-06-30', returned_at: '2026-06-28T16:00:00Z',
    return_confirmed_by: 'admin-001', return_condition_note: 'สภาพดี',
    created_at: '2026-06-19T09:00:00Z', updated_at: '2026-06-28T16:00:00Z',
    assets: mockAssets[3], users: mockUsers[0],
  },
  {
    id: 'br-004', request_no: 'BR-2569-0015', user_id: 'user-001', asset_id: 'asset-002',
    reason: 'ต้องการใช้ประชุม online',
    requested_due_date: '2026-06-15', status: 'rejected',
    approved_by: 'admin-001', approved_at: null, rejection_reason: 'ของไม่ว่างในช่วงเวลาที่ขอ',
    borrowed_at: null, due_date: null, returned_at: null,
    return_confirmed_by: null, return_condition_note: null,
    created_at: '2026-06-10T09:00:00Z', updated_at: '2026-06-10T14:00:00Z',
    assets: mockAssets[1], users: mockUsers[0],
  },
];

// ---- Mock Dashboard Summary ----
export const mockDashboardSummary: AdminDashboardSummary = {
  pending_count: 3,
  active_borrow_count: 17,
  overdue_count: 2,
  available_asset_count: 45,
};

// ---- Mock Overdue Requests ----
export const mockOverdueRequests: OverdueRequest[] = [
  {
    id: 'br-overdue-001',
    request_no: 'BR-2569-0038',
    due_date: '2026-06-30',
    borrower_name: 'วิภา สุขใจ',
    borrower_email: 'wipa@trrgroup.com',
    asset_name: 'Dell UltraSharp 27"',
    asset_tag: 'TAG-77621-MN',
    days_overdue: 3,
  },
];

// ---- Mock Pending Requests (for admin) ----
export const mockPendingRequests: BorrowRequest[] = [
  {
    id: 'br-pending-001', request_no: 'BR-2569-0045', user_id: 'user-001', asset_id: 'asset-001',
    reason: 'ใช้สำหรับพรีเซนต์งานที่ลูกค้า วันที่ 8 ก.ค. 2569',
    requested_due_date: '2026-07-10', status: 'pending',
    approved_by: null, approved_at: null, rejection_reason: null,
    borrowed_at: null, due_date: null, returned_at: null,
    return_confirmed_by: null, return_condition_note: null,
    created_at: '2026-07-02T09:00:00Z', updated_at: '2026-07-02T09:00:00Z',
    assets: mockAssets[0],
    users: { ...mockUsers[0], display_name: 'จักรกฤษณ์', department: 'IT Support' },
  },
  {
    id: 'br-pending-002', request_no: 'BR-2569-0046', user_id: 'user-001', asset_id: 'asset-002',
    reason: 'ประชุมลูกค้าต่างจังหวัด',
    requested_due_date: '2026-07-05', status: 'pending',
    approved_by: null, approved_at: null, rejection_reason: null,
    borrowed_at: null, due_date: null, returned_at: null,
    return_confirmed_by: null, return_condition_note: null,
    created_at: '2026-07-02T14:00:00Z', updated_at: '2026-07-02T14:00:00Z',
    assets: mockAssets[1],
    users: { ...mockUsers[0], display_name: 'สมชาย ใจดี', department: 'Sales', email: 'somchai@trrgroup.com' },
  },
];

// ---- Mock Approved Requests (Ready for Pickup) ----
export const mockApprovedRequests: BorrowRequest[] = [
  {
    id: 'br-approved-001', request_no: 'BR-2569-0047', user_id: 'user-001', asset_id: 'asset-003',
    reason: 'ใช้ต่อจอพรีเซนต์งานพรุ่งนี้',
    requested_due_date: '2026-07-05', status: 'approved',
    approved_by: 'admin-001', approved_at: '2026-07-03T08:00:00Z', rejection_reason: null,
    borrowed_at: null, due_date: null, returned_at: null,
    return_confirmed_by: null, return_condition_note: null,
    created_at: '2026-07-03T07:30:00Z', updated_at: '2026-07-03T08:00:00Z',
    assets: mockAssets[2],
    users: { ...mockUsers[0], display_name: 'วิภา สุขใจ', department: 'HR' },
  }
];

// ---- Mock Active Borrowed Requests ----
export const mockActiveBorrowRequests: BorrowRequest[] = [
  {
    id: 'br-borrowed-001', request_no: 'BR-2569-0040', user_id: 'user-001', asset_id: 'asset-004',
    reason: 'เมาส์พัง รอของใหม่มาส่งสัปดาห์หน้า',
    requested_due_date: '2026-07-08', status: 'borrowed',
    approved_by: 'admin-001', approved_at: '2026-07-01T09:00:00Z', rejection_reason: null,
    borrowed_at: '2026-07-01T10:00:00Z', due_date: '2026-07-08', returned_at: null,
    return_confirmed_by: null, return_condition_note: null,
    created_at: '2026-07-01T08:00:00Z', updated_at: '2026-07-01T10:00:00Z',
    assets: mockAssets[3],
    users: { ...mockUsers[0], display_name: 'มานะ อดทน', department: 'Marketing' },
  }
];
