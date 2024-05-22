export interface User {
  id?: number;
  username?: string;
  password?: string;
  language?: string;
  newPassword?: string;
  email?: string;
  hourlyRate?: string;
  hourlyRateDate?: string;
  firstname?: string;
  lastname?: string;
  Notification?: any;
  startDate?: string;
  endDate?: string;
  phone?: string;
  role?: number;
  roleSet?: any[];
  type?: string;
  status?: string;
  personalNumber?: number;
  employeeNumber?: number;
  bankNumber?: number;
  accountNumber?: number;
  bic?: number;
  iban?: number;
  zipCode?: number;
  mobile?: string;
  mobile2?: string;
  city?: string;
  postalAddress1?: string;
  postalAddress2?: string;
  familyMemberName1?: string;
  familyMemberPhone1?: string;
  familyMemberNote1?: string;
  familyMemberName2?: string;
  familyMemberPhone2?: string;
  familyMemberNote2?: string;
  userOpts?: any[];
  defaultMoments?: any[];
  profession?: number;
  hourlyRates?: any;
  shareMobilePhoneNumber?: boolean;
  shareEmail?: boolean;
}