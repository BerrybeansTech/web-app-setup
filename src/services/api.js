// Mock login function
export const login = async (credentials) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ token: 'mock-token', user: { name: 'Admin' } }), 500);
  });
};

// Extended mock client list

// Return full client list
export const getClients = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(clientList), 500);
  });
};

// Add new client
export const addClient = async (client) => {
  return new Promise((resolve) => {
    const newClient = { id: Math.random(), ...client };
    clientList.push(newClient);
    setTimeout(() => resolve(newClient), 500);
  });
};

// Get client by ID (search from list)
export const getClientById = async (id) => {
  return new Promise((resolve) => {
    const client = clientList.find((c) => c.id === parseInt(id)) || null;
    setTimeout(() => resolve(client), 500);
  });
};

// Mock report data
export const getReports = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([
      // { id: 1, title: 'Monthly Report', date: '2025-06-01' },
      // { id: 2, title: 'Quarterly Report', date: '2025-03-01' },
       { id: 1, name: "John Doe", age: 35, gender: "Male", phone: "9876543210", email: "john.doe@example.com", address: "Chennai, Tamil Nadu", dob: "1989-05-15", joinDate: "2024-01-10", dischargeFrom: "2024-03-01", dischargeTo: "2024-03-15", status: "Active", admin: "Dr. Kumar" },
  { id: 2, name: "Priya Kumar", age: 28, gender: "Female", phone: "9123456789", email: "priya.kumar@example.com", address: "Bangalore, Karnataka", dob: "1996-08-22", joinDate: "2024-02-05", dischargeFrom: "2024-04-10", dischargeTo: "2024-04-25", status: "Inactive", admin: "Dr. Ramesh" },
  { id: 3, name: "Rajesh Patel", age: 45, gender: "Male", phone: "9988776655", email: "rajesh.patel@example.com", address: "Ahmedabad, Gujarat", dob: "1979-03-12", joinDate: "2024-03-15", dischargeFrom: "2024-06-01", dischargeTo: "2024-06-20", status: "Active", admin: "Dr. Kumar" },
  { id: 4, name: "Meena Sharma", age: 50, gender: "Female", phone: "9876123456", email: "meena.sharma@example.com", address: "Delhi, NCR", dob: "1974-11-05", joinDate: "2023-11-20", dischargeFrom: "2024-01-05", dischargeTo: "2024-01-20", status: "Inactive", admin: "Dr. Priya" },
  { id: 5, name: "Sathish R", age: 40, gender: "Male", phone: "9001234567", email: "sathish.r@example.com", address: "Coimbatore, Tamil Nadu", dob: "1984-02-18", joinDate: "2024-04-01", dischargeFrom: "2024-05-15", dischargeTo: "2024-06-01", status: "Active", admin: "Dr. Ramesh" },
  { id: 6, name: "Anjali Verma", age: 32, gender: "Female", phone: "9876549876", email: "anjali.verma@example.com", address: "Pune, Maharashtra", dob: "1992-07-10", joinDate: "2024-05-10", dischargeFrom: "-", dischargeTo: "-", status: "Active", admin: "Dr. Kumar" },
  { id: 7, name: "Mohammed Iqbal", age: 38, gender: "Male", phone: "9123451234", email: "mohammed.iqbal@example.com", address: "Hyderabad, Telangana", dob: "1986-09-25", joinDate: "2023-12-12", dischargeFrom: "2024-02-20", dischargeTo: "2024-03-05", status: "Inactive", admin: "Dr. Priya" },
  { id: 8, name: "Lakshmi Devi", age: 60, gender: "Female", phone: "9098765432", email: "lakshmi.devi@example.com", address: "Madurai, Tamil Nadu", dob: "1964-01-30", joinDate: "2024-06-01", dischargeFrom: "-", dischargeTo: "-", status: "Active", admin: "Dr. Kumar" },
  { id: 9, name: "Karthik B", age: 27, gender: "Male", phone: "9345678901", email: "karthik.b@example.com", address: "Kochi, Kerala", dob: "1997-12-12", joinDate: "2024-01-25", dischargeFrom: "2024-03-15", dischargeTo: "2024-03-30", status: "Inactive", admin: "Dr. Ramesh" },
  { id: 10, name: "Sneha Joshi", age: 29, gender: "Female", phone: "9876001234", email: "sneha.joshi@example.com", address: "Mumbai, Maharashtra", dob: "1995-04-20", joinDate: "2024-02-28", dischargeFrom: "-", dischargeTo: "-", status: "Active", admin: "Dr. Priya" },
  { id: 11, name: "David Samuel", age: 42, gender: "Male", phone: "9009876543", email: "david.samuel@example.com", address: "Trichy, Tamil Nadu", dob: "1982-06-08", joinDate: "2024-03-05", dischargeFrom: "-", dischargeTo: "-", status: "Active", admin: "Dr. Kumar" },
  { id: 12, name: "Bhavana Singh", age: 31, gender: "Female", phone: "9823456780", email: "bhavana.singh@example.com", address: "Lucknow, Uttar Pradesh", dob: "1993-11-15", joinDate: "2024-04-15", dischargeFrom: "2024-06-01", dischargeTo: "2024-06-18", status: "Inactive", admin: "Dr. Ramesh" },
  { id: 13, name: "Arun K", age: 36, gender: "Male", phone: "9878901234", email: "arun.k@example.com", address: "Salem, Tamil Nadu", dob: "1988-02-25", joinDate: "2024-05-20", dischargeFrom: "-", dischargeTo: "-", status: "Active", admin: "Dr. Priya" },
  { id: 14, name: "Sunita Raj", age: 48, gender: "Female", phone: "9988001122", email: "sunita.raj@example.com", address: "Jaipur, Rajasthan", dob: "1976-09-09", joinDate: "2023-11-01", dischargeFrom: "2024-01-10", dischargeTo: "2024-01-25", status: "Inactive", admin: "Dr. Ramesh" },
  { id: 15, name: "Naveen S", age: 34, gender: "Male", phone: "9876123009", email: "naveen.s@example.com", address: "Erode, Tamil Nadu", dob: "1990-04-17", joinDate: "2024-05-02", dischargeFrom: "-", dischargeTo: "-", status: "Active", admin: "Dr. Kumar" },
  { id: 16, name: "Pooja Desai", age: 29, gender: "Female", phone: "9988776622", email: "pooja.desai@example.com", address: "Surat, Gujarat", dob: "1995-06-30", joinDate: "2024-04-12", dischargeFrom: "2024-05-25", dischargeTo: "2024-06-05", status: "Inactive", admin: "Dr. Priya" },
  { id: 17, name: "Ravi Chandra", age: 41, gender: "Male", phone: "9876567890", email: "ravi.chandra@example.com", address: "Vizag, Andhra Pradesh", dob: "1983-03-19", joinDate: "2024-01-18", dischargeFrom: "2024-02-28", dischargeTo: "2024-03-10", status: "Inactive", admin: "Dr. Ramesh" },
  { id: 18, name: "Keerthi M", age: 26, gender: "Female", phone: "9123004567", email: "keerthi.m@example.com", address: "Mysore, Karnataka", dob: "1998-05-12", joinDate: "2024-06-10", dischargeFrom: "-", dischargeTo: "-", status: "Active", admin: "Dr. Kumar" },
  { id: 19, name: "Vikram Reddy", age: 39, gender: "Male", phone: "9876009876", email: "vikram.reddy@example.com", address: "Warangal, Telangana", dob: "1985-08-05", joinDate: "2024-02-10", dischargeFrom: "-", dischargeTo: "-", status: "Active", admin: "Dr. Priya" },
  { id: 20, name: "Divya Nair", age: 33, gender: "Female", phone: "9876543001", email: "divya.nair@example.com", address: "Thiruvananthapuram, Kerala", dob: "1991-12-01", joinDate: "2024-05-28", dischargeFrom: "-", dischargeTo: "-", status: "Active", admin: "Dr. Ramesh" },
  { id: 21, name: "Suresh Babu", age: 47, gender: "Male", phone: "9123459876", email: "suresh.babu@example.com", address: "Tirupati, Andhra Pradesh", dob: "1977-10-20", joinDate: "2024-03-22", dischargeFrom: "-", dischargeTo: "-", status: "Active", admin: "Dr. Kumar" },
    ]), 500);
  });
};
