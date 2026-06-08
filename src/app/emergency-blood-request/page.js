"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";

const URGENCY_OPTIONS = [
  { label: "🔴 Critical", minutes: 1, color: "text-red-700", bg: "bg-red-100" },
  { label: "🟠 Very Urgent", minutes: 5, color: "text-orange-700", bg: "bg-orange-100" },
  { label: "🟡 Urgent", minutes: 10, color: "text-yellow-700", bg: "bg-yellow-100" },
  { label: "🟢 Normal", minutes: 30, color: "text-green-700", bg: "bg-green-100" },
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function EmergencyBloodRequest() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    patientName: "",
    bloodGroup: "",
    hospital: "",
    contactNumber: "",
    city: "",
    urgencyIndex: 0,
  });

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [donorName, setDonorName] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [accepting, setAccepting] = useState(false);

  // Fetch active requests
  const fetchActiveRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/emergency/active`);
      const data = await res.json();
      if (data.success) {
        setRequests(data.data);
      } else {
        setError("Failed to load requests");
      }
    } catch (err) {
      setError("Network error – cannot fetch requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveRequests();
    const interval = setInterval(fetchActiveRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  // Notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  }, []);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addRequest = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const urgency = URGENCY_OPTIONS[form.urgencyIndex];
    const payload = {
      patientName: form.patientName,
      bloodGroup: form.bloodGroup,
      hospital: form.hospital,
      contactNumber: form.contactNumber,
      city: form.city,
      urgencyMinutes: urgency.minutes,
      urgencyLabel: urgency.label,
    };

    try {
      const res = await fetch(`${API_BASE}/api/emergency/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        await fetchActiveRequests();
        setForm({
          patientName: "",
          bloodGroup: "",
          hospital: "",
          contactNumber: "",
          city: "",
          urgencyIndex: 0,
        });
        if (Notification.permission === "granted") {
          new Notification("New Emergency Blood Request!", {
            body: `${urgency.label} need for ${form.patientName} (${form.bloodGroup})`,
          });
        } else {
          alert(`🚨 New request: ${urgency.label} for ${form.patientName}`);
        }
      } else {
        setError(data.message || "Failed to create request");
      }
    } catch (err) {
      setError("Network error – could not create request");
    } finally {
      setSubmitting(false);
    }
  };

  // Open modal and store which request is being accepted
  const openAcceptModal = (requestId) => {
    setSelectedRequestId(requestId);
    setDonorName("");
    setDonorPhone("");
    setShowModal(true);
  };

  // Submit acceptance and send WhatsApp message
  const submitAcceptance = async () => {
    if (!donorName.trim() || !donorPhone.trim()) {
      alert("Please enter both name and phone number.");
      return;
    }
    setAccepting(true);
    try {
      const res = await fetch(`${API_BASE}/api/emergency/accept/${selectedRequestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donorName: donorName.trim(), donorPhone: donorPhone.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        // Find the accepted request to get recipient's phone number
        const acceptedRequest = requests.find(r => r._id === selectedRequestId);
        if (acceptedRequest) {
          // Prepare WhatsApp message
          const message = `Hello, I am ${donorName} (Donor, Phone: ${donorPhone}). I accept your emergency blood request (${acceptedRequest.urgencyLabel}). Please contact me.`;
          const whatsappUrl = `https://wa.me/${acceptedRequest.contactNumber}?text=${encodeURIComponent(message)}`;
          window.open(whatsappUrl, "_blank");
        }
        await fetchActiveRequests();
        setShowModal(false);
        alert("Request accepted! WhatsApp opened to message the recipient.");
      } else {
        alert(data.message || "Failed to accept request");
      }
    } catch (err) {
      alert("Network error – could not accept request");
    } finally {
      setAccepting(false);
    }
  };

  const getRemainingTime = (req) => {
    if (req.status !== "active") return null;
    const createdAt = new Date(req.createdAt).getTime();
    const elapsedMinutes = (Date.now() - createdAt) / 1000 / 60;
    const remainingMinutes = req.urgencyMinutes - elapsedMinutes;
    if (remainingMinutes <= 0) return "Expired";
    const mins = Math.floor(remainingMinutes);
    const secs = Math.floor((remainingMinutes - mins) * 60);
    return `${mins}m ${secs}s`;
  };

  const getDisplayStatus = (req) => {
    if (req.status !== "active") return req.status;
    const createdAt = new Date(req.createdAt).getTime();
    const elapsedMinutes = (Date.now() - createdAt) / 1000 / 60;
    if (elapsedMinutes >= req.urgencyMinutes) return "expired";
    return "active";
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-red-700 text-white py-4 px-6 rounded-t-lg shadow">
            <h1 className="text-3xl font-bold">🚨 Emergency Blood Request</h1>
            <p className="text-sm mt-1">Donors can see live requests and accept to help immediately</p>
          </div>

          {/* Form */}
          <div className="bg-white p-6 rounded-b-lg shadow mb-8">
            <h2 className="text-xl font-semibold mb-4">📝 Submit Emergency Request</h2>
            {error && <p className="text-red-600 mb-2">{error}</p>}
            <form onSubmit={addRequest} className="grid md:grid-cols-2 gap-4">
              <input type="text" name="patientName" placeholder="Patient Full Name" value={form.patientName} onChange={handleFormChange} required className="border p-2 rounded" />
              <select name="bloodGroup" value={form.bloodGroup} onChange={handleFormChange} required className="border p-2 rounded">
                <option value="">Select Blood Group</option>
                <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                <option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
              </select>
              <input type="text" name="hospital" placeholder="Hospital Name" value={form.hospital} onChange={handleFormChange} required className="border p-2 rounded" />
              <input type="tel" name="contactNumber" placeholder="Recipient Contact Number" value={form.contactNumber} onChange={handleFormChange} required className="border p-2 rounded" />
              <input type="text" name="city" placeholder="City" value={form.city} onChange={handleFormChange} required className="border p-2 rounded" />
              <div>
                <label className="block text-sm font-medium mb-1">Urgency Level</label>
                <select name="urgencyIndex" value={form.urgencyIndex} onChange={handleFormChange} className="border p-2 rounded w-full">
                  {URGENCY_OPTIONS.map((opt, idx) => (
                    <option key={idx} value={idx}>{opt.label} ({opt.minutes} minute{opt.minutes !== 1 ? "s" : ""})</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <button type="submit" disabled={submitting} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded w-full md:w-auto disabled:opacity-50">
                  {submitting ? "Creating..." : "🆘 Create Emergency Request"}
                </button>
              </div>
            </form>
          </div>

          {/* Active Requests List */}
          <h2 className="text-2xl font-bold mb-4">⏳ Active Blood Requests</h2>
          {loading && <p className="text-gray-500 bg-white p-4 rounded shadow">Loading requests...</p>}
          {!loading && requests.filter(r => getDisplayStatus(r) === "active").length === 0 && (
            <p className="text-gray-500 bg-white p-4 rounded shadow">No active requests. Be the first to create one.</p>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {requests.map((req) => {
              const status = getDisplayStatus(req);
              const isActive = status === "active";
              const isExpired = status === "expired";
              const isAccepted = req.status === "accepted";
              const remaining = isActive ? getRemainingTime(req) : null;

              return (
                <div key={req._id} className={`border-l-8 rounded-lg shadow-md p-5 transition-all ${isActive ? "bg-white" : isExpired ? "bg-gray-100 opacity-60" : "bg-green-50"}`}
                  style={{ borderLeftColor: isActive ? "#dc2626" : isExpired ? "#9ca3af" : "#10b981" }}>
                  <div className="flex justify-between items-start">
                    <div><h3 className="text-xl font-bold">{req.patientName}</h3><p className="text-sm text-gray-600">{req.hospital}, {req.city}</p></div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${req.urgencyBg} ${req.urgencyColor}`}>{req.urgencyLabel}</span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div><span className="font-semibold">🩸 Blood Group:</span> {req.bloodGroup}</div>
                    <div><span className="font-semibold">📞 Recipient Contact:</span> {req.contactNumber}</div>
                  </div>
                  {isActive && remaining && <div className="mt-4 p-2 bg-red-50 rounded text-center"><span className="font-mono text-2xl font-bold text-red-700">{remaining}</span><p className="text-xs text-red-600">remaining to accept</p></div>}
                  {isExpired && <div className="mt-4 text-sm text-gray-500 italic">⏰ Request expired – no donor accepted in time.</div>}
                  {isAccepted && <div className="mt-4 text-sm text-green-700 font-semibold">✅ Accepted by {req.acceptedBy}. Donor will contact you.</div>}
                  {isActive && <div className="mt-5"><button onClick={() => openAcceptModal(req._id)} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold">🤝 I Can Help – Accept Request</button></div>}
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center text-sm text-gray-600 bg-white p-4 rounded shadow">
            💡 <strong>How it works:</strong> Recipient submits request with urgency → Timer starts → Donors see live countdown → Donor accepts → WhatsApp chat opens automatically.
          </div>
        </div>
      </div>

      {/* Modal for Donor Info */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Accept Blood Request</h3>
            <p className="text-gray-600 mb-4">Please enter your details so the recipient can contact you.</p>
            <div className="mb-3">
              <label className="block text-sm font-medium">Your Full Name</label>
              <input type="text" value={donorName} onChange={(e) => setDonorName(e.target.value)} className="w-full border p-2 rounded mt-1" placeholder="e.g., John Doe" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Your Phone Number (with country code)</label>
              <input type="tel" value={donorPhone} onChange={(e) => setDonorPhone(e.target.value)} className="w-full border p-2 rounded mt-1" placeholder="e.g., 923001234567" />
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              <button onClick={submitAcceptance} disabled={accepting} className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50">
                {accepting ? "Accepting..." : "Confirm & Notify via WhatsApp"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}