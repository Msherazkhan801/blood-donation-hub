'use client'

import { bloodTypes } from "@/utils/Data"


export default function BloodCompatibility() {
  return (
    <section className="py-16 px-4 bg-white text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Blood Type Compatibility
      </h2>
      <p className="text-gray-700 max-w-2xl mx-auto mb-12">
        Understanding blood type compatibility is crucial for safe transfusions
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {bloodTypes.map((type, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded shadow-sm p-6 hover:shadow-md transition"
            
          >
            <h3 className="text-2xl font-extrabold text-red-600 mb-1" >{type}</h3>
            {/* <p className="text-gray-800 font-medium">Blood Type</p> */}
          </div>
        ))}
      </div>
    </section>
  )
}
