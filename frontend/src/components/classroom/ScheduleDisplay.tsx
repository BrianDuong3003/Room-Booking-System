import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useBookRoomMutation, useGetRoomScheduleQuery } from "@/store/api/roomsApiSlice";

interface ScheduleItem {
  id: number;
  time: string;
  title: string;
  lecturer: string;
  status: "scheduled" | "available";
}

interface ScheduleData {
  roomId: string;
  date: Date;
  schedule: ScheduleItem[];
}

interface ScheduleDisplayProps {
  scheduleData: ScheduleData;
  userRole: "student" | "lecturer" | "staff" | "security";
}

export function ScheduleDisplay({ scheduleData, userRole }: ScheduleDisplayProps) {
  const { toast } = useToast();
  const [bookingTimeSlot, setBookingTimeSlot] = useState<ScheduleItem | null>(null);
  
  // Convert date to ISO string format for the API
  const dateString = format(scheduleData.date, "yyyy-MM-dd");
  
  // Use RTK Query hook to fetch room schedule
  const { data: fetchedSchedule, isLoading, refetch } = useGetRoomScheduleQuery({
    roomId: scheduleData.roomId,
    date: dateString
  }, {
    // Use the provided schedule as initial data if available
    skip: !scheduleData.roomId || !dateString
  });
  
  // Use RTK Query mutation hook for booking
  const [bookRoom, { isLoading: isBooking }] = useBookRoomMutation();
  
  // Use fetched schedule if available, otherwise use provided schedule
  const displaySchedule = fetchedSchedule?.schedule || scheduleData.schedule;
  
  const handleBooking = (timeSlot: ScheduleItem) => {
    setBookingTimeSlot(timeSlot);
  };
  
  const confirmBooking = async () => {
    if (!bookingTimeSlot) return;
    
    try {
      // Call the bookRoom mutation with the correct format
      await bookRoom({
        roomScheduleId: scheduleData.roomId, // This should be the schedule ID, not the room ID
        purpose: "New Lecture Booking"
      }).unwrap();
      
      // Refetch the schedule to get updated data
      refetch();
      
      toast({
        title: "Booking successful",
        description: `You've successfully booked room ${scheduleData.roomId} for ${bookingTimeSlot.time}`,
      });
      
      setBookingTimeSlot(null);
    } catch (error) {
      console.error("Error booking room:", error);
      toast({
        variant: "destructive",
        title: "Booking failed",
        description: "There was an error booking the room. Please try again.",
      });
    }
  };
  
  // Only lecturers can book rooms
  const canBook = userRole === "lecturer";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Room Schedule: {scheduleData.roomId}</CardTitle>
        <CardDescription>
          Schedule for {format(scheduleData.date, "EEEE, MMMM d, yyyy")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">Loading schedule...</p>
            </div>
          ) : displaySchedule.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No schedule information available for this date.</p>
            </div>
          ) : (
            displaySchedule.map((item) => (
              <div 
                key={item.id}
                className={`p-4 border rounded-md ${
                  item.status === "available" 
                    ? "border-green-200 bg-green-50" 
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-medium">{item.time}</div>
                    {item.status === "scheduled" ? (
                      <div className="mt-1">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm text-muted-foreground">Lecturer: {item.lecturer}</div>
                      </div>
                    ) : (
                      <div className="mt-1">
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                          Available
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  {canBook && item.status === "available" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          className="mt-2 md:mt-0"
                          onClick={() => handleBooking(item)}
                        >
                          Book Room
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm Room Booking
                            
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            You are about to book room {scheduleData.roomId} for {item.time} on {format(scheduleData.date, "MMMM d, yyyy")}.
                            <br /><br />
                            This action will reserve the room for your use during this time slot.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={confirmBooking}
                            disabled={isBooking}
                          >
                            {isBooking ? "Booking..." : "Confirm Booking"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
