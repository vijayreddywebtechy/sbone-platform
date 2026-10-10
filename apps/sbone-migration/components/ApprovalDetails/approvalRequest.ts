// Mock enrolment request until the invite/approvals API is available

export type ApprovalStatus = 'pending' | 'approved' | 'declined';

export interface RequestPerson {
  name: string;
  email: string;
  mobile: string;
  status: ApprovalStatus;
}

export interface ApprovalRequest {
  requester: RequestPerson & { requestedRole: string };
  approvers: RequestPerson[];
  /** Last day the request can be actioned, as shown to the user. */
  validUntil: string;
}

export const APPROVAL_REQUEST: ApprovalRequest = {
  requester: {
    name: 'Kobus Marais',
    requestedRole: 'Administrator (Full Access)',
    email: 'kobus.marais@company.com',
    mobile: '079 123 4567',
    status: 'pending',
  },
  approvers: [
    { name: 'Jonathan K.', email: 'jonathan.khumalo@company.com', mobile: '079 123 4567', status: 'approved' },
    { name: 'Seth Naidu', email: 'seth@company.com', mobile: '079 123 4567', status: 'pending' },
  ],
  validUntil: '31 March',
};
