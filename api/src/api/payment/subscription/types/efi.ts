export type EfiPlan = {
  plan_id: number;
  name: string;
  interval: number;
  created_at: string;
}

export type EfiGetSubscriptionLink = {
  code: number;
  data: {
    subscription_id: number;
    status: string;
    custom_id: string;
    charge: {
      id: number;
      status: string;
      total: number;
      parcel: number;
    };
    payment_url: string;
    payment_method: string;
    conditional_discount_date: string | null;
    request_delivery_address: boolean;
    message: string;
    expire_at: string;
    created_at: string;
  };
}
interface Status {
  current: string;
  previous: string | null;
}

interface Identifiers {
  subscription_id: number;
  charge_id?: number;
}

export type EfiGetNotification = {
  code: number;
  data: {
    id: number;
    type: "subscription_charge" | 'subscription';
    custom_id: string;
    status: Status;
    identifiers: Identifiers;
    created_at: string;
  }[];
}