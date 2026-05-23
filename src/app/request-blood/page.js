"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React, { useState } from "react";
import { FaUserInjured, FaTint, FaMapMarkerAlt } from "react-icons/fa";

const Page = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    bloodType: "",
    unitsNeeded: "",
    urgency: "",
    requiredDate: "",
    address: "",
    city: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Construct the form data based on your state
    const formDataToSend = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: "12345678", // You might want to handle the password securely
      type: "Donor",
      city: formData.city,
      bloodGroup: formData.bloodType,
      phone: formData.phone,
      address: formData.address,
      dob: formData.dob,
    };

    try {
      const response = await fetch(
        "http://192.168.1.77:3300/api/auth/register/user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDataToSend),
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success("Registration successful!");
      } else {
        toast.error(`Error: ${data.message || "Registration failed"}`);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="text-center mb-10">
              <div className="text-5xl text-red-500 mb-2">🩸</div>
              <h1 className="text-3xl font-bold">Request Blood</h1>
              <p className="text-gray-600 mt-2">{`Submit your blood request and we'll connect you with compatible donors in your area.`}</p>
            </div>

            {/* Patient Info */}
            <Section
              title="Patient Information"
              icon={<FaUserInjured />}
              description="Please provide the patient's personal details"
            >
              <Input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name *"
              />
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name *"
              />
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address *"
                type="email"
              />
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number *"
                type="tel"
              />
              <Input
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                placeholder="Date of Birth "
                type="date"
              />
            </Section>

            {/* Blood Request */}
            <Section
              title="Blood Request Details"
              icon={<FaTint />}
              description="Specific details about the blood requirement"
            >
              <Select
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
                options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]}
                label="Required Blood Type *"
              />
              <Input
                name="unitsNeeded"
                value={formData.unitsNeeded}
                onChange={handleChange}
                placeholder="Units Needed"
                type="number"
              />
              <Select
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                options={["Low", "Moderate", "High", "Critical"]}
                label="Urgency Level "
              />
              <Input
                name="requiredDate"
                value={formData.requiredDate}
                onChange={handleChange}
                placeholder="Required By Date "
                type="date"
              />
            </Section>
            <Section
              title="Address Information"
              icon={<FaMapMarkerAlt />}
              description="Patient's location for proximity matching"
            >
              <Input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street Address *"
              />
              <Input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City *"
              />
            </Section>

            <div className="text-center mt-6">
              <button
                type="submit"
                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Page;

// Reusable components
const Input = ({ name, value, onChange, placeholder, type = "text" }) => (
  <input
    name={name}
    value={value}
    onChange={onChange}
    type={type}
    placeholder={placeholder}
    className="input border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 "
  />
);

// const Textarea = ({ name, value, onChange, placeholder }) => (
//   <textarea
//     name={name}
//     value={value}
//     onChange={onChange}
//     placeholder={placeholder}
//     rows={3}
//     className="input border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 mt-2"
//   />
// );

const Select = ({ name, value, onChange, options, label }) => (
  <div>
    <label className="text-sm text-gray-700">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="input border rounded px-3 py-2 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-red-600"
    >
      <option value="">Select {label.replace(" *", "")}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

const Section = ({ title, icon, description, children }) => (
  <section className="mb-8 border rounded-xl p-6 shadow-sm">
    <h2 className="text-xl font-semibold flex items-center gap-2 text-black">
      <span className="text-red-500">{icon}</span>
      {title}
    </h2>
    <p className="text-gray-500 mb-4">{description}</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </section>
);
