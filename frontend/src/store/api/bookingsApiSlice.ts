/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSlice } from "./apiSlice";

// Define types for bookings data
export interface Building {
  id: string;
  name: string;
  address: string;
  floors: number;
  closingTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: string;
  name: string;
  description: string | null;
  capacity: number;
  buildingId: string;
  floor: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  building: Building;
}

export interface RoomSchedule {
  id: string;
  roomId: string;
  startTime: string;
  endTime: string;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  room: Room;
}

export interface Booking {
  id: string;
  roomScheduleId: string;
  userId: string;
  purpose: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
  version: number;
  RoomSchedule: RoomSchedule;
}

export interface CancelBookingRequest {
  bookingId: string;
}

// Extend the apiSlice with booking-specific endpoints
export const bookingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyBookings: builder.query<Booking[], void>({
      query: () => `/bookings/my-bookings`,
      providesTags: ["Bookings"],
    }),
    
    cancelBooking: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/bookings/cancel/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Bookings"],
    }),
  }),
});

// Export the auto-generated hooks
export const {
  useGetMyBookingsQuery,
  useCancelBookingMutation,
} = bookingsApiSlice;
