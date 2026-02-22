import React, { useState } from "react";
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
import { useCreateRoomMutation } from "../../../store/api/roomsApiSlice";

interface CreateRoomDialogProps {
  open: boolean;
  onClose: () => void;
}

const CreateRoomDialog: React.FC<CreateRoomDialogProps> = ({
  open,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    capacity: 0,
    buildingId: "",
    floor: 0,
    status: "AVAILABLE",
  });

  const [createRoom, { isLoading }] = useCreateRoomMutation();

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
      await createRoom({
        name: formData.name,
        capacity: Number(formData.capacity),
        buildingId: formData.buildingId,
        floor: Number(formData.floor),
        status: formData.status,
      }).unwrap();

      onClose();
      // Reset form
      setFormData({
        name: "",
        capacity: 0,
        buildingId: "",
        floor: 0,
        status: "AVAILABLE",
      });
    } catch (error) {
      console.error("Failed to create room:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Room</DialogTitle>
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
            {isLoading ? <CircularProgress size={24} /> : "Create Room"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateRoomDialog;
