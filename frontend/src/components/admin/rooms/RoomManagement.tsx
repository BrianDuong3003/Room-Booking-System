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
} from "@mui/material";
import {
  useGetRoomsQuery,
  useDeleteRoomMutation,
  useSearchRoomsQuery,
  Room,
  PaginationOptions,
} from "../../../store/api/roomsApiSlice";
import CreateRoomDialog from "./CreateRoomDialog";
import EditRoomDialog from "./EditRoomDialog";
// import { useAuth } from '../../hooks/useAuth'; // Assume you have an auth hook

const RoomManagement: React.FC = () => {
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

  // Auth
  const { user } = { user: { role: "ADMIN" } }; // = useAuth(); // Assume you have an auth hook
  const isAdmin = user?.role === "ADMIN";

  // API hooks
  const {
    data: roomsData,
    isLoading: isLoadingRooms,
    refetch: refetchRooms,
  } = useGetRoomsQuery(paginationOptions);

  const [deleteRoom] = useDeleteRoomMutation();

  const {
    data: searchResults,
    isLoading: isSearching,
    refetch: refetchSearch,
  } = useSearchRoomsQuery({ term: searchTerm }, { skip: !searchTerm });

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

  // Determine which rooms to display
  const rooms = searchTerm ? searchResults?.rooms : roomsData?.rooms;
  const isLoading = isLoadingRooms || isSearching;

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Room Management</Typography>
        {isAdmin && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenCreateDialog(true)}
          >
            Add New Room
          </Button>
        )}
      </Box>

      <Box display="flex" mb={3}>
        <TextField
          label="Search Rooms"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          fullWidth
          sx={{ mr: 2 }}
        />

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={paginationOptions.sortBy}
            onChange={handleSortChange}
            label="Sort By"
          >
            <MenuItem value="name">Name</MenuItem>
            {/* <MenuItem value="capacity">Capacity</MenuItem>
            <MenuItem value="floor">Floor</MenuItem> */}
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          onClick={handleSortOrderChange}
          sx={{ ml: 1 }}
        >
          {paginationOptions.sortOrder === "asc" ? "↑" : "↓"}
        </Button>
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
                  {isAdmin && <TableCell>Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {rooms?.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell>{room.name}</TableCell>
                    <TableCell>{room.building}</TableCell>
                    <TableCell>{room.floor}</TableCell>
                    <TableCell>{room.capacity}</TableCell>
                    <TableCell>{room.status || "AVAILABLE"}</TableCell>
                    {isAdmin && (
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
                        >
                          Delete
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {!searchTerm && roomsData?.pagination && (
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

export default RoomManagement;
