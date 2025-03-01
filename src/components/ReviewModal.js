"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { createReview } from "@/actions/reviewActions";

export default function ReviewModal({ profileId }) {
  const strProfileId = profileId ? profileId.toString() : ""; // Validate profileId
  const [open, setOpen] = useState(false);
  const [reviewObject, setReviewObject] = useState({
    reviewedProfileId: strProfileId,
    review: "",
  });
  console.log(strProfileId);
  const router = useRouter();

  async function onSubmit() {
    if (!strProfileId) {
      console.error("Invalid profile ID");
      return;
    }
    const res = await createReview(reviewObject);
    console.log(res);
  }

  const handleChange = (e) => {
    const { id, value } = e.target;
    setReviewObject((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-6">
          Give review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <CardHeader>
          <CardTitle>Write a Review</CardTitle>
          <CardDescription>
            Share your thoughts and experiences with this worker.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Textarea
              id="review"
              placeholder="Share your review..."
              className="min-h-[120px]"
              value={reviewObject.review}
              onChange={handleChange}
            />
          </div>
          {/* <div className="grid grid-cols-5 items-center gap-2">
            <Label htmlFor="rating" className="col-span-2 text-sm">
              Rating:
            </Label>
            <div className="col-span-3 flex items-center gap-1">
              <StarIcon className="h-6 w-6 fill-primary" />
              <StarIcon className="h-6 w-6 fill-primary" />
              <StarIcon className="h-6 w-6 fill-primary" />
              <StarIcon className="h-6 w-6 fill-muted stroke-muted-foreground" />
              <StarIcon className="h-6 w-6 fill-muted stroke-muted-foreground" />
            </div>
          </div> */}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>Submit Review</Button>
        </CardFooter>
      </DialogContent>
    </Dialog>
  );
}
function StarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
