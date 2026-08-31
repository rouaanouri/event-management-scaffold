export type Gender = "MALE" | "FEMALE" | "OTHER";
export type UserRole = "ADMIN" | "USER";
export type EventType = "CONFERENCE" | "WEBINAR" | "WORKSHOP";
export type EducationLevel =
  | "HIGH_SCHOOL"
  | "BACHELORS"
  | "MASTERS"
  | "PHD"
  | "OTHER";
export type RegistrationStatus = "PENDING" | "APPROVED" | "REJECTED";
export type AttendanceStatus = "PENDING" | "APPROVED" | "COMPLETED";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: Gender;
  date_of_birth: string;
  role: UserRole;
  created_at: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface LoginResponse {
  message: string;
  access_token: string;
}

export interface EventCreator {
  id: number;
  email: string;
  role: UserRole;
}

export interface EventItem {
  id: number;
  name: string;
  description: string;
  max_attendees: number;
  event_date: string;
  event_type: EventType;
  registrationCount?: number;
  creator?: EventCreator;
  created_at?: string;
}

export interface CreateEventPayload {
  name: string;
  description: string;
  max_attendees: number;
  event_date: string;
  event_type: EventType;
}

export type UpdateEventPayload = Partial<CreateEventPayload>;

export interface CreateEventResponse {
  message: string;
  event: EventItem;
}

export interface DeleteEventResponse {
  message: string;
}

export interface AttendeeEntry {
  id: number;
  status: RegistrationStatus;
  registered_at: string;
  linkedin_profile?: string;
  education_level?: EducationLevel;
  motivation?: string;
  user: {
    id: number;
    email: string;
    role: UserRole;
  };
}

export interface EventAttendeesResponse extends PaginationMeta {
  message: string;
  attendees: AttendeeEntry[];
}

export interface ApproveRegistrationResponse {
  message: string;
  registration: Registration;
}

export interface AttendedEventEntry {
  event: EventItem;
  registrationStatus: RegistrationStatus;
  attendanceStatus: AttendanceStatus;
}

export interface Registration {
  id: number;
  eventId: number;
  userId: number;
  status: RegistrationStatus;
}

export interface CreateRegistrationPayload {
  linkedinProfile?: string;
  educationLevel?: EducationLevel;
  motivation?: string;
}

export interface CreateRegistrationResponse {
  message: string;
  registrationId: number;
  status: RegistrationStatus;
  eventId: number;
  userId: number;
}

export interface AuditLogEntry {
  id: number;
  admin_id: number;
  action: string;
  entity: string;
  entity_id: number;
  created_at: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface PaginatedResponse<T> extends PaginationMeta {
  items: T[];
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: EventType | "";
  dateFrom?: string;
  dateTo?: string;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error: string;
}
