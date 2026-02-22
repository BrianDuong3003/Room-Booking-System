import { useState } from "react";
import { useGetMyBookingsQuery, useCancelBookingMutation, Booking } from "@/store/api/bookingsApiSlice";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Calendar, Clock, Building2, MapPin } from "lucide-react";
import { format } from "date-fns";

const BookingStatusBadge = ({ status }: { status: string }) => {
  const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    APPROVED: "bg-green-100 text-green-800 hover:bg-green-100",
    REJECTED: "bg-red-100 text-red-800 hover:bg-red-100",
    CANCELLED: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    COMPLETED: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  };

  const color = statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800";

  return <Badge className={color}>{status}</Badge>;
};

export default function MyBookingsPage() {
  const { data: bookings, isLoading, isError, refetch } = useGetMyBookingsQuery();
  const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;
    
    try {
      await cancelBooking(selectedBooking.id).unwrap();
      toast({
        title: "Booking cancelled",
        description: "Your booking has been successfully cancelled.",
      });
      setIsDialogOpen(false);
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel the booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy • HH:mm");
    } catch (error) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2">Loading your bookings...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout>
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>
              There was an error loading your bookings. Please try again later.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => refetch()}>Retry</Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Bookings</h1>
          <p className="text-muted-foreground">
            View and manage your room booking requests
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Booking History</CardTitle>
            <CardDescription>
              All your past and upcoming room bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            {bookings && bookings.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Room</TableHead>
                    <TableHead>Building</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">
                        {booking.RoomSchedule.room.name}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{booking.RoomSchedule.room.building.name}</span>
                          <span className="text-xs text-muted-foreground">
                            Floor {booking.RoomSchedule.room.floor}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center text-sm">
                            <Calendar className="mr-1 h-3 w-3" />
                            {formatDateTime(booking.RoomSchedule.startTime).split("•")[0]}
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="mr-1 h-3 w-3" />
                            {formatDateTime(booking.RoomSchedule.startTime).split("•")[1]} - 
                            {formatDateTime(booking.RoomSchedule.endTime).split("•")[1]}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{booking.purpose}</TableCell>
                      <TableCell>
                        <BookingStatusBadge status={booking.status} />
                      </TableCell>
                      <TableCell className="text-center">
                        {booking.status !== "CANCELLED" ? (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setIsDialogOpen(true);
                            }}
                            disabled={isCancelling}
                            className="w-full"
                          >
                            {isCancelling && selectedBooking?.id === booking.id ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Cancelling...
                              </>
                            ) : (
                              <>Cancel Booking</>
                            )}
                          </Button>
                        ) : (
                          <span className="text-sm text-muted-foreground">No actions available</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-10">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                  <Calendar className="h-6 w-6 text-gray-600" />
                </div>
                <h3 className="text-lg font-medium">No bookings found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You haven't made any room bookings yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Booking</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel this booking? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {selectedBooking && (
              <div className="space-y-4 py-2">
                <div className="space-y-2 rounded-lg bg-muted p-4">
                  <div className="flex items-center">
                    <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">
                      {selectedBooking.RoomSchedule.room.name}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      {selectedBooking.RoomSchedule.room.building.name}, Floor {selectedBooking.RoomSchedule.room.floor}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      {formatDateTime(selectedBooking.RoomSchedule.startTime)}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Keep Booking
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancelBooking}
                disabled={isCancelling}
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  "Cancel Booking"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
