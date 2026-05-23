"use client";
import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { FaFilter, FaMapMarkerAlt, FaPhone, FaSearch } from "react-icons/fa";

export default function FindDonorPage() {
  const [bloodType, setBloodType] = useState("All types");
  const [city, setCity] = useState("");
  
  const [allDonors, setAllDonors] = useState([]);      // Permanent list from DB
  const [filteredDonors, setFilteredDonors] = useState([]); // List shown to user
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- STEP 1: Fetch all donors on page load ---
  useEffect(() => {
    const fetchAllDonors = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/donors/all");
        if (!response.ok) throw new Error("Failed to fetch donors");
        
        const result = await response.json();
        setAllDonors(result.data);     // Store the master list
        setFilteredDonors(result.data); // Initially show everyone
      } catch (err) {
        setError("Could not load donor data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllDonors();
  }, []);

  // --- STEP 2: Handle Search in Frontend ---
  const handleSearch = (e) => {
    e.preventDefault();
    
    let results = allDonors;

    // Filter by Blood Type
    if (bloodType !== "All types") {
      results = results.filter((donor) => donor.bloodType === bloodType);
    }

    // Filter by City
    if (city !== "") {
      results = results.filter((donor) => 
        donor.city.toLowerCase() === city.toLowerCase()
      );
    }

    setFilteredDonors(results);
  };

  return (
    <>
      <Navbar />
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="flex justify-center items-center gap-2 text-red-600 text-4xl">
            <FaSearch />
            <h1 className="text-3xl md:text-4xl font-bold text-black">Find Blood Requests</h1>
          </div>
        </div>

        {/* Filter Card */}
        <div className="bg-white rounded-md shadow p-6 border-t-4 border-red-600">
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSearch}>
            <div>
              <label className="block font-medium text-sm mb-1">Blood type</label>
              <select
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-red-600"
              >
                <option>All types</option>
                <option>A+</option><option>A-</option>
                <option>B+</option><option>B-</option>
                <option>O+</option><option>O-</option>
                <option>AB+</option><option>AB-</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-sm mb-1">City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-red-600"
              >
                <option value="">All Cities</option>
                <option>Abbottabad</option>
                <option>Peshawar</option>
                <option>Hripur</option>
                <option>Lahore</option>
                <option>Karachi</option>
                <option>Islamabad</option><option>Rawalpindi</option>
                {/* ... other cities */}
              </select>
            </div>

            <div className="md:col-span-2 flex justify-center mt-4">
              <button type="submit" className="bg-red-600 text-white px-8 py-3 rounded-full hover:bg-red-700 transition flex items-center gap-2">
                <FaSearch /> Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Results Table */}
      <div className="p-6 md:p-12">
        <h2 className="text-2xl font-bold mb-6">
          Available Donors ({filteredDonors.length})
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading donors...</p>
        ) : filteredDonors.length > 0 ? (
          <div className="overflow-x-auto shadow-lg rounded-lg">
            <table className="min-w-full bg-white text-sm">
              <thead className="bg-red-600 text-white">
                <tr>
                  <th className="py-4 px-6 text-left">Name</th>
                  <th className="py-4 px-6 text-left">Blood Type</th>
                  <th className="py-4 px-6 text-left">City</th>
                  <th className="py-4 px-6 text-left">Contact</th>
                  <th className="py-4 px-6 text-left">Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonors.map((donor, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6 font-semibold">{donor.firstName} {donor.lastName}</td>
                    <td className="py-4 px-6 text-red-600 font-bold">{donor.bloodType}</td>
                    <td className="py-4 px-6">{donor.city}</td>
                    <td className="py-4 px-6">
      <a 
        href={`tel:${donor.phone}`} 
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors font-medium"
        title="Call Donor"
      >
        <FaPhone className="text-sm rotate-90" />
        {donor.phone}
      </a>
    </td>
                    {/* <td className="py-4 px-6">{donor.phone}</td> */}
                    {/* <td className="py-4 px-6 text-gray-500">{donor.streetAddress}</td> */}
                    <td className="py-4 px-6">
  <a 
    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${donor.streetAddress}, ${donor.city}`)}`}
    target="_blank" 
    rel="noopener noreferrer"
    className="text-blue-600 hover:underline flex items-center gap-1"
  >
    <FaMapMarkerAlt className="text-red-500" />
    {donor.streetAddress}
  </a>
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center bg-gray-50 p-10 rounded-lg">
             <p className="text-gray-500">No donors found matching these criteria.</p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}