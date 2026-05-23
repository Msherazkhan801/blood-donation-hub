// pages/faq.js

import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import React from 'react'

const FAQ = () => {
  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
        <h1 className="text-4xl font-semibold text-center text-gray-900 mb-8">Frequently Asked Questions</h1>

        <div className="space-y-6">
          <div className="faq-item">
            <h3 className="text-xl font-semibold text-indigo-400">What is this app for?</h3>
            <p className="text-gray-600">
              This app connects blood donors and recipients, making it easy to donate or receive blood when needed.
            </p>
          </div>
          
          <div className="faq-item">
            <h3 className="text-xl font-semibold text-indigo-400">How do I become a blood donor?</h3>
            <p className="text-gray-600">
              To become a blood donor, simply register on the app, verify your details, and fill out the health screening questionnaire. Once approved, you can donate blood through our partnered blood banks or clinics.
            </p>
          </div>

          <div className="faq-item">
            <h3 className="text-xl font-semibold text-indigo-400">How do I request blood as a recipient?</h3>
            <p className="text-gray-600">
              As a recipient, you can submit a request for blood based on your required type. After your request is approved, you’ll be connected with nearby donors or blood banks to receive the blood.
            </p>
          </div>

          <div className="faq-item">
            <h3 className="text-xl font-semibold text-indigo-400">Who can donate blood?</h3>
            <p className="text-gray-600">
              Blood donation eligibility is based on age, health, and other medical factors. You must be between the ages of 18-65, weigh at least 50 kg, and meet other health criteria. The app will guide you through a health screening process before approval.
            </p>
          </div>

          <div className="faq-item">
            <h3 className="text-xl font-semibold text-indigo-400">Is donating blood safe?</h3>
            <p className="text-gray-600">
              Yes, the blood donation process is safe and strictly regulated to ensure the health and safety of the donor and recipient.
            </p>
          </div>

          <div className="faq-item">
            <h3 className="text-xl font-semibold text-indigo-400">What are the health requirements for donating blood?</h3>
            <p className="text-gray-600">
              You must be in good health, at least 18 years old, and weigh more than 50 kg. You should also meet other criteria based on your medical history, which will be reviewed during the registration process.
            </p>
          </div>

          <div className="faq-item">
            <h3 className="text-xl font-semibold text-indigo-400">Can I donate blood if I am on medication?</h3>
            <p className="text-gray-600">
              It depends on the type of medication. Please consult the app’s health screening questionnaire to see if you’re eligible to donate.
            </p>
          </div>

          <div className="faq-item">
            <h3 className="text-xl font-semibold text-indigo-400">How often can I donate blood?</h3>
            <p className="text-gray-600">
              Blood donors are typically allowed to donate once every 8 weeks. This may vary depending on the type of donation.
            </p>
          </div>

          <div className="faq-item">
            <h3 className="text-xl font-semibold text-indigo-400">How do I know if blood is needed in my area?</h3>
            <p className="text-gray-600">
              The app will notify you if there’s a shortage of blood types in your area or when an emergency request for blood is made.
            </p>
          </div>

          <div className="faq-item">
            <h3 className="text-xl font-semibold text-indigo-400">Can I donate blood for a specific person?</h3>
            <p className="text-gray-600">
              Yes, you can choose to donate blood for a specific person by entering their details when making your donation.
            </p>
          </div>

          <div className="faq-item">
            <h3 className="text-xl font-semibold text-indigo-400">How is my blood used?</h3>
            <p className="text-gray-600">
              Your blood is used for patients in need of blood transfusions, whether it’s for surgery, medical treatment, or emergencies.
            </p>
          </div>

          <div className="faq-item">
            <h3 className="text-xl font-semibold text-indigo-400">What happens if I am not eligible to donate blood?</h3>
            <p className="text-gray-600">
              If you’re not eligible to donate blood, you can still help by encouraging others to donate and sharing the app.
            </p>
          </div>

          <div className="faq-item">
            <h3 className="text-xl font-semibold text-indigo-400">How do I update my details on the app?</h3>
            <p className="text-gray-600">
              You can update your details in the profile section of the app. If you encounter any issues, contact customer support.
            </p>
          </div>

          <div className="faq-item">
            <h3 className="text-xl font-semibold text-indigo-400">How do I remove my account from the app?</h3>
            <p className="text-gray-600">
              If you wish to delete your account, you can do so in the settings section of the app or contact customer support for assistance.
            </p>
          </div>

          <div className="faq-item">
            <h3 className="text-xl font-semibold text-indigo-400">Are there any age restrictions for donating blood?</h3>
            <p className="text-gray-600">
              Yes, blood donors must be between the ages of 18 and 65. However, eligibility may vary depending on individual health conditions.
            </p>
          </div>

          <div className="faq-item">
            <h3 className="text-xl font-semibold text-indigo-400">Is there a way to track my donation history?</h3>
            <p className="text-gray-600">
              Yes, you can track your past donations in the app under the donation history section.
            </p>
          </div>

          <div className="faq-item">
            <h3 className="text-xl font-semibold text-indigo-400">What happens after I donate blood?</h3>
            <p className="text-gray-600">
              After donating blood, you will be given time to rest and hydrate. Your blood will be processed and distributed as needed.
            </p>
          </div>

          <div className="faq-item">
            <h3 className="text-xl font-semibold text-indigo-400">Can I donate blood if I’m pregnant?</h3>
            <p className="text-gray-600">
              No, pregnant individuals are not eligible to donate blood. Please consult your healthcare provider if you have any concerns.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default FAQ
