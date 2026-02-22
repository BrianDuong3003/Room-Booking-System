/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSlice } from "./apiSlice";

// Define types for your data
export interface Room {
  id: string;
  name: string;
  capacity: number;
  building: string;
  buildingId?: string;
  floor: number;
  status?: string;
}

export interface ScheduleItem {
  id: number;
  time: string;
  title: string;
  lecturer: string;
  status: "scheduled" | "available";
}

export interface RoomSchedule {
  roomId: string;
  date: string;
  schedule: ScheduleItem[];
}

// Update the BookingRequest interface to match expected backend format
export interface BookingRequest {
  roomScheduleId: string;
  purpose: string;
}

export interface RoomSearchParams {
  term: string;
}

export interface RoomAvailabilityParams {
  startTime: string;
  endTime: string;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreateRoomRequest {
  name: string;
  capacity: number;
  buildingId: string;
  floor: number;
  status?: string;
}

export interface UpdateRoomRequest {
  name?: string;
  capacity?: number;
  buildingId?: string;
  floor?: number;
  status?: string;
}

// Extend the apiSlice with room-specific endpoints
export const roomsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRooms: builder.query<
      { rooms: Room[]; pagination: any },
      PaginationOptions | void
    >({
      query: (options = {}) => {
        const {
          page = 1,
          limit = 10,
          sortBy = "name",
          sortOrder = "asc",
        } = options as PaginationOptions;
        return `/rooms?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
      },
      providesTags: ["Rooms"],
    }),

    getRoomById: builder.query<{ room: Room }, string>({
      query: (id) => `/rooms/${id}`,
      providesTags: (result, error, id) => [{ type: "Rooms", id }],
    }),

    getRoomSchedule: builder.query<
      RoomSchedule,
      { roomId: string; date: string }
    >({
      query: ({ roomId, date }) => `/rooms/${roomId}/schedule?date=${date}`,
      providesTags: (result, error, arg) => [
        { type: "Rooms", id: arg.roomId },
        { type: "Bookings" },
      ],
    }),

    bookRoom: builder.mutation<void, BookingRequest>({
      query: (bookingData) => ({
        url: "/bookings/book",
        method: "POST",
        body: bookingData,
      }),
      invalidatesTags: ["Bookings", "Rooms"],
    }),

    // New endpoints
    createRoom: builder.mutation<
      { message: string; room: Room },
      CreateRoomRequest
    >({
      query: (roomData) => ({
        url: "/rooms/create",
        method: "POST",
        body: roomData,
      }),
      invalidatesTags: ["Rooms"],
    }),

    updateRoom: builder.mutation<
      { message: string; room: Room },
      { id: string; data: UpdateRoomRequest }
    >({
      query: ({ id, data }) => ({
        url: `/rooms/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Rooms", id: arg.id },
        "Rooms",
      ],
    }),

    deleteRoom: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/rooms/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Rooms"],
    }),

    searchRooms: builder.query<{ rooms: Room[] }, RoomSearchParams>({
      query: ({ term }) => `/rooms/search?term=${term}`,
      providesTags: ["Rooms"],
    }),

    getAvailableRooms: builder.query<
      { availableRooms: Room[] },
      RoomAvailabilityParams
    >({
      query: ({ startTime, endTime }) =>
        `/rooms/:id/availability?startTime=${startTime}&endTime=${endTime}`,
      providesTags: ["Rooms"],
    }),
  }),
});

// Export the auto-generated hooks
export const {
  useGetRoomsQuery,
  useGetRoomByIdQuery,
  useGetRoomScheduleQuery,
  useBookRoomMutation,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
  useSearchRoomsQuery,
  useGetAvailableRoomsQuery,
} = roomsApiSlice;
