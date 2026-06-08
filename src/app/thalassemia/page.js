"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";

export default function ThalassemiaPage() {
  const [formData, setFormData] = useState({
    name: "",
    bloodGroup: "",
    hospital: "",
    nextRequiredDate: "",
    contactNumber: "",
    city: "",
  });

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch patients from backend on mount
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/patients/all"); // adjust URL if needed
      const data = await res.json();
      if (data.success) {
        setPatients(data.data);
      } else {
        setError("Failed to load patients");
      }
    } catch (err) {
      setError("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/patients/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        // Refresh patient list
        await fetchPatients();
        // Reset form
        setFormData({
          name: "",
          bloodGroup: "",
          hospital: "",
          nextRequiredDate: "",
          contactNumber: "",
          city: "",
        });
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-10">
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-red-600 text-white py-4 text-center">
            <h1 className="text-3xl font-bold">
              🩸 Thalassemia Patient Registration
            </h1>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="p-8 grid md:grid-cols-2 gap-6 border-b">
            <div>
              <label className="block mb-2 font-medium">Patient Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded-md p-3"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Blood Group</label>
              <select
                name="bloodGroup"
                required
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full border rounded-md p-3"
              >
                <option value="">Select Blood Group</option>
                <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                <option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium">Hospital</label>
              <input
                type="text"
                name="hospital"
                required
                value={formData.hospital}
                onChange={handleChange}
                className="w-full border rounded-md p-3"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Next Required Date</label>
              <input
                type="date"
                name="nextRequiredDate"
                required
                value={formData.nextRequiredDate}
                onChange={handleChange}
                className="w-full border rounded-md p-3"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Contact Number</label>
              <input
                type="tel"
                name="contactNumber"
                required
                value={formData.contactNumber}
                onChange={handleChange}
                className="w-full border rounded-md p-3"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">City</label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                className="w-full border rounded-md p-3"
              />
            </div>

            <div className="md:col-span-2 text-center">
              {error && <p className="text-red-600 mb-2">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md font-semibold disabled:opacity-50"
              >
                {submitting ? "Registering..." : "Register Patient"}
              </button>
            </div>
          </form>

          {/* Patient List Table for Donors */}
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Registered Patients – Donors Can Help
            </h2>
            {loading ? (
              <p className="text-gray-500 text-center py-8">Loading patients...</p>
            ) : patients.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No patients registered yet. Be the first to register.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Blood Group</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Hospital</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Next Required Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Contact</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">City</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {patients.map((patient) => (
                      <tr key={patient._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-800">{patient.name}</td>
                        <td className="px-4 py-3 text-sm font-medium text-red-600">{patient.bloodGroup}</td>
                        <td className="px-4 py-3 text-sm text-gray-800">{patient.hospital}</td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          {new Date(patient.nextRequiredDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">{patient.contactNumber}</td>
                        <td className="px-4 py-3 text-sm text-gray-800">{patient.city}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <p className="text-sm text-gray-500 mt-4 text-center">
              📞 Donors: Please contact the patients directly using the phone number above to coordinate blood donation.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}