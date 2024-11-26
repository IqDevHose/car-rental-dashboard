// type.tsx

export interface UserT {
    id: string;
    name: string;
  }
  
  export interface OrderItem {
    id: string;
    name: string;
  }
  export type StatusT = "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
  
  export interface OrderT {
    id: string;
    userId: string;
    orderItems: OrderItem[];
    status: StatusT;
    createdAt: string;
  }
  
  export interface UpdateOrderStatusParams {
    orderId: string;
    newStatus: StatusT;
  }
  
  export interface RecentSale {
    id: string;
    email: string;
    image: string; // Change this to string
    name: string;
    salesAmount: number;
  }

  export type SalesProps = {
    name: string;
    email: string;
    salesAmount: string;
    image: string; // Change this to string
  };


  export enum DomainTypeEnum {
    IQ = "IQ",
    COM_IQ = "COM_IQ",
    NET_IQ = "NET_IQ",
    ORG_IQ = "ORG_IQ",
    NAME_IQ = "NAME_IQ",
    TV_IQ = "TV_IQ",
  }
