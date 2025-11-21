export interface BedWard {
  name: string;
  department: string;
  floor: number;
  has_elderly_support: boolean;
}

export interface BedRoom {
  room_number: string;
  room_type: string;
  accessibility_notes: string;
  ward: BedWard;
}

export interface BedAvailability {
  id: string;
  bed_number: string;
  supports_elderly: boolean;
  status: string;
  equipment: Record<string, string>;
  room: BedRoom;
}

export interface PatientSummary {
  id: string;
  medical_record_number: string;
  user_full_name?: string;
  user?: string;
}

export interface DoctorAppointment {
  id: string;
  patient: string;
  start: string;
  location: string;
  status: string;
}

export interface DoctorBedAllocation {
  allocation_id: string;
  patient: string;
  bed: string;
  room: string;
  ward: string;
  status: string;
  admitted_at: string;
}

export interface DoctorDashboard {
  upcoming_appointments: DoctorAppointment[];
  active_bed_allocations: DoctorBedAllocation[];
}

export interface PaymentSummary {
  order_id: string;
  patient: string;
  amount: number;
  status: string;
  created_at: string;
}

export interface ReceptionistDashboard {
  pending_activation_requests: number;
  payments_waiting: PaymentSummary[];
}

export interface NurseAllocation {
  allocation_id: string;
  patient: string;
  bed: string;
  room: string;
  ward: string;
  attending_staff: string | null;
  status: string;
}

export interface NurseDashboard {
  active_allocations: NurseAllocation[];
}

export interface EmergencyCaseSummary {
  id: string;
  patient: string;
  severity: string;
  arrival_time: string;
  attending_physician: string | null;
}

export interface ReservedBedSummary {
  bed: string;
  room: string;
  ward: string;
}

export interface EmergencyDashboard {
  recent_cases: EmergencyCaseSummary[];
  reserved_beds: ReservedBedSummary[];
  cases_last_24h: number;
}

export interface SuperAdminDashboard {
  users_by_role: Record<string, number>;
  payments: Record<string, number>;
  pending_activation_requests: number;
}

export interface HospitalAdminDashboard {
  users_by_role: Record<string, number>;
  payments: Record<string, number>;
  pending_activation_requests: number;
}

export interface PatientAppointment {
  id: string;
  doctor: string;
  start: string;
  end: string;
  location: string;
  status: string;
  purpose: string;
}

export interface PatientBedAllocation {
  allocation_id: string;
  bed: string;
  room: string;
  ward: string;
  admitted_at: string;
  attending_staff: string | null;
}

export interface PatientPayment {
  id: string;
  order_id: string;
  amount: number;
  status: string;
  created_at: string;
  description: string;
}

export interface PatientDashboard {
  upcoming_appointments: PatientAppointment[];
  active_bed_allocation: PatientBedAllocation | null;
  recent_payments: PatientPayment[];
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  phone_number: string;
  is_active: boolean;
  generated_password?: string;
}

export interface PaymentTransaction {
  id: string;
  order_id: string;
  patient: string;
  patient_name?: string;
  amount: number;
  status: string;
  created_at: string;
  snap_token?: string;
  redirect_url?: string;
  payment_type?: string;
}

