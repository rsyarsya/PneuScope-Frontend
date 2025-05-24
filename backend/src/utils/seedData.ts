import User from "../models/User"
import Patient from "../models/Patient"

export const seedDatabase = async (): Promise<void> => {
  try {
    // Check if admin user exists
    const adminExists = await User.findOne({ email: "admin@pneuscope.com" })

    if (!adminExists) {
      console.log("Seeding admin user...")

      // Create admin user
      const admin = await User.create({
        name: "Admin User",
        email: "admin@pneuscope.com",
        password: "password123",
        role: "admin",
      })

      console.log("Admin user created:", admin.email)
    }

    // Check if doctor user exists
    const doctorExists = await User.findOne({ email: "doctor@example.com" })

    if (!doctorExists) {
      console.log("Seeding doctor user...")

      // Create doctor user
      const doctor = await User.create({
        name: "Dr. John Smith",
        email: "doctor@example.com",
        password: "password123",
        role: "doctor",
      })

      console.log("Doctor user created:", doctor.email)

      // Create sample patients
      const patientCount = await Patient.countDocuments()

      if (patientCount === 0) {
        console.log("Seeding sample patients...")

        const patients = [
          {
            name: "Emma Johnson",
            dob: new Date("2020-05-15"),
            allergies: "Peanuts, Penicillin",
            medicalHistory: "Asthma, Eczema",
            createdBy: doctor._id,
          },
          {
            name: "Liam Williams",
            dob: new Date("2021-02-10"),
            allergies: "None",
            medicalHistory: "Premature birth at 35 weeks",
            createdBy: doctor._id,
          },
          {
            name: "Olivia Brown",
            dob: new Date("2019-11-22"),
            allergies: "Dairy",
            medicalHistory: "Recurrent ear infections",
            createdBy: doctor._id,
          },
        ]

        await Patient.insertMany(patients)
        console.log(`${patients.length} sample patients created`)
      }
    }

    // Check if parent user exists
    const parentExists = await User.findOne({ email: "parent@example.com" })

    if (!parentExists) {
      console.log("Seeding parent user...")

      // Create parent user
      const parent = await User.create({
        name: "Sarah Johnson",
        email: "parent@example.com",
        password: "password123",
        role: "parent",
      })

      console.log("Parent user created:", parent.email)
    }

    console.log("Database seeding completed")
  } catch (error) {
    console.error("Database seeding error:", error)
  }
}
