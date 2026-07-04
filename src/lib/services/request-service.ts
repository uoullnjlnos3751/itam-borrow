import { supabase } from '../supabase';
import { BorrowRequest, RequestStatus } from '../database.types';
import { mockActiveBorrowRequests, mockApprovedRequests, mockPendingRequests, mockBorrowRequests } from '../mock-data';

const isMock = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true';

export async function getUserRequests(userId: string): Promise<BorrowRequest[]> {
  if (isMock) {
    const allMockRequests = [
      ...mockPendingRequests,
      ...mockApprovedRequests,
      ...mockActiveBorrowRequests,
      ...mockBorrowRequests
    ].filter(r => r.user_id === userId);
    return Promise.resolve(allMockRequests);
  }

  const { data, error } = await supabase
    .from('borrow_requests')
    .select('*, assets(*, asset_categories(*)), approver:users!approved_by(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user requests:', error);
    return [];
  }

  return data as BorrowRequest[];
}

export async function createBorrowRequest(requestData: Partial<BorrowRequest>): Promise<BorrowRequest | null> {
  if (isMock) {
    console.log("Mock create request:", requestData);
    // return a dummy request for UI to show success
    return Promise.resolve({
      id: `req-mock-${Date.now()}`,
      request_no: `REQ-MOCK-${Date.now().toString().slice(-4)}`,
      status: 'pending',
      ...requestData
    } as BorrowRequest);
  }

  const { data, error } = await supabase
    .from('borrow_requests')
    .insert([requestData])
    .select()
    .single();

  if (error) {
    console.error('Error creating request:', error);
    return null;
  }

  // Trigger Notification API call here in production
  fetch('/api/notify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'request_submitted', data })
  }).catch(e => console.error("Notification trigger failed", e));

  return data as BorrowRequest;
}

export async function updateRequestStatus(id: string, status: RequestStatus, updateData: Partial<BorrowRequest> = {}): Promise<boolean> {
  if (isMock) {
    console.log(`Mock update request ${id} to status ${status}`, updateData);
    return Promise.resolve(true);
  }

  const { error } = await supabase
    .from('borrow_requests')
    .update({ status, ...updateData })
    .eq('id', id);

  if (error) {
    console.error(`Error updating request ${id}:`, error);
    return false;
  }

  // Trigger Notification API call
  fetch('/api/notify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: `request_${status}`, data: { id, status, ...updateData } })
  }).catch(e => console.error("Notification trigger failed", e));

  return true;
}
