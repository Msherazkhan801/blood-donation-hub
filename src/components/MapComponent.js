// src/app/components/MapComponent.js
'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom Marker Icons set karna taake default icons missing na hon
const createCustomIcon = (color) => {
  let iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png'; // Default marker

  const iconMap = {
    red: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    blue: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    green: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    gold: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png',
    orange: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
    yellow: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
    violet: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
    black: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-black.png',
  };

  if (iconMap[color]) {
    iconUrl = iconMap[color];
  }

  return new L.Icon({
    iconUrl,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const getDonorMarkerColor = (donor) => {
  const bloodType = donor.bloodType?.toUpperCase?.() || '';
  if (donor.latitude != null && donor.longitude != null) {
    return 'green';
  }

  switch (bloodType) {
    case 'A+': return 'red';
    case 'A-': return 'orange';
    case 'B+': return 'blue';
    case 'B-': return 'violet';
    case 'O+': return 'gold';
    case 'O-': return 'yellow';
    case 'AB+': return 'black';
    case 'AB-': return 'green';
    default: return 'red';
  }
};

// Haversine formula to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export default function MapComponent({ donorsList = [], centerLocation = null }) {
  const [mapCenter, setMapCenter] = useState([34.1880, 73.2100]); // Default: Abbottabad University of Science & Technology
  const [donorsWithDistance, setDonorsWithDistance] = useState([]);

  // Default fallback locations for cities
  const cityCoordinates = {
    'Lahore': [31.5204, 74.3587],
    'Karachi': [24.8607, 67.0011],
    'Islamabad': [33.6844, 73.0479],
    'Rawalpindi': [33.5731, 73.1896],
    'Peshawar': [34.0151, 71.5249],
    'Abbottabad': [34.1880, 73.2100], // AUST University
    'Haveilian': [34.2, 73.1],
    'Haripur': [33.7982, 73.1943],
  };

  useEffect(() => {
    if (centerLocation) {
      setMapCenter([centerLocation.lat, centerLocation.lng]);
    }
  }, [centerLocation]);

  const getDonorCoordinates = (donor, idx) => {
    if (donor.latitude != null && donor.longitude != null) {
      return [donor.latitude, donor.longitude];
    }

    const cityCoord = donor.city && cityCoordinates[donor.city] ? cityCoordinates[donor.city] : [34.1880, 73.2100];
    const baseLat = cityCoord[0];
    const baseLng = cityCoord[1];

    // Add a tiny offset for donors sharing the same city coordinate so pins do not overlap.
    const offset = ((idx % 6) - 2.5) * 0.00015;
    const offsetLng = (((Math.floor(idx / 6) % 3) - 1) * 0.00018);
    return [baseLat + offset, baseLng + offsetLng];
  };

  useEffect(() => {
    if (!donorsList || donorsList.length === 0) {
      setDonorsWithDistance([]);
      return;
    }

    // Add distance calculation to each donor if centerLocation exists
    const processedDonors = donorsList.map((donor, idx) => {
      let distance = null;
      const [donorLat, donorLng] = getDonorCoordinates(donor, idx);

      if (centerLocation) {
        distance = calculateDistance(centerLocation.lat, centerLocation.lng, donorLat, donorLng);
      }

      return { ...donor, distance, donorLat, donorLng };
    });

    // Sort by distance if available
    if (centerLocation) {
      processedDonors.sort((a, b) => a.distance - b.distance);
    }

    setDonorsWithDistance(processedDonors);
  }, [donorsList, centerLocation]);

  return (
    <div className="w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-inner relative z-10">
      <MapContainer 
        center={mapCenter} 
        zoom={14} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User's Current Location with Blue Circle Radius */}
        {centerLocation && (
          <>
            <Marker position={[centerLocation.lat, centerLocation.lng]} icon={createCustomIcon('gold')}>
              <Popup>
                <div className="font-sans">
                  <h3 className="font-bold text-sm">Your Location</h3>
                </div>
              </Popup>
            </Marker>
            <Circle 
              center={[centerLocation.lat, centerLocation.lng]} 
              radius={5000} 
              pathOptions={{ color: '#3182ce', fillColor: '#3182ce', fillOpacity: 0.15 }} 
            />
          </>
        )}

        {/* Dynamic Donor Markers */}
        {donorsWithDistance.length > 0 ? (
          donorsWithDistance.map((donor, idx) => {
            const [donorLat, donorLng] = donor.donorLat && donor.donorLng ? [donor.donorLat, donor.donorLng] : getDonorCoordinates(donor, idx);
            const markerColor = getDonorMarkerColor(donor);

            return (
              <Marker 
                key={donor._id || idx} 
                position={[donorLat, donorLng]} 
                icon={createCustomIcon(markerColor)}
              >
                <Popup>
                  <div className="font-sans text-xs">
                    <h3 className="font-bold text-sm mb-1">{donor.firstName} {donor.lastName}</h3>
                    <p><strong>Blood Type:</strong> {donor.bloodType}</p>
                    <p><strong>Address:</strong> {donor.streetAddress}, {donor.city}</p>
                    <p><strong>Phone:</strong> {donor.phone}</p>
                    {donor.distance && (
                      <p><strong>Distance:</strong> {donor.distance.toFixed(2)} km</p>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })
        ) : (
          // Show dummy locations if no donors
          [
            { id: 1, type: 'donor', position: [34.1880, 73.2100], title: 'Blood Donor (O+)' },
            { id: 2, type: 'blood_bank_avail', position: [34.1850, 73.2050], title: 'Red Cross Blood Bank', status: 'A+, O+, B+ Available' },
          ].map((loc) => {
            let iconColor = 'red';
            if (loc.type === 'blood_bank_avail') iconColor = 'green';
            return (
              <Marker key={loc.id} position={loc.position} icon={createCustomIcon(iconColor)}>
                <Popup>
                  <div className="font-sans">
                    <h3 className="font-bold text-sm">{loc.title}</h3>
                    {loc.status && <p className="text-xs mt-1 text-gray-600">{loc.status}</p>}
                  </div>
                </Popup>
              </Marker>
            );
          })
        )}
      </MapContainer>
    </div>
  );
}