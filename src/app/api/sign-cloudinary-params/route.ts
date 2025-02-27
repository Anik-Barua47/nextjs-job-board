// // src/app/api/sign-cloudinary-params/route.ts
// import { v2 as cloudinary } from "cloudinary";
// import { NextResponse } from "next/server";

// cloudinary.config({
//   cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const { timestamp, source } = body;

//     if (!timestamp || !source) {
//       return NextResponse.json(
//         { error: "Missing required parameters: timestamp and source" },
//         { status: 400 },
//       );
//     }

//     const paramsToSign = {
//       timestamp,
//       source,
//     };

//     const signature = cloudinary.utils.api_sign_request(
//       paramsToSign,
//       process.env.CLOUDINARY_API_SECRET!,
//     );

//     return NextResponse.json({ signature, timestamp });
//   } catch (error) {
//     console.error("Error in sign-cloudinary-params:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 },
//     );
//   }
// }
