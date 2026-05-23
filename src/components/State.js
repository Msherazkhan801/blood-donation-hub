'use client'
import React, { useEffect, useState } from 'react';

const State = () => {
  const [data, setData] = useState({
    livesSaved: '100+',
    activeDonors: '200+',
    supportAvailable: '321+',
    partnerHospitals: '432+',
  });

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.example.com/stats'); // Replace with your API URL
        const result = await response.json();
        setData(result); // Assuming the API response matches the shape of `data`
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-8 px-8 py-24 text-center bg-white">
      <div>
        <h2 className="text-2xl font-bold text-red-600">{data.livesSaved}</h2>
        <p className="text-gray-600">Lives Saved</p>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-red-600">{data.activeDonors}</h2>
        <p className="text-gray-600">Active Donors</p>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-red-600">{data.supportAvailable}</h2>
        <p className="text-gray-600">Support Available</p>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-red-600">{data.partnerHospitals}</h2>
        <p className="text-gray-600">Partner Hospitals</p>
      </div>
    </section>
  );
};

export default State;
