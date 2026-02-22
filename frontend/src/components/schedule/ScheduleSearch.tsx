/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  useGetAllSchedulesQuery,
  useDeleteScheduleMutation,
  useGetAvailableSchedulesQuery,
  Schedule,
} from "../../store/api/schedulesApiSlice";
import { useBookRoomMutation } from "../../store/api/roomsApiSlice";
import CreateScheduleDialog from "../admin/schedule/CreateScheduleDialog";
import EditScheduleDialog from "../admin/schedule/EditScheduleDialog";
import { format } from "date-fns";

const ScheduleSearch: React.FC = () => {
  // State
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  // In ScheduleSearch.tsx, ensure the time state variables are set correctly:
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [useTimeFilter, setUseTimeFilter] = useState(false);

  // New state for booking
  const [isBookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [bookingPurpose, setBookingPurpose] = useState("");

  // API hooks
  const {
    data: schedulesData,
    error,
    isLoading,
    refetch,
  } = useGetAllSchedulesQuery(undefined, { skip: useTimeFilter });

  // API query with skip if not filtered
  const {
    data: availableSchedulesData,
    isLoading: isLoadingAvailable,
    refetch: refetchAvailable,
  } = useGetAvailableSchedulesQuery(
    {
      startTime: startTime?.toISOString() || "",
      endTime: endTime?.toISOString() || "",
    },
    { skip: !startTime || !endTime || !useTimeFilter }
  );

  const [deleteSchedule] = useDeleteScheduleMutation();

  // Add booking mutation
  const [bookRoom, { isLoading: isBooking }] = useBookRoomMutation();

  // Time filter handlers
  const handleApplyTimeFilter = () => {
    if (startTime && endTime) {
      setUseTimeFilter(true);
      refetchAvailable();
    }
  };

  const handleResetTimeFilter = () => {
    setStartTime(null);
    setEndTime(null);
    setUseTimeFilter(false);
    refetch();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      try {
        await deleteSchedule(id);
        refetch();
      } catch (error) {
        console.error("Failed to delete schedule", error);
      }
    }
  };

  const handleEdit = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setEditDialogOpen(true);
  };

  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
    refetch();
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedSchedule(null);
    refetch();
  };

  // New handler for booking
  const handleBookClick = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setBookingDialogOpen(true);
  };

  const handleBookSubmit = async () => {
    if (!selectedSchedule || !bookingPurpose.trim()) return;

    try {
      await bookRoom({
        roomScheduleId: selectedSchedule.id,  // Use roomScheduleId directly
        purpose: bookingPurpose,              // Use purpose instead of title
      }).unwrap();

      // Reset form and close dialog
      setBookingDialogOpen(false);
      setBookingPurpose("");
      setSelectedSchedule(null);

      // Refresh data
      if (useTimeFilter) {
        refetchAvailable();
      } else {
        refetch();
      }

      // Show success message
      alert("Room booked successfully!");
    } catch (error) {
      console.error("Failed to book room:", error);
      alert("Failed to book the room. Please try again.");
    }
  };

  // Determine which schedules to display
  const schedules = useTimeFilter
    ? availableSchedulesData?.schedules
    : schedulesData?.schedules;

  if (isLoading || isLoadingAvailable) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3} bgcolor="#fee" border="1px solid #f99" borderRadius={1}>
        <Typography color="error">
          Error loading schedules. Please try again later.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Schedule </Typography>
        {/* <Button
          variant="contained"
          color="primary"
          onClick={() => setCreateDialogOpen(true)}
        >
          Create Schedule
        </Button> */}
      </Box>
      <Box mb={3} p={2} border="1px solid #e0e0e0" borderRadius={1}>
        <Typography variant="h6" mb={2}>
          Filter by Availability
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <DateTimePicker
                label="Start Time"
                value={startTime}
                onChange={(newValue) => setStartTime(newValue)}
                sx={{ width: "100%" }}
                disabled={useTimeFilter}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <DateTimePicker
                label="End Time"
                value={endTime}
                onChange={(newValue) => setEndTime(newValue)}
                sx={{ width: "100%" }}
                disabled={useTimeFilter}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleApplyTimeFilter}
                disabled={!startTime || !endTime || useTimeFilter}
                sx={{ mr: 1, height: "100%" }}
              >
                Find Available
              </Button>
              {useTimeFilter && (
                <Button
                  variant="outlined"
                  onClick={handleResetTimeFilter}
                  sx={{ height: "100%" }}
                >
                  Reset
                </Button>
              )}
            </Grid>
          </Grid>
        </LocalizationProvider>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: '#333', fontSize: '1rem' }}>Room</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#333', fontSize: '1rem' }}>Start Time</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#333', fontSize: '1rem' }}>End Time</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#333', fontSize: '1rem' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedules?.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell>
                  <Typography fontWeight="bold">
                    {schedule.room?.name || schedule.roomId}
                  </Typography>
                </TableCell>
                <TableCell>
                  {format(new Date(schedule.startTime), "MMM dd, yyyy HH:mm")}
                </TableCell>
                <TableCell>
                  {format(new Date(schedule.endTime), "MMM dd, yyyy HH:mm")}
                </TableCell>
                <TableCell>
                  {schedule.status === "RESERVED" ? (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'error.main', 
                        fontWeight: 'bold',
                        border: '1px solid #ffcccc',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        display: 'inline-block',
                        backgroundColor: '#fff8f8'
                      }}
                    >
                      RESERVED
                    </Typography>
                  ) : (
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={() => handleBookClick(schedule)}
                      sx={{ mr: 1 }}
                    >
                      Book
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {(!schedules || schedules.length === 0) && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="body1" py={2}>
                    No schedules found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <CreateScheduleDialog
        open={isCreateDialogOpen}
        onClose={handleCreateDialogClose}
      />

      {selectedSchedule && (
        <EditScheduleDialog
          open={isEditDialogOpen}
          onClose={handleEditDialogClose}
          schedule={selectedSchedule}
        />
      )}

      {/* Booking Dialog */}
      <Dialog
        open={isBookingDialogOpen}
        onClose={() => setBookingDialogOpen(false)}
      >
        <DialogTitle>Book Room</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are booking{" "}
            {selectedSchedule?.room?.name || selectedSchedule?.roomId} for{" "}
            {selectedSchedule &&
              format(new Date(selectedSchedule.startTime), "MMM dd, yyyy HH:mm")}{" "}
            to{" "}
            {selectedSchedule &&
              format(new Date(selectedSchedule.endTime), "MMM dd, yyyy HH:mm")}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="purpose"
            label="Booking Purpose"
            type="text"
            fullWidth
            variant="outlined"
            value={bookingPurpose}
            onChange={(e) => setBookingPurpose(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleBookSubmit}
            color="primary"
            variant="contained"
            disabled={isBooking || !bookingPurpose.trim()}
          >
            {isBooking ? "Booking..." : "Confirm Booking"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ScheduleSearch;
