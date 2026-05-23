import { FaClock, FaMapMarkerAlt, FaShieldAlt } from "react-icons/fa"

export const bloodTypes = [
  'A+', 'B+', 'AB+', 'O+', 
  'A-', 'B-', 'AB-', 'O-'
]



export const features = [
  {
    icon: <FaMapMarkerAlt className="text-red-600 text-4xl mx-auto mb-4" />,
    title: 'Location-Based Matching',
    description:
      'Find donors and recipients near you for quick and convenient blood donation.',
  },
  {
    icon: <FaClock className="text-red-600 text-4xl mx-auto mb-4" />,
    title: 'Urgent Request System',
    description:
      'Immediate notifications for urgent blood requirements with priority matching.',
  },
  {
    icon: <FaShieldAlt className="text-red-600 text-4xl mx-auto mb-4" />,
    title: 'Secure & Verified',
    description:
      'All donors and recipients are verified to ensure safety and authenticity.',
  },
]

// const url=192.168.1.77