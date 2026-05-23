"use client";
import Link from "next/link";
import { FaUsers, FaAward } from "react-icons/fa";

export default function CallToAction() {
  return (
    <section className="bg-red-700 text-white py-16 px-4 text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Ready to Save Lives?
      </h2>
      <p className="text-lg max-w-2xl mx-auto mb-10">
        Join thousands of donors who have already made a difference. Your
        donation could be the gift of life someone desperately needs.
      </p>

      <div className="flex flex-col md:flex-row justify-center gap-6">
        <Link href="/find-donor" className="hover:text-red-600">
          {" "}
          <button className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded shadow hover:bg-gray-100 transition font-semibold">
            <FaUsers className="text-xl" />
            Find Blood Donors
          </button>
        </Link>
        <Link href="/donate-blood" className="cursor-pointer hover:text-red-600">
        <button className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded shadow hover:bg-gray-100 transition font-semibold">
          <FaAward className="text-xl" />
          Register as Donor
        </button>
        </Link>
      </div>
    </section>
  );
}
