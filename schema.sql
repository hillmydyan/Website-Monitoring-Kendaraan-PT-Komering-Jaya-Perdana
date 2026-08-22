-- Table: users_profile
CREATE TABLE users_profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'EMPLOYEE', 'GA_PIC', 'MANAGER'
    department VARCHAR(100),
    signature_url TEXT, -- Path ke file TTD profil GA/Manager
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: transport_requests
CREATE TABLE transport_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_number VARCHAR(100), -- Diisi oleh GA
    employee_name VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    use_date_start DATE NOT NULL,
    use_date_end DATE NOT NULL,
    use_time_start TIME NOT NULL,
    use_time_end TIME NOT NULL,
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    purpose TEXT NOT NULL,
    
    -- Field GA Section
    vehicle_category VARCHAR(50), -- 'OPERATIONAL', 'CONVENTIONAL', 'ONLINE'
    vehicle_type VARCHAR(100),
    license_plate VARCHAR(50),
    
    -- Signatures Base64 / Storage URLs
    user_signature_url TEXT NOT NULL,
    ga_signature_url TEXT,
    manager_signature_url TEXT,
    
    -- Inspection Details (Vehicle Condition)
    odometer_start INT,
    odometer_end INT,
    fuel_level_start VARCHAR(10),
    fuel_level_end VARCHAR(10),
    vehicle_condition_start TEXT,
    vehicle_condition_end TEXT,
    notes TEXT,
    
    -- Inspection Signatures
    user_inspection_signature_url TEXT,
    ga_inspection_signature_url TEXT,
    manager_inspection_signature_url TEXT,
    
    -- Status & Timestamps
    status VARCHAR(50) DEFAULT 'PENDING_GA_REQUEST',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ga_approved_at TIMESTAMP WITH TIME ZONE,
    manager_approved_at TIMESTAMP WITH TIME ZONE
);
