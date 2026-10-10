// Mock registered directors/related parties until the invite API is available

export interface Invitee {
  id: string;
  name: string;
  email: string;
  mobile: string;
  /** Roles the person already holds in the business. */
  businessRoles: string[];
}

export const DIRECTORS: Invitee[] = [
  {
    id: 'tasmin-reilly',
    name: 'Tasmin Reilly',
    email: 'tasminreilly@abcarchitects.co.za',
    mobile: '079 120 5680',
    businessRoles: ['Director', 'Signatory', 'Authorised Card User'],
  },
  {
    id: 'jonathan-khumalo',
    name: 'Jonathan Khumalo',
    email: 'jonathankhumalo@abcarchitects.co.za',
    mobile: '082 670 1234',
    businessRoles: ['Director'],
  },
];
