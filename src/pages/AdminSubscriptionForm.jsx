import React, { useState } from "react";
import axios from "axios";

const AdminSubscriptionForm = () => {
  const [formData, setFormData] = useState({
    dateTime: "",
    details: "",
    newspaperName: "",
    firstName: "",
    phone: "",
    designation: "",
    lastName: "",
    email: "",
    website: "",
    serviceAddress: "", // Address where service is to be provided
    purpose: "",
    newspaper: "",
    frequency: "",
    circulation: "",
    rniNo: "",
    abcCertificate: "",
    contactFirstName: "",
    contactLastName: "",
    contactDesignation: "",
    contactPhone: "",
    contactEmail: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://your-backend-api.com/subscribe", formData);
      console.log("Form submitted successfully:", response.data);
      alert("Subscription Successful!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Submission failed. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-md rounded-md border border-gray-300">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Subscription Form</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input type="datetime-local" name="dateTime" onChange={handleChange} className="w-full p-3 border-2 border-gray-400 rounded-md" required />
        <textarea name="details" onChange={handleChange} className="w-full p-3 border-2 border-gray-400 rounded-md" placeholder="विवरण (Detail)" required />
        <input type="text" name="newspaperName" onChange={handleChange} className="w-full p-3 border-2 border-gray-400 rounded-md" placeholder="समाचार पत्र का नाम / संस्थान *" required />
        
        <input type="text" name="firstName" onChange={handleChange} className="w-full p-3 border-2 border-gray-400 rounded-md" placeholder="First Name" required />
        <input type="tel" name="phone" onChange={handleChange} className="w-full p-3 border-2 border-gray-400 rounded-md" placeholder="Phone" required />
        <input type="text" name="designation" onChange={handleChange} className="w-full p-3 border-2 border-gray-400 rounded-md" placeholder="पद *" required />
        <input type="text" name="lastName" onChange={handleChange} className="w-full p-3 border-2 border-gray-400 rounded-md" placeholder="Last Name" required />
        <input type="email" name="email" onChange={handleChange} className="w-full p-3 border-2 border-gray-400 rounded-md" placeholder="ईमेल *" required />
        <input type="text" name="website" onChange={handleChange} className="w-full p-3 border-2 border-gray-400 rounded-md" placeholder="Website/URL" />
        <textarea name="serviceAddress" onChange={handleChange} className="w-full p-3 border-2 border-gray-400 rounded-md" placeholder="Address Where Service Is To Be Provided" required />
        <textarea name="purpose" onChange={handleChange} className="w-full p-3 border-2 border-gray-400 rounded-md" placeholder="सेवा लेने का उद्देश्य *" required />

        <h3 className="text-lg font-semibold mt-6">समाचार पत्र Newspaper</h3>
        <input type="text" name="newspaper" onChange={handleChange} className="w-full p-3 border-2 border-gray-400 rounded-md" placeholder="Newspaper" />
        <input type="text" name="frequency" onChange={handleChange} className="w-full p-3 border-2 border-gray-400 rounded-md" placeholder="Frequency of Publication" />
        <input type="text" name="circulation" onChange={handleChange} className="w-full p-3 border-2 border-gray-400 rounded-md" placeholder="प्रसार संख्या Circulation: *" required />
        <input type="text" name="rniNo" onChange={handleChange} className="w-full p-3 border-2 border-gray-400 rounded-md" placeholder="आरएनआई नम्बर" />
        <input type="text" name="abcCertificate" onChange={handleChange} className="w-full p-3 border-2 border-gray-400 rounded-md" placeholder="एबीसी प्रमाण—पत्र" />

        <h3 className="text-lg font-semibold mt-6">सम्पर्क व्यक्ति का विवरण Contact Person Details</h3>
        <input type="text" name="contactFirstName" onChange={handleChange} className="w-full p-3 border-2 border-gray-400 rounded-md" placeholder="First Name" required />
        <input type="text" name="contactLastName" onChange={handleChange} className="w-full p-3 border-2 border-gray-400 rounded-md" placeholder="Last Name" required />
        <input type="text" name="contactDesignation" onChange={handleChange} className="w-full p-3 border-2 border-gray-400 rounded-md" placeholder="पद *" required />
        <input type="tel" name="contactPhone" onChange={handleChange} className="w-full p-3 border-2 border-gray-400 rounded-md" placeholder="सम्पर्क नम्बर *" required />
        <input type="email" name="contactEmail" onChange={handleChange} className="w-full p-3 border-2 border-gray-400 rounded-md" placeholder="ईमेल पता *" required />
        
        <button type="submit" className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">Submit</button>
      </form>
    </div>
  );
};

export default AdminSubscriptionForm;