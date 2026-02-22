export interface Room {
  id: string;
  name: string;
  type: "classroom" | "lecture-hall" | "laboratory" | "meeting-room";
  capacity: number;
  building: string;
  floor: number;
  status: "available" | "booked" | "maintenance";
  facilities: string[];
  image?: string;
  description?: string;
}