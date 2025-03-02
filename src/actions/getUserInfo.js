// "use server";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import dbConnect from "@/dbConfig/dbConfig";
// import User from "@/models/userModel";
// import { getServerSession } from "next-auth";

// export async function getUserInfo() {
//   await dbConnect();
//   const session = await getServerSession(authOptions);
//   console.log(session);

//   if (!session) {
//     return null;
//   }

//   const user = await User.findOne({ email: session?.user?.email }).lean(); // Use lean to get plain objects
//   const { password, ...userDoc } = user;
//   return userDoc;
// }

// export async function updateUserType(userType) {
//   await dbConnect();
//   const session = await getServerSession(authOptions);
//   console.log(session);

//   if (!session) {
//     return null;
//   }

//   const updatedUser = await User.findOneAndUpdate(
//     { email: session?.user?.email },
//     { $set: { userType } },
//     { new: true } // Return the updated document
//   ).lean();
//   return updatedUser;
// }

// //    const { username, email, password } = await request.json();

// //    const user = await User.findOne({ email });

// //    if (user) {
// //      return NextResponse.json(
// //        { error: "User already exists" },
// //        { status: 400 }
// //      );
// //    }
