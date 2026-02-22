import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  useGetRoomByIdQuery,
  useGetRoomScheduleQuery,
  useBookRoomMutation,
} from "../../../store/api/roomsApiSlice";
import { format } from "date-fns";

const RoomDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [bookingTitle, setBookingTitle] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<number | null>(null);

  const { data: roomData, isLoading: isLoadingRoom } = useGetRoomByIdQuery(
    id || ""
  );

  const formattedDate = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";

  const { data: scheduleData, isLoading: isLoadingSchedule } =
    useGetRoomScheduleQuery(
      {
        roomId: id || "",
        date: formattedDate,
      },
      { skip: !id || !formattedDate }
    );

  const [bookRoom, { isLoading: isBooking }] = useBookRoomMutation();

  const handleDateChange = (newDate: Date | null) => {
    setSelectedDate(newDate);
    setSelectedTimeSlot(null);
  };

  const handleSelectTimeSlot = (timeSlotId: number) => {
    setSelectedTimeSlot(timeSlotId === selectedTimeSlot ? null : timeSlotId);
  };

  const handleBookRoom = async () => {
    if (!id || !selectedDate || selectedTimeSlot === null || !bookingTitle) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      await bookRoom({
        roomScheduleId: selectedTimeSlot.toString(), // Use the timeSlot ID as the roomScheduleId
        purpose: bookingTitle,
      }).unwrap();

      // Reset form after booking
      setBookingTitle("");
      setSelectedTimeSlot(null);
      alert("Room booked successfully!");
    } catch (error) {
      console.error("Failed to book room:", error);
      alert("Failed to book the room. Please try again.");
    }
  };

  if (isLoadingRoom) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!roomData?.room) {
    return (
      <Box textAlign="center" my={4}>
        <Typography variant="h5">Room not found</Typography>
      </Box>
    );
  }

  const { room } = roomData;

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {room.name}
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="subtitle1">
                Building: {room.building}
              </Typography>
              <Typography variant="subtitle1">Floor: {room.floor}</Typography>
              <Typography variant="subtitle1">
                Capacity: {room.capacity} people
              </Typography>
              <Typography variant="subtitle1">
                Status: {room.status || "AVAILABLE"}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box display="flex" justifyContent="flex-end">
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={handleDateChange}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h5" gutterBottom>
        Room Schedule
      </Typography>

      {isLoadingSchedule ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          <Grid container spacing={2}>
            {scheduleData?.schedule.map((slot) => (
              <Grid item xs={12} sm={6} md={4} key={slot.id}>
                <Card
                  sx={{
                    cursor: slot.status === "available" ? "pointer" : "default",
                    bgcolor:
                      selectedTimeSlot === slot.id
                        ? "primary.light"
                        : slot.status === "scheduled"
                        ? "grey.200"
                        : "white",
                  }}
                  onClick={() => {
                    if (slot.status === "available") {
                      handleSelectTimeSlot(slot.id);
                    }
                  }}
                >
                  <CardHeader
                    title={slot.time}
                    subheader={
                      slot.status === "scheduled" ? "Booked" : "Available"
                    }
                  />
                  <CardContent>
                    {slot.status === "scheduled" && (
                      <>
                        <Typography variant="body1">{slot.title}</Typography>
                        <Typography variant="body2">
                          Lecturer: {slot.lecturer}
                        </Typography>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {selectedTimeSlot !== null && (
            <Box mt={4} p={3} border="1px solid #e0e0e0" borderRadius={1}>
              <Typography variant="h6" gutterBottom>
                Book This Time Slot
              </Typography>

              <TextField
                label="Booking Title"
                value={bookingTitle}
                onChange={(e) => setBookingTitle(e.target.value)}
                fullWidth
                margin="normal"
                required
              />

              <Box mt={2} display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="primary"
                  disabled={isBooking || !bookingTitle}
                  onClick={handleBookRoom}
                >
                  {isBooking ? <CircularProgress size={24} /> : "Book Room"}
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default RoomDetails;
