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
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  Grid,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  useGetRoomsQuery,
  useDeleteRoomMutation,
  useSearchRoomsQuery,
  useGetAvailableRoomsQuery,
  Room,
  PaginationOptions,
} from "../../store/api/roomsApiSlice";
import CreateRoomDialog from "../admin/rooms/CreateRoomDialog";
import EditRoomDialog from "../admin/rooms/EditRoomDialog";
// import { useAuth } from '../../hooks/useAuth'; // Assume you have an auth hook

const ClassroomSearch: React.FC = () => {
  // State
  const [paginationOptions, setPaginationOptions] = useState<PaginationOptions>(
    {
      page: 1,
      limit: 10,
      sortBy: "name",
      sortOrder: "asc",
    }
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [editRoom, setEditRoom] = useState<Room | null>(null);

  // New state for time filtering
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [useTimeFilter, setUseTimeFilter] = useState(false);

  // Auth
  const { user } = { user: { role: "ADMIN" } }; // = useAuth(); // Assume you have an auth hook
  const isAdmin = user?.role === "ADMIN";

  // API hooks
  const {
    data: roomsData,
    isLoading: isLoadingRooms,
    refetch: refetchRooms,
  } = useGetRoomsQuery(paginationOptions, { skip: useTimeFilter });

  const [deleteRoom] = useDeleteRoomMutation();

  const {
    data: searchResults,
    isLoading: isSearching,
    refetch: refetchSearch,
  } = useSearchRoomsQuery(
    { term: searchTerm },
    { skip: !searchTerm || useTimeFilter }
  );

  // New query for time-filtered rooms
  const {
    data: availableRoomsData,
    isLoading: isLoadingAvailable,
    refetch: refetchAvailable,
  } = useGetAvailableRoomsQuery(
    {
      startTime: startTime?.toISOString() || "",
      endTime: endTime?.toISOString() || "",
    },
    { skip: !startTime || !endTime || !useTimeFilter }
  );

  // Handlers
  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setPaginationOptions({ ...paginationOptions, page });
  };

  const handleSortChange = (
    event: React.ChangeEvent<HTMLInputElement> | { target: { value: unknown } }
  ) => {
    setPaginationOptions({
      ...paginationOptions,
      sortBy: event.target.value as string,
    });
  };

  const handleSortOrderChange = () => {
    setPaginationOptions({
      ...paginationOptions,
      sortOrder: paginationOptions.sortOrder === "asc" ? "desc" : "asc",
    });
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setUseTimeFilter(false); // Disable time filter when searching
    if (event.target.value) {
      refetchSearch();
    } else {
      refetchRooms();
    }
  };

  const handleEditRoom = (room: Room) => {
    setEditRoom(room);
  };

  const handleDeleteRoom = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await deleteRoom(id);
      } catch (error) {
        console.error("Failed to delete room", error);
      }
    }
  };

  // New handlers for time filtering
  const handleApplyTimeFilter = () => {
    if (startTime && endTime) {
      setUseTimeFilter(true);
      setSearchTerm(""); // Clear search term when filtering by time
      refetchAvailable();
    }
  };

  const handleResetTimeFilter = () => {
    setStartTime(null);
    setEndTime(null);
    setUseTimeFilter(false);
    refetchRooms();
  };

  // Determine which rooms to display
  let rooms: Room[] | undefined;
  if (useTimeFilter) {
    rooms = availableRoomsData?.availableRooms;
  } else if (searchTerm) {
    rooms = searchResults?.rooms;
  } else {
    rooms = roomsData?.rooms;
  }

  const isLoading = isLoadingRooms || isSearching || isLoadingAvailable;

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        {/* <Typography variant="h4">Room Management</Typography>
        {isAdmin && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenCreateDialog(true)}
          >
            Add New Room
          </Button>
        )} */}
      </Box>

      <Box mb={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Search Rooms"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearch}
              fullWidth
              disabled={useTimeFilter}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={paginationOptions.sortBy}
                onChange={handleSortChange}
                label="Sort By"
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="capacity">Capacity</MenuItem>
                <MenuItem value="floor">Floor</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={1}>
            <Button
              variant="outlined"
              onClick={handleSortOrderChange}
              fullWidth
              sx={{ height: "100%" }}
            >
              {paginationOptions.sortOrder === "asc" ? "↑" : "↓"}
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Time filter section */}
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

      {isLoading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Building</TableCell>
                  <TableCell>Floor</TableCell>
                  <TableCell>Capacity</TableCell>
                  <TableCell>Status</TableCell>
                  {/* Assuming room.status is a string */}
                  {/* {isAdmin && <TableCell>Actions</TableCell>} */}
                </TableRow>
              </TableHead>
              <TableBody>
                {rooms?.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell>{room.name}</TableCell>
                    <TableCell>{room.building}</TableCell>
                    <TableCell>{room.floor}</TableCell>
                    <TableCell>{room.capacity}</TableCell>
                    {/* Assuming room.status is a string */}
                    <TableCell>{room.status || "AVAILABLE"}</TableCell>
                    {/* {isAdmin && (
                      <TableCell>
                        <Button
                          size="small"
                          color="primary"
                          onClick={() => handleEditRoom(room)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleDeleteRoom(room.id)}
                          sx={{ ml: 1 }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    )} */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {!searchTerm && !useTimeFilter && roomsData?.pagination && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={roomsData.pagination.totalPages}
                page={paginationOptions.page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      <CreateRoomDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
      />

      {editRoom && (
        <EditRoomDialog
          open={Boolean(editRoom)}
          room={editRoom}
          onClose={() => setEditRoom(null)}
        />
      )}
    </Box>
  );
};

export default ClassroomSearch;
