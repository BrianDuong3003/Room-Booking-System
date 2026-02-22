import { apiSlice } from "./apiSlice";

export interface Schedule {
  id: string;
  roomId: string;
  room?: {
    id: string;
    name: string;
  };
  startTime: string;
  endTime: string;
  createdAt?: string;
  updatedAt?: string;
  status?: string; // Add the status field if it doesn't exist
}

export interface ScheduleResponse {
  schedules: Schedule[];
  total: number;
}

export interface CreateScheduleRequest {
  roomId: string;
  startTime: Date | string;
  endTime: Date | string;
}

export interface UpdateScheduleRequest {
  startTime?: Date | string;
  endTime?: Date | string;
}

export const schedulesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllSchedules: builder.query<ScheduleResponse, void>({
      query: () => ({
        url: "/schedules",
      }),
      providesTags: ["Schedules"],
    }),

    getScheduleById: builder.query<{ schedule: Schedule }, string>({
      query: (id) => `/schedules/${id}`,
      providesTags: (result, error, id) => [{ type: "Schedules", id }],
    }),

    getSchedulesByRoom: builder.query<
      { schedules: Schedule[] },
      { roomName: string; date: string }
    >({
      query: ({ roomName, date }) => ({
        url: `/schedules/room/${roomName}`,
        params: { date },
      }),
      providesTags: ["Schedules"],
    }),

    createSchedule: builder.mutation<
      { schedule: Schedule },
      CreateScheduleRequest
    >({
      query: (schedule) => ({
        url: "/schedules/create",
        method: "POST",
        body: schedule,
      }),
      invalidatesTags: ["Schedules"],
    }),

    updateSchedule: builder.mutation<
      { schedule: Schedule },
      { id: string; data: UpdateScheduleRequest }
    >({
      query: ({ id, data }) => ({
        url: `/schedules/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Schedules", id }],
    }),

    deleteSchedule: builder.mutation<void, string>({
      query: (id) => ({
        url: `/schedules/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Schedules"],
    }),

    getAvailableSchedules: builder.query<
      ScheduleResponse,
      { startTime: string; endTime: string }
    >({
      query: ({ startTime, endTime }) => ({
        url: "/schedules/available",
        params: { startTime, endTime },
      }),
      providesTags: ["Schedules"],
    }),
  }),
});

export const {
  useGetAllSchedulesQuery,
  useGetScheduleByIdQuery,
  useGetSchedulesByRoomQuery,
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
  useGetAvailableSchedulesQuery,
} = schedulesApiSlice;
