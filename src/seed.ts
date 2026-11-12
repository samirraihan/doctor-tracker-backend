import bcrypt from "bcryptjs";
import { connectDatabase } from "./config/database";
import { env } from "./config/env";
import { userRepository } from "./repositories/user.repository";
import { Doctor } from "./models/doctor.model";
import { Patient } from "./models/patient.model";

const demoDoctors = [
  { name: "Eleanor Vance", specialization: "Cardiology", hospital: "St. Jude Medical Center", phone: "+1-555-0101", email: "eleanor.vance@hospital.org" },
  { name: "Marcus Brody", specialization: "Neurology", hospital: "Metropolitan General Hospital", phone: "+1-555-0102", email: "marcus.brody@hospital.org" },
  { name: "Sophia Chen", specialization: "Pediatrics", hospital: "Children's Health Pavilion", phone: "+1-555-0103", email: "sophia.chen@hospital.org" },
  { name: "James Wilson", specialization: "Orthopedics", hospital: "Oakridge Orthopedic Institute", phone: "+1-555-0104", email: "james.wilson@hospital.org" },
  { name: "Maya Patel", specialization: "Dermatology", hospital: "Westside Skin Clinic", phone: "+1-555-0105", email: "maya.patel@hospital.org" },
  { name: "Robert Hayes", specialization: "Internal Medicine", hospital: "City Central Hospital", phone: "+1-555-0106", email: "robert.hayes@hospital.org" },
  { name: "Fatima Al-Mansoor", specialization: "Endocrinology", hospital: "University Medical Center", phone: "+1-555-0107", email: "fatima.mansoor@hospital.org" },
  { name: "Lucas Gomez", specialization: "General Practice", hospital: "Lakeside Community Clinic", phone: "+1-555-0108", email: "lucas.gomez@hospital.org" },
  { name: "Chloe Bennett", specialization: "Pulmonology", hospital: "Highland Chest Hospital", phone: "+1-555-0109", email: "chloe.bennett@hospital.org" },
  { name: "David Kim", specialization: "Gastroenterology", hospital: "Riverside Digestive Center", phone: "+1-555-0110", email: "david.kim@hospital.org" },
  { name: "Olivia Taylor", specialization: "Oncology", hospital: "Hope Regional Cancer Care", phone: "+1-555-0111", email: "olivia.taylor@hospital.org" },
  { name: "Alexander Wright", specialization: "Surgery", hospital: "Northside Surgical Pavilion", phone: "+1-555-0112", email: "alex.wright@hospital.org" },
  { name: "Nadia Petrov", specialization: "Psychiatry", hospital: "Mind Behavioral Health", phone: "+1-555-0113", email: "nadia.petrov@hospital.org" },
  { name: "Samuel Morales", specialization: "Urology", hospital: "Beacon Hill Specialty Clinic", phone: "+1-555-0114", email: "samuel.morales@hospital.org" },
  { name: "Grace Hopper", specialization: "Cardiology", hospital: "Valley Heart Hospital", phone: "+1-555-0115", email: "grace.hopper@hospital.org" },
  { name: "Daniel Larson", specialization: "Orthopedics", hospital: "Summit Sports Medicine", phone: "+1-555-0116", email: "daniel.larson@hospital.org" },
  { name: "Emily Watson", specialization: "Pediatrics", hospital: "Sunrise Pediatric Center", phone: "+1-555-0117", email: "emily.watson@hospital.org" },
  { name: "Julian Barnes", specialization: "Dermatology", hospital: "Pineview Dermatology Group", phone: "+1-555-0118", email: "julian.barnes@hospital.org" },
  { name: "Hannah Abbott", specialization: "General Practice", hospital: "Cedar Creek Family Practice", phone: "+1-555-0119", email: "hannah.abbott@hospital.org" },
  { name: "Thomas Sterling", specialization: "Internal Medicine", hospital: "Mercy General Hospital", phone: "+1-555-0120", email: "thomas.sterling@hospital.org" }
];

const patientBlueprints = [
  { name: "Arthur Pendelton", age: 58, gender: "Male", condition: "Hypertension", phone: "+1-555-1001", email: "arthur.p@example.com", notes: "Blood pressure monitored bi-weekly." },
  { name: "Beatrice Collins", age: 64, gender: "Female", condition: "Arrhythmia", phone: "+1-555-1002", email: "beatrice.c@example.com", notes: "ECG completed last month." },
  { name: "Charles Montgomery", age: 71, gender: "Male", condition: "Coronary artery disease", phone: "+1-555-1003", email: "charles.m@example.com", notes: "Requires low-sodium diet." },
  { name: "Diana Prince", age: 34, gender: "Female", condition: "Migraine", phone: "+1-555-1004", email: "diana.p@example.com", notes: "Responsive to preventative medication." },
  { name: "Evan Wright", age: 29, gender: "Male", condition: "Epilepsy", phone: "+1-555-1005", email: "evan.w@example.com", notes: "Seizure diary reviewed regularly." },
  { name: "Fiona Gallagher", age: 42, gender: "Female", condition: "Concussion recovery", phone: "+1-555-1006", email: "fiona.g@example.com", notes: "Gradual return to activity protocol." },
  { name: "Gabriel Davis", age: 8, gender: "Male", condition: "Pediatric asthma", phone: "+1-555-1007", email: "parent.davis@example.com", notes: "Inhaler prescribed with spacer." },
  { name: "Harper Lee", age: 5, gender: "Female", condition: "Seasonal allergies", phone: "+1-555-1008", email: "parent.lee@example.com", notes: "Antihistamine liquid prescribed." },
  { name: "Isaac Newton", age: 2, gender: "Male", condition: "Routine infant checkup", phone: "+1-555-1009", email: "parent.newton@example.com", notes: "Growth percentiles in normal range." },
  { name: "Jasmine Reed", age: 52, gender: "Female", condition: "Knee Osteoarthritis", phone: "+1-555-1010", email: "jasmine.r@example.com", notes: "Physical therapy exercises assigned." },
  { name: "Kevin Bacon", age: 46, gender: "Male", condition: "Rotator cuff tear", phone: "+1-555-1011", email: "kevin.b@example.com", notes: "Conservative management ongoing." },
  { name: "Laura Croft", age: 38, gender: "Female", condition: "Lumbar disc herniation", phone: "+1-555-1012", email: "laura.c@example.com", notes: "MRI reviewed, core stabilization recommended." },
  { name: "Michael Chang", age: 24, gender: "Male", condition: "Eczema", phone: "+1-555-1013", email: "michael.c@example.com", notes: "Topical barrier cream prescribed." },
  { name: "Nina Simone", age: 49, gender: "Female", condition: "Psoriasis", phone: "+1-555-1014", email: "nina.s@example.com", notes: "Phototherapy sessions scheduled." },
  { name: "Oliver Queen", age: 19, gender: "Male", condition: "Acne vulgaris", phone: "+1-555-1015", email: "oliver.q@example.com", notes: "Dermatological cleansing routine active." },
  { name: "Penelope Cruz", age: 63, gender: "Female", condition: "Diabetes", phone: "+1-555-1016", email: "penelope.c@example.com", notes: "HbA1c level tested quarterly." },
  { name: "Quentin Tarantino", age: 59, gender: "Male", condition: "Chronic fatigue", phone: "+1-555-1017", email: "quentin.t@example.com", notes: "Comprehensive metabolic panel ordered." },
  { name: "Rachel Green", age: 41, gender: "Female", condition: "Hypothyroidism", phone: "+1-555-1018", email: "rachel.g@example.com", notes: "Levothyroxine dosage adjusted." },
  { name: "Samuel Jackson", age: 68, gender: "Male", condition: "Type 2 Diabetes", phone: "+1-555-1019", email: "samuel.j@example.com", notes: "Glucose monitoring daily." },
  { name: "Tara Strong", age: 31, gender: "Female", condition: "General checkup", phone: "+1-555-1020", email: "tara.s@example.com", notes: "Annual physical exam completed." },
  { name: "Uma Thurman", age: 50, gender: "Female", condition: "Hypertension", phone: "+1-555-1021", email: "uma.t@example.com", notes: "Diet and lifestyle counseling provided." },
  { name: "Victor Stone", age: 27, gender: "Male", condition: "Acute bronchitis", phone: "+1-555-1022", email: "victor.s@example.com", notes: "Symptomatic treatment with bronchodilator." },
  { name: "Wendy Darling", age: 66, gender: "Female", condition: "Respiratory", phone: "+1-555-1023", email: "wendy.d@example.com", notes: "Spirometry testing conducted." },
  { name: "Xavier Woods", age: 36, gender: "Male", condition: "Acid reflux", phone: "+1-555-1024", email: "xavier.w@example.com", notes: "Proton pump inhibitor course initiated." },
  { name: "Yvonne Strahovski", age: 44, gender: "Female", condition: "Chronic gastritis", phone: "+1-555-1025", email: "yvonne.s@example.com", notes: "Dietary restrictions established." },
  { name: "Zachary Levi", age: 53, gender: "Male", condition: "Post-surgery follow-up", phone: "+1-555-1026", email: "zachary.l@example.com", notes: "Surgical wound healing favorably." },
  { name: "Alice Cooper", age: 61, gender: "Female", condition: "Cardiology", phone: "+1-555-1027", email: "alice.c@example.com", notes: "Holter monitor study scheduled." },
  { name: "Bruce Wayne", age: 45, gender: "Male", condition: "Post-surgery follow-up", phone: "+1-555-1028", email: "bruce.w@example.com", notes: "Rehabilitation progress satisfactory." },
  { name: "Catherine Zeta", age: 55, gender: "Female", condition: "Orthopedic", phone: "+1-555-1029", email: "catherine.z@example.com", notes: "Joint injection administered." },
  { name: "Dennis Rodman", age: 62, gender: "Male", condition: "Neurology", phone: "+1-555-1030", email: "dennis.r@example.com", notes: "Reflexes and nerve conduction assessed." },
  { name: "Elena Rostova", age: 39, gender: "Female", condition: "General checkup", phone: "+1-555-1031", email: "elena.r@example.com", notes: "Blood panel results normal." },
  { name: "Felix Mendelssohn", age: 73, gender: "Male", condition: "Hypertension", phone: "+1-555-1032", email: "felix.m@example.com", notes: "Medication adherence verified." },
  { name: "Giselle Bundchen", age: 43, gender: "Female", condition: "Dermatology", phone: "+1-555-1033", email: "giselle.b@example.com", notes: "Full body skin examination normal." },
  { name: "Henry Cavill", age: 37, gender: "Male", condition: "Orthopedic", phone: "+1-555-1034", email: "henry.c@example.com", notes: "Tendon rehabilitation ongoing." },
  { name: "Iris West", age: 28, gender: "Female", condition: "Cardiology", phone: "+1-555-1035", email: "iris.w@example.com", notes: "Mild palpitations under evaluation." },
  { name: "Jack Sparrow", age: 47, gender: "Male", condition: "Cardiology", phone: "+1-555-1036", email: "jack.s@example.com", notes: "Echocardiogram requested." },
  { name: "Kiran Patel", age: 33, gender: "Other", condition: "Orthopedic", phone: "+1-555-1037", email: "kiran.p@example.com", notes: "Wrist sprain braced." },
  { name: "Liam Neeson", age: 69, gender: "Male", condition: "Orthopedic", phone: "+1-555-1038", email: "liam.n@example.com", notes: "Shoulder impingement managed with therapy." },
  { name: "Mila Kunis", age: 9, gender: "Female", condition: "Pediatric care", phone: "+1-555-1039", email: "parent.kunis@example.com", notes: "Annual developmental milestone review." },
  { name: "Noah Centineo", age: 11, gender: "Male", condition: "Pediatric care", phone: "+1-555-1040", email: "parent.centineo@example.com", notes: "Sports physical approved." },
  { name: "Oprah Winfrey", age: 57, gender: "Female", condition: "Dermatology", phone: "+1-555-1041", email: "oprah.w@example.com", notes: "Sun protection plan implemented." },
  { name: "Paul Rudd", age: 48, gender: "Male", condition: "Dermatology", phone: "+1-555-1042", email: "paul.r@example.com", notes: "Benign nevus monitored annually." },
  { name: "Queen Latifah", age: 54, gender: "Female", condition: "General checkup", phone: "+1-555-1043", email: "queen.l@example.com", notes: "Preventative screenings scheduled." },
  { name: "Ryan Reynolds", age: 43, gender: "Male", condition: "General checkup", phone: "+1-555-1044", email: "ryan.r@example.com", notes: "Lipid profile within target range." },
  { name: "Scarlett Johansson", age: 39, gender: "Female", condition: "Diabetes", phone: "+1-555-1045", email: "scarlett.j@example.com", notes: "Diet and exercise plan established." }
];

async function seed() {
  await connectDatabase();

  const existing = await userRepository.findByEmail(env.ADMIN_EMAIL);
  if (!existing) {
    await userRepository.create({
      name: env.ADMIN_NAME,
      email: env.ADMIN_EMAIL,
      password: await bcrypt.hash(env.ADMIN_PASSWORD, 12),
      role: "admin"
    });
    console.log(`Administrator created: ${env.ADMIN_EMAIL}`);
  } else {
    console.log("Administrator already exists");
  }

  await Patient.deleteMany({});
  await Doctor.deleteMany({});

  const now = new Date();
  const createdDoctors = [];

  for (let i = 0; i < demoDoctors.length; i++) {
    const daysOffset = Math.floor((demoDoctors.length - i) * 6);
    const doctorDate = new Date(now.getTime() - daysOffset * 24 * 60 * 60 * 1000);
    const doctor = await Doctor.create({
      ...demoDoctors[i],
      createdAt: doctorDate,
      updatedAt: doctorDate
    });
    createdDoctors.push(doctor);
  }

  console.log(`Created ${createdDoctors.length} demo doctors`);

  const createdPatients = [];
  for (let i = 0; i < patientBlueprints.length; i++) {
    const assignedDoctor = createdDoctors[i % createdDoctors.length];
    const daysOffset = Math.floor((patientBlueprints.length - i) * 3);
    const patientDate = new Date(now.getTime() - daysOffset * 24 * 60 * 60 * 1000);

    const patient = await Patient.create({
      ...patientBlueprints[i],
      doctor: assignedDoctor._id,
      createdAt: patientDate,
      updatedAt: patientDate
    });
    createdPatients.push(patient);
  }

  console.log(`Created ${createdPatients.length} demo patients assigned across ${createdDoctors.length} doctors`);

  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
