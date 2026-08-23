-- Table: users
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT,
  signature TEXT
);

-- Table: transport_requests
CREATE TABLE transport_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_number TEXT,
  employee_name TEXT NOT NULL,
  department TEXT NOT NULL,
  use_date_start DATE NOT NULL,
  use_date_end DATE NOT NULL,
  use_time_start TIME NOT NULL,
  use_time_end TIME NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  purpose TEXT NOT NULL,
  vehicle_category TEXT,
  vehicle_type TEXT,
  license_plate TEXT,
  user_signature_url TEXT,
  ga_signature_url TEXT,
  manager_signature_url TEXT,
  odometer_start TEXT,
  odometer_end TEXT,
  fuel_level_start TEXT,
  fuel_level_end TEXT,
  vehicle_condition_start TEXT,
  vehicle_condition_end TEXT,
  notes TEXT,
  user_inspection_signature_url TEXT,
  ga_inspection_signature_url TEXT,
  manager_inspection_signature_url TEXT,
  status TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Insert admin user (password '123' untuk kemudahan, pastikan diganti nantinya)
INSERT INTO users (username, password, name, role, department) 
VALUES ('admin', '123', 'System Admin', 'ADMIN', 'IT');
