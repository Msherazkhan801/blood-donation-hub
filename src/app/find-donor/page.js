"use client";
import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { FaFilter, FaMapMarkerAlt, FaPhone, FaSearch, FaCrosshairs } from "react-icons/fa";
import LeafletMap from '../../components/LeafletMap';

export default function FindDonorPage() {
  const [bloodType, setBloodType] = useState("All types");
  const [city, setCity] = useState("");
  
  const [allDonors, setAllDonors] = useState([]);      
  const [filteredDonors, setFilteredDonors] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // User current location tracking
  const [userLocation, setUserLocation] = useState(null); 
  const [locatingUser, setLocatingUser] = useState(false);

  // --- STEP 1: Fetch all donors on page load ---
  useEffect(() => {
    const fetchAllDonors = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/donors/all");
        if (!response.ok) throw new Error("Failed to fetch donors");
        
        const result = await response.json();
        
        // Agar backend direct backend standard parameters 'latitude' / 'longitude' de raha hai toh unhe save karega
        setAllDonors(result.data || []);     
        setFilteredDonors(result.data || []); 
      } catch (err) {
        setError("Could not load donor data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllDonors();
  }, []);

  // --- STEP 2: Request Browser Current Location ---
  const requestUserLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(userCoords);
        setLocatingUser(false);

        // Sorting nearest donors logic if backend provides lat/lng
        sortDonorsByProximity(userCoords);
      },
      (error) => {
        console.error("Error getting location: ", error);
        alert("Location access denied. Standard text filter will work.");
        setLocatingUser(false);
      }
    );
  };

  // Helper: Haversine formula calculates approximate straight distance
  const sortDonorsByProximity = (coords) => {
    if (!allDonors || allDonors.length === 0) return;

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Radius of earth in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    };

    const sorted = [...allDonors].map(donor => {
      // Fallback fallback lat-lng checks agar text matching handle karni ho
      const donorLat = donor.latitude || 34.1880; // fallback AUST University
      const donorLng = donor.longitude || 73.2100;
      const dist = calculateDistance(coords.lat, coords.lng, donorLat, donorLng);
      return { ...donor, distance: dist };
    }).sort((a, b) => a.distance - b.distance);

    setFilteredDonors(sorted);
  };

  // --- STEP 3: Handle Search in Frontend ---
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
        donor.city && donor.city.toLowerCase() === city.toLowerCase()
      );
    }

    setFilteredDonors(results);
  };

  return (
    <>
      <Navbar />
      
      {/* Dynamic Map Area */}
      <div className="w-full">
        <LeafletMap donorsList={filteredDonors} centerLocation={userLocation} />
      </div>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="flex justify-center items-center gap-2 text-red-600 text-4xl">
            <FaSearch />
            <h1 className="text-3xl md:text-4xl font-bold text-black">Find Blood Requests</h1>
          </div>
          
          {/* Location Request Button */}
          <button 
            onClick={requestUserLocation}
            disabled={locatingUser}
            className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-md shadow-md text-sm font-semibold hover:bg-blue-700 transition"
          >
            <FaCrosshairs className={`${locatingUser ? 'animate-spin' : ''}`} />
            {locatingUser ? "Locating you..." : "Find Nearest Donors Near Me"}
          </button>
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
                <option>Haripur</option>
                <option>Lahore</option>
                <option>Karachi</option>
                <option>Islamabad</option><option>Rawalpindi</option>
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
                    <td className="py-4 px-6 font-semibold">
                      {donor.firstName || donor.name || "Test User"} {donor.lastName || ""}
                    </td>
                    <td className="py-4 px-6 text-red-600 font-bold">{donor.bloodType}</td>
                    <td className="py-4 px-6">
                      {donor.city}
                      {/* {userLocation && donor.distance && (
                        <span className="text-xs text-blue-500 block">({donor.distance.toFixed(1)} km away)</span>
                      )} */}
                      {/* {!userLocation && <span className="text-xs text-gray-400 block">({`Click "Find Nearest" for distance`})</span>} */}
                    </td>
                    <td className="py-4 px-6">
                      <a 
                        href={`tel:${donor.phone || donor.contact}`} 
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors font-medium"
                      >
                        <FaPhone className="text-sm rotate-90" />
                        {donor.phone || donor.contact || "031212000000"}
                      </a>
                    </td>
                    <td className="py-4 px-6">
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${donor.streetAddress || donor.address || 'testing'}, ${donor.city}`)}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <FaMapMarkerAlt className="text-red-500" />
                        {donor.streetAddress || donor.address || "testing"}
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