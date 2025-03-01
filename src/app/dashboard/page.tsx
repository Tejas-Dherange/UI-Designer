'use client'
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import axios from "axios";
interface Event {
  _id: string;
  event_name: string;
  event_date: string;
  organization_name: string;
}

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";
const dashboard = () => {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  
 const handleClick1 = () => {
    router.push("/dashboard/Groups")
  }
 const handleClick2 = () => {
    router.push("/dashboard/groupmate")
  }
 const handleClick3 = () => {
    router.push("/dashboard/event")
  }
 
  const handleClick4 = () => {
    router.push("/dashboard/participate")
  }
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("/api/events/upcoming");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);
  
  return (
   <div>
    hello
   </div>
  )
}

export default dashboard
