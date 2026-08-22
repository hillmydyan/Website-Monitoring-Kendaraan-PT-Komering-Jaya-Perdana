export type Role = 'EMPLOYEE' | 'GA_PIC' | 'MANAGER' | 'ADMIN';

export type RequestStatus = 
  | 'PENDING_GA_REQUEST'
  | 'PENDING_MANAGER_REQUEST'
  | 'REQUEST_APPROVED'
  | 'PENDING_GA_INSPECTION'
  | 'PENDING_MANAGER_INSPECTION'
  | 'FULLY_COMPLETED';

export interface TransportRequest {
  id: string;
  request_number?: string;
  employee_name: string;
  department: string;
  use_date_start: string;
  use_date_end: string;
  use_time_start: string;
  use_time_end: string;
  origin: string;
  destination: string;
  purpose: string;
  
  // GA Section
  vehicle_category?: 'OPERATIONAL' | 'CONVENTIONAL' | 'ONLINE' | '';
  vehicle_type?: string;
  license_plate?: string;
  
  // Signatures
  user_signature_url: string;
  ga_signature_url?: string;
  manager_signature_url?: string;
  
  // Inspection Data
  odometer_start?: string;
  odometer_end?: string;
  fuel_level_start?: string;
  fuel_level_end?: string;
  vehicle_condition_start?: string;
  vehicle_condition_end?: string;
  notes?: string;
  
  // Inspection Signatures
  user_inspection_signature_url?: string;
  ga_inspection_signature_url?: string;
  manager_inspection_signature_url?: string;
  
  // Metadata
  status: RequestStatus;
  submitted_at: string;
}
