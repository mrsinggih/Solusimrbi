/**
 * Midtrans Payment Service Helper
 * Solusi Mr Bi - Professional Payment gateway proxy
 */

import { formatRupiah } from "../utils/formatter";

export interface TransactionPayload {
  orderId: string;
  grossAmount: number;
  itemName: string;
  customerName: string;
  customerEmail: string;
}

export const generateMidtransPayment = async (payload: TransactionPayload): Promise<{ redirectUrl: string; token: string }> => {
  console.log(`[Midtrans Payment Integration] - Creating snap token for order ${payload.orderId}`, payload);
  
  // Real full-stack architectures proxy this server-side to keep secrets safe.
  // We simulate a verified response from Midtrans sandbox API.
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        redirectUrl: `https://app.sandbox.midtrans.com/snap/v2/vtweb/${Math.random().toString(36).substr(2, 9)}`,
        token: `snap-token-${Math.random().toString(36).substr(2, 12).toUpperCase()}`,
      });
    }, 600);
  });
};
