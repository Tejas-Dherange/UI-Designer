"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Layers, Plus } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardHeader() {
  const pathname = usePathname();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        const data = await response.json();
        if (data.success) {
          setProjects(data.projects);
        } else {
          console.error("❌ Failed to fetch projects:", data.message);
        }
      } catch (error) {
        console.error("❌ Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <>
      {/* 🔹 BEAUTIFUL HEADER */}
      <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-gray-900 shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          {/* 🔹 Left: Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-gray-100">
            <Layers className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span>UI Maker Pro</span>
          </Link>

          {/* 🔹 Right: Actions */}
          <div className="flex items-center space-x-3">
            <Link href="/dashboard/new-project">
              <Button size="sm" variant="outline" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Project
              </Button>
            </Link>

            {/* Theme Toggle */}
            {/* <ModeToggle /> */}

            {/* User Menu */}
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* 🔹 PROJECTS SECTION */}
      <div className="container mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-6">
          Your Projects
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-lg bg-gray-300 dark:bg-gray-700" />
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((project) => (
              <Card
                key={project._id}
                className="bg-white dark:bg-gray-900 border  border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.03] rounded-xl overflow-hidden"
              >
                <CardHeader className="bg-gray-800 dark:bg-gray-700 text-white p-4">
                  <CardTitle className="text-lg font-semibold">{project.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                    <span className="font-medium text-gray-900 dark:text-white">Type:</span>{" "}
                    {project.type || "General"}
                  </p>
                  <Link href={`/dashboard/new-project?id=${project._id}`}>
                    <Button className="w-full bg-gray-800 hover:bg-gray-900 dark:bg-gray-600 dark:hover:bg-gray-500 text-white font-medium rounded-lg">
                      Open Project 
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 text-lg mt-6">
            No projects found. Start by creating a new project!
          </p>
        )}
      </div>
    </>
  );
}

export default DashboardHeader;