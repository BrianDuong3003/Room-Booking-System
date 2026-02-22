import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress,
} from "@mui/material";
import { Room, useUpdateRoomMutation } from "../../../store/api/roomsApiSlice";

interface EditRoomDialogProps {
  open: boolean;
  room: Room;
  onClose: () => void;
}

const EditRoomDialog: React.FC<EditRoomDialogProps> = ({
  open,
  room,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    capacity: 0,
    buildingId: "",
    floor: 0,
    status: "AVAILABLE",
  });

  const [updateRoom, { isLoading }] = useUpdateRoomMutation();

  // Initialize form with room data
  useEffect(() => {
    if (room) {
      setFormData({
        name: room.name,
        capacity: room.capacity,
        buildingId: room.buildingId || "",
        floor: room.floor,
        status: room.status || "AVAILABLE",
      });
    }
  }, [room]);

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
      await updateRoom({
        id: room.id,
        data: {
          name: formData.name,
          capacity: Number(formData.capacity),
          buildingId: formData.buildingId,
          floor: Number(formData.floor),
          status: formData.status,
        },
      }).unwrap();

      onClose();
    } catch (error) {
      console.error("Failed to update room:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Room</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              name="name"
              label="Room Name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              name="capacity"
              label="Capacity"
              type="number"
              value={formData.capacity}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              name="buildingId"
              label="Building ID"
              value={formData.buildingId}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              name="floor"
              label="Floor"
              type="number"
              value={formData.floor}
              onChange={handleChange}
              fullWidth
              required
            />

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                label="Status"
                onChange={handleChange}
              >
                <MenuItem value="AVAILABLE">Available</MenuItem>
                <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
                <MenuItem value="OCCUPIED">Occupied</MenuItem>
              </Select>
            </FormControl>
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
            {isLoading ? <CircularProgress size={24} /> : "Update Room"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditRoomDialog;
