import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { useUpdateScheduleMutation } from "../../../store/api/schedulesApiSlice";

interface Schedule {
  id: string;
  roomId: string;
  startTime: string | Date;
  endTime: string | Date;
}

interface EditScheduleDialogProps {
  open: boolean;
  schedule: Schedule;
  onClose: () => void;
}

const EditScheduleDialog: React.FC<EditScheduleDialogProps> = ({
  open,
  schedule,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
  });

  const [updateSchedule, { isLoading }] = useUpdateScheduleMutation();

  // Initialize form with schedule data
  useEffect(() => {
    if (schedule) {
      // Convert Date objects to string format for datetime-local input
      const formatDateForInput = (date: string | Date): string => {
        return new Date(date).toISOString().slice(0, 16);
      };

      setFormData({
        startTime: formatDateForInput(schedule.startTime),
        endTime: formatDateForInput(schedule.endTime),
      });
    }
  }, [schedule]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: unknown } }
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as string]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSchedule({
        id: schedule.id,
        data: {
          startTime: new Date(formData.startTime),
          endTime: new Date(formData.endTime),
        },
      }).unwrap();

      onClose();
    } catch (error) {
      console.error("Failed to update schedule:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Schedule</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              name="startTime"
              label="Start Time"
              type="datetime-local"
              value={formData.startTime}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              name="endTime"
              label="End Time"
              type="datetime-local"
              value={formData.endTime}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Update Schedule"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditScheduleDialog;
