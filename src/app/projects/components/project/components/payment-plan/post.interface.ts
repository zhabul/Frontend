export class PostRequest {
  id: number;
  date: string;
  dueDate: string;
  revisionDate: string;
  status: string;
  percentage: number;
  percentage_ca: number;
  description: string;
  sumAmount: number;
  sumBalance: number;
  sumArrears: number;
  sumInvoiced: number;
  isSaved: string;
  isLocked: string;
  parentPaymentPlan: number;
  paymentPlanNumber: number;
  amount_by_percentage: number;
  article: [
    {
      id: number;
      Name: string;
      Invoice_day: string;
      Amount: number;
      Balance: number;
      Arrears: number;
      Invoiced: number;
      Activity: string;
      Invoice_date: string;
      ProjectRangeid: number;
      Sort: number;
      Month: string;
      articleId: number;
    }
  ];
}
