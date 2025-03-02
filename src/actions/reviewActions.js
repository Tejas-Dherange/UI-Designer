// // import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// // import dbConnect from "@/dbConfig/dbConfig";
// import Review from "@/models/reviewModel";
// import { getServerSession } from "next-auth";
// import mongoose from "mongoose";

// export async function createReview(req, reviewData) {
//   await dbConnect();

//   // Correctly get the session using the request object
//   const session = await getServerSession(req, authOptions);

//   if (!session) {
//     throw new Error("Unauthorized: Session not found");
//   }

//   // Validate reviewedProfileId as ObjectId
//   if (!mongoose.Types.ObjectId.isValid(reviewData.reviewedProfileId)) {
//     throw new Error("Invalid reviewedProfileId");
//   }

//   // Prepare the review object with the owner's email
//   const reviewWithOwnerEmail = {
//     ...reviewData,
//     reviewOwnerEmail: session.user.email,
//   };

//   try {
//     // Create and save the new review
//     const newReview = new Review(reviewWithOwnerEmail);
//     await newReview.save();

//     // Retrieve and return the saved review
//     const result = await Review.findById(newReview._id).lean();
//     return result;
//   } catch (error) {
//     console.error("Error creating review:", error);
//     throw new Error("Failed to create review");
//   }
// }


// export async function updateReview(req,newReviewData, id) {
//   await dbConnect();
//   const session = await getServerSession(req,authOptions);

//   if (!session) {
//     throw new Error("Unauthorized: Session not found");
//   }

//   try {
//     const updatedReview = await Review.findByIdAndUpdate(
//       id,
//       { $set: { review: newReviewData } },
//       { new: true } // Return the updated document
//     ).lean();

//     if (!updatedReview) {
//       throw new Error("Review not found");
//     }

//     return updatedReview;
//   } catch (error) {
//     console.error("Error updating review:", error);
//     throw new Error("Failed to update review");
//   }
// }
