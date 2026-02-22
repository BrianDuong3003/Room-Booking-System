/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ScheduleDisplay } from "./ScheduleDisplay";

const formSchema = z.object({
  roomId: z.string().min(1, "Room ID is required"),
  date: z.date({
    required_error: "Date is required",
  }),
});

type FormData = z.infer<typeof formSchema>;

export function ClassroomSearch() {
  const [scheduleData, setScheduleData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomId: "",
      date: new Date(),
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    
    try {
      // Simulated API call to get_room_schedule
      console.log(`Fetching schedule for room ${data.roomId} on ${format(data.date, "yyyy-MM-dd")}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock schedule data
      const mockSchedule = [
        { 
          id: 1, 
          time: "08:00 - 10:00", 
          title: "Introduction to Computer Science", 
          lecturer: "Dr. Smith", 
          status: "scheduled" 
        },
        { 
          id: 2, 
          time: "10:15 - 12:15", 
          title: "Advanced Mathematics", 
          lecturer: "Prof. Johnson", 
          status: "scheduled" 
        },
        { 
          id: 3, 
          time: "13:00 - 15:00", 
          title: "", 
          lecturer: "", 
          status: "available" 
        },
        { 
          id: 4, 
          time: "15:15 - 17:15", 
          title: "Physics Lab", 
          lecturer: "Dr. Williams", 
          status: "scheduled" 
        },
        { 
          id: 5, 
          time: "17:30 - 19:30", 
          title: "", 
          lecturer: "", 
          status: "available" 
        },
      ];
      
      setScheduleData({
        roomId: data.roomId,
        date: data.date,
        schedule: mockSchedule
      });
    } catch (error) {
      console.error("Error fetching room schedule:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="roomId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room ID</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., R101, L205" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Searching..." : "Search Room Schedule"}
          </Button>
        </form>
      </Form>
      
      {scheduleData && <ScheduleDisplay scheduleData={scheduleData} userRole="lecturer" />}
    </div>
  );
}
