import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";
import { useCreateScheduleMutation } from "../../../store/api/schedulesApiSlice";
import { useGetRoomsQuery } from "../../../store/api/roomsApiSlice";

interface CreateScheduleDialogProps {
  open: boolean;
  onClose: () => void;
}

const CreateScheduleDialog: React.FC<CreateScheduleDialogProps> = ({
  open,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    roomId: "",
    startTime: "",
    endTime: "",
  });

  const [createSchedule, { isLoading }] = useCreateScheduleMutation();
  
  // Fetch rooms with default pagination options
  const { data: roomsData, isLoading: isLoadingRooms } = useGetRoomsQuery({
    page: 1,
    limit: 100, // Fetch enough rooms for the dropdown
    sortBy: "name",
    sortOrder: "asc",
  });

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name?: string; value: unknown } }
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
      await createSchedule({
        roomId: formData.roomId,
        startTime: new Date(formData.startTime),
        endTime: new Date(formData.endTime),
      }).unwrap();

      onClose();
      // Reset form
      setFormData({
        roomId: "",
        startTime: "",
        endTime: "",
      });
    } catch (error) {
      console.error("Failed to create schedule:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Schedule</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <FormControl fullWidth required>
              <InputLabel id="room-select-label">Room</InputLabel>
              <Select
                labelId="room-select-label"
                id="room-select"
                name="roomId"
                value={formData.roomId}
                onChange={handleChange}
                label="Room"
                disabled={isLoadingRooms}
              >
                {isLoadingRooms ? (
                  <MenuItem disabled>Loading rooms...</MenuItem>
                ) : (
                  roomsData?.rooms?.map((room) => (
                    <MenuItem key={room.id} value={room.id}>
                      {room.name} - {room.building}, Floor {room.floor} ({room.capacity} seats)
                    </MenuItem>
                  ))
                )}
              </Select>
              {isLoadingRooms && <FormHelperText>Loading available rooms...</FormHelperText>}
            </FormControl>

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
            disabled={isLoading || isLoadingRooms}
          >
            {isLoading ? <CircularProgress size={24} /> : "Create Schedule"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateScheduleDialog;