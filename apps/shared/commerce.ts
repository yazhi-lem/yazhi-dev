"use client";
import { useShared } from "@yazhi/workspace";
import { INITIAL_ORDERS, INITIAL_TICKETS, type Order, type ReturnRequest, type Ticket } from "./commerce-data";

/** The shop's records as live stores: one store, shared in memory by Kadai
    and Kural, so an order taken at Kadai's counter is the order Kural
    tracks for the customer. The data itself is in commerce-data.ts. */

export { CATALOGUE, INITIAL_ORDERS, INITIAL_TICKETS, KB, NEXT_STATUS, RETURN_STAGES, STATUS_LABEL } from "./commerce-data";
export type { Order, OrderStatus, ReturnRequest, Ticket } from "./commerce-data";

export const useOrders = () => useShared<Order[]>("shop.orders", INITIAL_ORDERS);
export const useTickets = () => useShared<Ticket[]>("shop.tickets", INITIAL_TICKETS);
export const useReturns = () => useShared<ReturnRequest[]>("shop.returns", []);
