"use client"

interface Patient {
  _id: string
  name: string
  dob: string
}

interface PatientListProps {
  patients: Patient[]
  onPatientClick: (patientId: string) => void
  emptyMessage?: string
}

export default function PatientList({
  patients,
  onPatientClick,
  emptyMessage = "No patients found.",
}: PatientListProps) {
  if (patients.length === 0) {
    return <p className="text-gray-500 text-center py-4">{emptyMessage}</p>
  }

  return (
    <ul className="divide-y divide-gray-200">
      {patients.map((patient) => (
        <li key={patient._id} className="py-2">
          <button
            onClick={() => onPatientClick(patient._id)}
            className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 transition"
          >
            <div className="font-medium text-gray-800">{patient.name}</div>
            <div className="text-sm text-gray-500">DOB: {new Date(patient.dob).toLocaleDateString()}</div>
          </button>
        </li>
      ))}
    </ul>
  )
}
