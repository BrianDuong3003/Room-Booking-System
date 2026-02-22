import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Lightbulb,
  Lock,
  Unlock,
  Shield,
  AlarmClock,
  Database,
  VideoIcon,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Room {
  id: string;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  status: {
    occupied: boolean;
    lights: boolean;
    door: boolean;
    projector: boolean;
    fans: boolean;
  };
}

const MOCK_ROOMS: Room[] = [
  {
    id: "R101",
    name: "Lecture Hall 1",
    building: "Science Building",
    floor: 1,
    capacity: 100,
    status: {
      occupied: true,
      lights: true,
      door: true,
      projector: true,
      fans: true,
    },
  },
  {
    id: "R102",
    name: "Seminar Room 2",
    building: "Science Building",
    floor: 1,
    capacity: 30,
    status: {
      occupied: false,
      lights: false,
      door: false,
      projector: false,
      fans: false,
    },
  },
  {
    id: "L201",
    name: "Lab 201",
    building: "Engineering Building",
    floor: 2,
    capacity: 40,
    status: {
      occupied: true,
      lights: true,
      door: true,
      projector: false,
      fans: true,
    },
  },
  {
    id: "C305",
    name: "Computer Lab",
    building: "Computing Building",
    floor: 3,
    capacity: 50,
    status: {
      occupied: false,
      lights: true,
      door: false,
      projector: false,
      fans: true,
    },
  },
];

export function SecurityDashboard() {
  const { toast } = useToast();
  const [rooms, setRooms] = useState(MOCK_ROOMS);
  const [systemStatus, setSystemStatus] = useState({
    backupStatus: "Last backup: Today at 03:00 AM",
    serverStatus: "Online - All systems operational",
    aiSystemStatus: "Active - Human detection running",
  });
  
  const toggleDeviceStatus = (roomId: string, device: keyof Room["status"]) => {
    setRooms(rooms.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          status: {
            ...room.status,
            [device]: !room.status[device]
          }
        };
      }
      return room;
    }));
    
    toast({
      title: "Status updated",
      description: `${device} status has been updated for room ${roomId}`,
    });
  };
  
  const performEmergencyAction = (action: string) => {
    if (action === "lockdown") {
      setRooms(rooms.map(room => ({
        ...room,
        status: {
          ...room.status,
          door: false
        }
      })));
      
      toast({
        title: "Emergency Lockdown",
        description: "All doors have been locked",
        variant: "destructive"
      });
    } else if (action === "unlock") {
      setRooms(rooms.map(room => ({
        ...room,
        status: {
          ...room.status,
          door: true
        }
      })));
      
      toast({
        title: "Emergency Unlock",
        description: "All doors have been unlocked",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Security Dashboard</h1>
          <p className="text-muted-foreground">Monitor and control campus facilities</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="destructive" onClick={() => performEmergencyAction("lockdown")}>
            <Lock className="mr-2 h-4 w-4" /> Emergency Lockdown
          </Button>
          <Button variant="outline" onClick={() => performEmergencyAction("unlock")}>
            <Unlock className="mr-2 h-4 w-4" /> Emergency Unlock
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-campus-blue">
              <Database className="mr-2 h-5 w-5" /> System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">Backup</div>
                <div className="text-sm text-muted-foreground">{systemStatus.backupStatus}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">Server</div>
                <div className="text-sm text-green-600">{systemStatus.serverStatus}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">AI Detection</div>
                <div className="text-sm text-green-600">{systemStatus.aiSystemStatus}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-campus-blue">
              <VideoIcon className="mr-2 h-5 w-5" /> Occupancy Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">Total Rooms</div>
                <div className="font-bold">{rooms.length}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">Currently Occupied</div>
                <div className="font-bold">
                  {rooms.filter(r => r.status.occupied).length}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">Doors Open</div>
                <div className="font-bold">
                  {rooms.filter(r => r.status.door).length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-campus-blue">
              <AlarmClock className="mr-2 h-5 w-5" /> System Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>
                <div className="font-medium">Next Backup</div>
                <div className="text-muted-foreground">Tomorrow at 03:00 AM</div>
              </div>
              <div>
                <div className="font-medium">Auto Door Lock</div>
                <div className="text-muted-foreground">Today at 9:00 PM</div>
              </div>
              <div>
                <div className="font-medium">Monthly Report</div>
                <div className="text-muted-foreground">Scheduled for 1st of next month</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Rooms</TabsTrigger>
            <TabsTrigger value="occupied">Occupied</TabsTrigger>
            <TabsTrigger value="available">Available</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {rooms.map((room) => (
              <Card key={room.id} className="overflow-hidden">
                <CardHeader className="bg-secondary/30 pb-2">
                  <CardTitle className="text-lg">{room.name} ({room.id})</CardTitle>
                  <CardDescription>{room.building}, Floor {room.floor}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full ${room.status.occupied ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></div>
                        <Label htmlFor={`occupied-${room.id}`}>Occupied</Label>
                      </div>
                      <Switch 
                        id={`occupied-${room.id}`}
                        checked={room.status.occupied}
                        onCheckedChange={() => toggleDeviceStatus(room.id, 'occupied')}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Lightbulb className={`h-4 w-4 mr-2 ${room.status.lights ? 'text-yellow-400' : 'text-gray-300'}`} />
                        <Label htmlFor={`lights-${room.id}`}>Lights</Label>
                      </div>
                      <Switch 
                        id={`lights-${room.id}`}
                        checked={room.status.lights}
                        onCheckedChange={() => toggleDeviceStatus(room.id, 'lights')}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Lock className={`h-4 w-4 mr-2 ${!room.status.door ? 'text-red-500' : 'text-gray-300'}`} />
                        <Label htmlFor={`door-${room.id}`}>Door {room.status.door ? 'Unlocked' : 'Locked'}</Label>
                      </div>
                      <Switch 
                        id={`door-${room.id}`}
                        checked={room.status.door}
                        onCheckedChange={() => toggleDeviceStatus(room.id, 'door')}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <svg 
                          className={`h-4 w-4 mr-2 ${room.status.projector ? 'text-blue-500' : 'text-gray-300'}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                        <Label htmlFor={`projector-${room.id}`}>Projector</Label>
                      </div>
                      <Switch 
                        id={`projector-${room.id}`}
                        checked={room.status.projector}
                        onCheckedChange={() => toggleDeviceStatus(room.id, 'projector')}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <svg 
                          className={`h-4 w-4 mr-2 ${room.status.fans ? 'text-blue-500' : 'text-gray-300'}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                        </svg>
                        <Label htmlFor={`fans-${room.id}`}>Fans</Label>
                      </div>
                      <Switch 
                        id={`fans-${room.id}`}
                        checked={room.status.fans}
                        onCheckedChange={() => toggleDeviceStatus(room.id, 'fans')}
                      />
                    </div>
                    
                    <div className="col-span-2 mt-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <Shield className="mr-2 h-4 w-4" /> 
                        View Security Logs
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="occupied" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {rooms
              .filter(room => room.status.occupied)
              .map((room) => (
                <Card key={room.id} className="overflow-hidden">
                  {/* Same content as above */}
                  <CardHeader className="bg-secondary/30 pb-2">
                    <CardTitle className="text-lg">{room.name} ({room.id})</CardTitle>
                    <CardDescription>{room.building}, Floor {room.floor}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {/* Device controls would be repeated here */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                          <Label htmlFor={`occupied-${room.id}-tab`}>Occupied</Label>
                        </div>
                        <Switch 
                          id={`occupied-${room.id}-tab`}
                          checked={true}
                          onCheckedChange={() => toggleDeviceStatus(room.id, 'occupied')}
                        />
                      </div>
                      
                      {/* Other device controls */}
                      <div className="col-span-2 mt-2">
                        <Button variant="outline" size="sm" className="w-full">
                          <Shield className="mr-2 h-4 w-4" /> 
                          View Security Logs
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
          
          {rooms.filter(room => room.status.occupied).length === 0 && (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No occupied rooms at the moment.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="available" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {rooms
              .filter(room => !room.status.occupied)
              .map((room) => (
                <Card key={room.id} className="overflow-hidden">
                  {/* Same content as above */}
                  <CardHeader className="bg-secondary/30 pb-2">
                    <CardTitle className="text-lg">{room.name} ({room.id})</CardTitle>
                    <CardDescription>{room.building}, Floor {room.floor}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {/* Device controls would be repeated here */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-gray-300 mr-2"></div>
                          <Label htmlFor={`occupied-${room.id}-tab2`}>Occupied</Label>
                        </div>
                        <Switch 
                          id={`occupied-${room.id}-tab2`}
                          checked={false}
                          onCheckedChange={() => toggleDeviceStatus(room.id, 'occupied')}
                        />
                      </div>
                      
                      {/* Other device controls */}
                      <div className="col-span-2 mt-2">
                        <Button variant="outline" size="sm" className="w-full">
                          <Shield className="mr-2 h-4 w-4" /> 
                          View Security Logs
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
          
          {rooms.filter(room => !room.status.occupied).length === 0 && (
            <div className="text-center py-6">
              <p className="text-muted-foreground">All rooms are currently occupied.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}