'use client'
import { features } from '@/utils/Data'


export default function WhyChoose() {
  return (
    <section className="bg-gray-50 py-16 px-4 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Why Choose Our Platform?
      </h2>
      <p className="text-gray-700 max-w-2xl mx-auto mb-12">
        We provide a secure, efficient, and user-friendly platform to connect
        blood donors with those in need.
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded shadow-sm p-6 hover:shadow-md transition"
          >
            {feature.icon}
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
