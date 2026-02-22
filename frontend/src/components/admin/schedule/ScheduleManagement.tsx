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
} from "@mui/material";
import {
  useGetAllSchedulesQuery,
  useDeleteScheduleMutation,
  Schedule,
} from "../../../store/api/schedulesApiSlice";
import CreateScheduleDialog from "./CreateScheduleDialog";
import EditScheduleDialog from "./EditScheduleDialog";
import { format } from "date-fns";

const ScheduleManagement: React.FC = () => {
  // State
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);

  // API hooks
  const {
    data: schedulesData,
    error,
    isLoading,
    refetch,
  } = useGetAllSchedulesQuery();

  const [deleteSchedule] = useDeleteScheduleMutation();

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

  if (isLoading) {
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
        <Typography variant="h4">Schedule Management</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setCreateDialogOpen(true)}
        >
          Create Schedule
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Room</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedulesData?.schedules?.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell>{schedule.room?.name || schedule.roomId}</TableCell>
                <TableCell>
                  {format(new Date(schedule.startTime), "MMM dd, yyyy HH:mm")}
                </TableCell>
                <TableCell>
                  {format(new Date(schedule.endTime), "MMM dd, yyyy HH:mm")}
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleEdit(schedule)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(schedule.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {(!schedulesData?.schedules ||
              schedulesData.schedules.length === 0) && (
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
    </Box>
  );
};

// Remove unused interface as the props are defined in the component itself
export default ScheduleManagement;
