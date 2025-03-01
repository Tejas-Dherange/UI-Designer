import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CldUploadWidget } from "next-cloudinary";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { redirect } from "next/dist/server/api-utils";
import ReviewModal from "./ReviewModal";
// import { Button } from "./components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function ProfileStatic({ profile, user, viewMode }) {
  const fields = ["Location", "Phone No", "WhatsApp", "Email"];
  return (
    <>
      
      <header className="sticky top-0 z-30  flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 pt-4">
        <div className="grid gap-4 " >
          <div className="grid gap-2">
            <Label>Profile Picture</Label>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.profilePic} />
                <AvatarFallback className="font-bold">
                  {profile.name?.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-0.5 leading-none">
                <div className="font-semibold">{profile.name}</div>
                {/* <div className="text-sm text-muted-foreground">@johndoe</div> */}
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 px-4 py-6 sm:px-6">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>your profile information here.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-2">
              <h3>Display Name</h3>
              <span className="border-2 rounded-sm p-1 min-h-[30px]">
                {profile.name}
              </span>
            </div>
            <div className="grid gap-2">
              <h3>Profession</h3>
              <span className="border-2 rounded-sm p-1 min-h-[30px]">
                {profile.profession}
              </span>
            </div>
            <div className="grid gap-2">
              <h3>Bio</h3>
              <span className="border-2 rounded-sm p-1 min-h-[100px] ">
                {profile.bio}
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-6">
              {fields.map((field) => {
                const formattedField =
                  field.charAt(0).toLowerCase() +
                  field.slice(1).replace(/\s+/g, "");
                return (
                  <div className="grid gap-3" key={field}>
                    <h3>{field}</h3>
                    <span className="border-2 rounded-sm p-1 min-h-[30px]">
                      {profile[formattedField]}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
          {viewMode && (
            <CardFooter>
              <ReviewModal profileId={profile?._id} />
              <Button className="bg-green-500 ml-72 flex gap-3 hover:bg-green-600">
                <Image className="invert" height={30} width={30} src={"/whatsapp.png"} />

                <Link
                  href={`https://wa.me/+91${profile?.whatsApp}`}
                  target="_blank"
                >
                  Join WhatsApp
                </Link>
              </Button>
            </CardFooter>
          )}
        </Card>
      </main>
      
    </>
  );
}
