// pages/api/teams/checkEmail.ts

//@ts-ignore
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  //@ts-ignore
  const client = await clientPromise;
  const db = client.db("data");
  const { email } = await req.json();
  console.log(email);

  // Check if the email exists in the teams collection
  const existingTeam = await db.collection("teams").findOne({ email: email });

  if (existingTeam) {
    return Response.json({
      message: "Email already exists in another team",
      exists: true,
    });
  } else {
    return Response.json({
      message: "Email does not exist in any team",
      exists: false,
    });
  }
}
