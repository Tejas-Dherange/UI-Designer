"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";

interface ProfileData {
  name: string;
  email: string;
  age: string;
  department: string;
  phone_number: string;
  college: string;
  city: string;
  skills: string[];
  degree: string;
  Linkedin: string;
}

export default function ProfilePage() {
  const { toast } = useToast();
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    name: "",
    email: "",
    age: "",
    department: "",
    phone_number: "",
    college: "",
    city: "",
    skills: [],
    degree: "",
    Linkedin: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const email = user?.primaryEmailAddress?.emailAddress;

  // Fetch Profile (Only after user is loaded)
  useEffect(() => {
    if (!isLoaded || !email) return;

    async function fetchProfile() {
      setLoading(true);
      try {
        const res = await fetch(`/api/users/create-profile?email=${email}`);
        const data = await res.json();

        if (data.success && data.profile) {
          setProfile(data.profile);
          setFormData(data.profile);
        } else {
          toast({ title: "Error", description: data.message, variant: "destructive" });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [isLoaded, email]);

  // Handle Input Change
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

function handleSkillsChange(event: React.ChangeEvent<HTMLInputElement>) {
  const value = event.target.value;
  // Split by commas and trim any spaces around each skill
  setFormData({ ...formData, skills: value.split(",").map(skill => skill.trim()) });
}

  // Handle Profile Creation / Update
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);

    const method = profile ? "PUT" : "POST";
    const endpoint = "/api/users/create-profile";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, email }),
      });

      const result = await res.json();

      if (res.ok) {
        toast({ title: "Success!", description: result.message });
        setProfile(result.profile);
        setEditMode(false);
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mt-14 mx-auto text-center flex rounded-xl shadow-xl bg-blue-100 mb-4 flex-col justify-center border-2 w-[40vw] py-10">
        <h1 className="text-3xl font-bold text-blue-500 mb-4">{profile ? "Your Profile" : "Create Profile"}</h1>
      <h1 className="flex justify-center  ">
        <img
          className="rounded-full border-2 border-blue-500  "
          height={200}
          width={200}
          src={user?.imageUrl || "path/to/placeholder-image.jpg"}
          alt="Profile"
        />
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : !isLoaded ? (
        <p>Loading...</p>
      ) : profile && !editMode ? (
        <div className="p-6 space-y-4">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Age:</strong> {profile.age}</p>
          <p><strong>Department:</strong> {profile.department}</p>
          <p><strong>Phone Number:</strong> {profile.phone_number}</p>
          <p><strong>College:</strong> {profile.college}</p>
          <p><strong>City:</strong> {profile.city}</p>
          <p><strong>Skills:</strong> {profile.skills.join(", ")}</p>
          <p><strong>Degree:</strong> {profile.degree}</p>
          <p><strong>LinkedIn:</strong> {profile.Linkedin}</p>
          <Button onClick={() => setEditMode(true)} className="bg-green-500">Edit Profile</Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 p-10">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required value={formData.name} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" readOnly  required value={email}  className="bg-gray-100" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input id="age" name="age" type="number" required min="1" value={formData.age} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input id="phone_number" name="phone_number" type="text" required value={formData.phone_number} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="college">College</Label>
            <Input id="college" name="college" required value={formData.college} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="Department">Department</Label>
            <Input id="department" name="department" required value={formData.department} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" required value={formData.city} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Skills</Label>
            <Input
              id="skills"
              name="skills"
              type="text"
              required
              value={formData.skills.join(", ")} // Join the array with a comma and space
              onChange={handleSkillsChange}
              placeholder="Comma separated skills"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="degree">Degree</Label>
            <Input id="degree" name="degree" required value={formData.degree} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="Linkedin">LinkedIn</Label>
            <Input id="Linkedin" name="Linkedin" required value={formData.Linkedin} onChange={handleChange} />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (profile ? "Updating..." : "Creating Profile...") : (profile ? "Update Profile" : "Create Profile")}
          </Button>
        </form>
      )}
    </div>
  );
}
