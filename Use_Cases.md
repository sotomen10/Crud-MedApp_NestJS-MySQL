# Use Cases and Acceptance Criteria

## 1. User Registration
**Actor**: Paciente / Médico  
**Description**: The user should be able to register on the system according to their role.  
### Acceptance Criteria:
- The user can register successfully and be assigned a role (Paciente or Médico).

## 2. Login
**Actor**: Paciente / Médico  
**Description**: The user should be able to log in using their credentials.  
### Acceptance Criteria:
- Only registered users can log in.

## 3. Book an Appointment
**Actor**: Paciente / Médico  
**Description**: A patient can schedule an appointment with a doctor, or the doctor can create an appointment for the patient.  
### Acceptance Criteria:
- The system ensures no double booking of appointments for the same time.
- Availability updates in real-time.
- The reason for the appointment must be recorded.

## 4. Warn on Overlapping Appointment
**Actor**: Paciente  
**Description**: The system should warn the user if the selected time for an appointment is already occupied.  
### Acceptance Criteria:
- The system prevents booking in occupied slots and shows an appropriate warning.

## 5. Filter Appointments
**Actor**: Médico / Paciente  
**Description**: The user can filter appointments by date, specialty, or reason.  
### Acceptance Criteria:
- The system allows filtering by date, specialty, or reason.

## 6. Add Notes to Appointments
**Actor**: Médico / Paciente  
**Description**: The user can add notes or comments to any scheduled appointment.  
### Acceptance Criteria:
- The system allows the user to add and save notes on appointments.

## 7. Role-Based Access Control
**Actor**: Médico / Paciente  
**Description**: Users can only view information relevant to their role.  
### Acceptance Criteria:
- Doctors can only view appointments for their own patients.
- Patients can only view their own appointments.
