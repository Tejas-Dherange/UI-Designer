"use client";

import { useRouter } from "next/navigation";
import { Router } from "next/router";
import { useState } from "react";

export default function RegisterPage() {
    const router=useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", linkedin: "", event: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Submitting...");

    const res = await fetch("/api/users/create-participation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setMessage(data.message);

    if (data.success) setForm({ name: "", email: "", phone: "", linkedin: "", event: "" }
    );
    // router.push("/dashboard");
  };

  return (
    <div className="max-w-md mt-10 mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Event Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block">
          <span className="text-gray-700">Full Name</span>
          <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Full Name" required className="w-full p-2 border rounded" />
        </label>

        <label className="block">
          <span className="text-gray-700">Email</span>
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" required className="w-full p-2 border rounded" />
        </label>

        <label className="block">
          <span className="text-gray-700">Phone Number</span>
          <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" required className="w-full p-2 border rounded" />
        </label>

        <label className="block">
          <span className="text-gray-700">LinkedIn (Optional)</span>
          <input type="text" name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="LinkedIn (Optional)" className="w-full p-2 border rounded" />
        </label>

        <label className="block">
          <span className="text-gray-700">Select Event</span>
          <select name="event" value={form.event} onChange={handleChange} required className="w-full p-2 border rounded">
            <option value="">Select an Event</option>
            <option value="Hackathon">Hackathon</option>
            <option value="Workshop">Workshop</option>
            <option value="Tech Talk">Tech Talk</option>
          </select>
        </label>

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Register</button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}
