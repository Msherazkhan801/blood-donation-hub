// src/app/components/LeafletMap.js
'use client';

import dynamic from 'next/dynamic';

// dynamically import with SSR turned off
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] md:h-[500px] bg-gray-100 flex items-center justify-center rounded-lg border">
      <p className="text-gray-500 animate-pulse font-medium">Loading Map Layout...</p>
    </div>
  ),
});

export default function LeafletMap({ donorsList = [], centerLocation = null }) {
  return <MapComponent donorsList={donorsList} centerLocation={centerLocation} />;
}