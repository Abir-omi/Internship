export type PlotStatus = 'Available' | 'Booked' | 'Sold' | 'Reserved';
export type PlotType = 'Residential' | 'Commercial' | 'Corner Plot' | 'Lake View' | 'Standard';
export type PaymentMethod = 'Cash' | 'Bank Transfer' | 'Cheque' | 'bKash' | 'Nagad';
export type ExpenseCategory = 
  | 'Land Purchase' 
  | 'Land Registration & Legal' 
  | 'Earth Filling & Development' 
  | 'Boundary Wall & Roads' 
  | 'Site Office & Salaries' 
  | 'Marketing & Brokerage' 
  | 'Utilities & Drainage' 
  | 'Miscellaneous';

export interface Plot {
  id: string;
  projectId: string;
  plotNo: string;
  block: string;
  roadNo: string;
  sizeKatha: number; // in Katha
  ratePerKatha: number; // in BDT
  totalPrice: number; // in BDT
  bookingMoney: number;
  status: PlotStatus;
  type: PlotType;
  assignedMemberId?: string;
  assignedMemberName?: string;
  facing?: string;
  description?: string;
  createdAt: string;
}

export interface Member {
  id: string;
  projectId: string;
  memberCode: string; // e.g. HP-0104
  name: string;
  banglaName?: string;
  phone: string;
  email?: string;
  nidOrPassport: string;
  address: string;
  nomineeName: string;
  nomineeRelation: string;
  nomineePhone?: string;
  assignedPlotIds: string[];
  totalInvestment: number;
  joinedDate: string;
  notes?: string;
}

export interface Collection {
  id: string;
  projectId: string;
  receiptNo: string; // e.g. REC-2025-0012
  date: string;
  memberId: string;
  memberName: string;
  plotId?: string;
  plotNo?: string;
  amount: number;
  paymentMethod: PaymentMethod;
  bankName?: string;
  chequeOrTrxNo?: string;
  chequeDate?: string;
  installmentMonth?: string;
  purpose: 'Booking Money' | 'Down Payment' | 'Monthly Installment' | 'Registration Fee' | 'Share Capital' | 'Other';
  collectedBy: string;
  remarks?: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  projectId: string;
  voucherNo: string; // e.g. EXP-2025-0043
  date: string;
  category: ExpenseCategory;
  payee: string;
  amount: number;
  paymentMethod: PaymentMethod;
  bankOrAccount?: string;
  purpose: string;
  authorizedBy: string;
  billOrRef?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  banglaName: string;
  company: string;
  location: string;
  totalArea: string; // e.g. 25 Bigha (500 Katha)
  totalPlots: number;
  totalShares: number;
  startDate: string;
  expectedCompletion: string;
  status: 'Ongoing' | 'Upcoming' | 'Completed';
  currency: string;
}
