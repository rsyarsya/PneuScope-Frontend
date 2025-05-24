import User from "../models/User"
import Patient from "../models/Patient"

export async function seedDatabase() {
  try {
    // Check if admin user exists
    const adminExists = await User.findOne({ email: "admin@pneuscope.com" })

    if (!adminExists) {
      // Create admin user
      const admin = new User({
        name: "Admin User",
        email: "admin@pneuscope.com",
        password: "admin123",
        role: "admin",
      })
      await admin.save()
      console.log("✅ Admin user created")
    }

    // Check if doctor user exists
    const doctorExists = await User.findOne({ email: "doctor@pneuscope.com" })
    let doctorId = doctorExists?._id

    if (!doctorExists) {
      // Create doctor user with hospital affiliation
      const doctor = new User({
        name: "Dr. Sarah Johnson",
        email: "doctor@pneuscope.com",
        password: "doctor123",
        role: "doctor",
        hospitalAffiliation: "Children's Hospital of Philadelphia",
        specialization: "Pediatric Pulmonology",
        licenseNumber: "MD123456",
        phoneNumber: "+1234567890",
      })
      await doctor.save()
      doctorId = doctor._id
      console.log("✅ Doctor user created")
    }

    // Create additional sample doctors
    const sampleDoctors = [
      {
        name: "Dr. Michael Chen",
        email: "mchen@bostonchildrens.org",
        password: "doctor123",
        role: "doctor",
        hospitalAffiliation: "Boston Children's Hospital",
        specialization: "Pediatric Emergency Medicine",
        licenseNumber: "MD789012",
        phoneNumber: "+1987654321",
      },
      {
        name: "Dr. Emily Rodriguez",
        email: "erodriguez@texaschildrens.org",
        password: "doctor123",
        role: "doctor",
        hospitalAffiliation: "Texas Children's Hospital",
        specialization: "Neonatology",
        licenseNumber: "MD345678",
        phoneNumber: "+1555123456",
      },
      {
        name: "Dr. James Wilson",
        email: "jwilson@seattlechildrens.org",
        password: "doctor123",
        role: "doctor",
        hospitalAffiliation: "Seattle Children's Hospital",
        specialization: "Pediatric Critical Care",
        licenseNumber: "MD901234",
        phoneNumber: "+1444987654",
      },
    ]

    for (const doctorData of sampleDoctors) {
      const existingDoctor = await User.findOne({ email: doctorData.email })
      if (!existingDoctor) {
        const doctor = new User(doctorData)
        await doctor.save()
        console.log(`✅ Sample doctor created: ${doctorData.name}`)
      }
    }

    // Check if sample patients exist
    const patientCount = await Patient.countDocuments()

    if (patientCount === 0 && doctorId) {
      // Create sample patients
      const samplePatients = [
        {
          name: "Emma Thompson",
          dateOfBirth: new Date("2022-03-15"),
          allergies: "Penicillin",
          medicalHistory: "Previous respiratory infection at 8 months",
          createdBy: doctorId,
        },
        {
          name: "Liam Rodriguez",
          dateOfBirth: new Date("2021-11-22"),
          allergies: "",
          medicalHistory: "Premature birth, monitored for respiratory issues",
          createdBy: doctorId,
        },
        {
          name: "Sophia Chen",
          dateOfBirth: new Date("2022-07-08"),
          allergies: "Dairy, Eggs",
          medicalHistory: "Family history of asthma",
          createdBy: doctorId,
        },
      ]

      await Patient.insertMany(samplePatients)
      console.log("✅ Sample patients created")
    }

    console.log("🌱 Database seeding completed")
  } catch (error) {
    console.error("❌ Database seeding error:", error)
  }
}
