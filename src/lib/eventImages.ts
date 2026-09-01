import room1 from "@/assets/events/room-1.jpg";
import room2 from "@/assets/events/room-2.jpg";
import room3 from "@/assets/events/room-3.jpg";
import room4 from "@/assets/events/room-4.jpg";
import room5 from "@/assets/events/room-5.jpg";

const eventImages = [room1, room2, room3, room4, room5];

export function getEventImage(eventId: number): string {
  const index = Math.abs(eventId) % eventImages.length;
  return eventImages[index];
}
