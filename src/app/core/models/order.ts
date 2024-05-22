import { OrderItem } from "./oreder-item";

export interface Order {
  projectId: number;
  projectNumber: string;
  projectName?: string;
  email?: string;
  contactName1?: string;
  contactName2?: string;
  contactPhone1?: string;
  contactPhone2?: string;
  workplace?: string;
  street?: string;
  city?: string;
  zip?: string;
  date?: string;
  time?: string;
  deliverEmail?: string;
  other?: string;
  items?: OrderItem[];
  ataId: number;
  supplierId?: number;
  currentDate?: string;
  currentTime?: string;
  deliveryId?: number;
  deliveryName?: string;
  status?: string;
  generalImage?: string;
  ataNumber?: number;
  orderID?: number;
  token?: string;
  ordererId?: number;
}
