import { Presentation, Video, Wrench } from "lucide-react";

import type { EventItem } from "@/types";

export const eventTypeIcons: Record<EventItem["event_type"], typeof Presentation> = {
  CONFERENCE: Presentation,
  WEBINAR: Video,
  WORKSHOP: Wrench,
};
