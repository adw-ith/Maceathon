// pages/api/teams.js
//@ts-ignore
import clientPromise from "@/lib/mongodb";

export async function POST(req: any) {
  //@ts-ignore
  const client = await clientPromise;
  const db = client.db("data"); // Replace with your actual database name

  try {
    // Extract the data from the request body
    const {
      teamName,
      teamLeaderName,
      phoneNumber,
      email,
      domainSelected,
      problemStatement,
      teamMembers,
      fileUrl, // This is the URL of the uploaded file
    } = await req.json();
    //console log all the above variables with ndicating each variable for example3 console.log("teamName", teamName)

    console.log("teamName:", teamName);
    console.log("teamLeaderName:", teamLeaderName);
    console.log("phoneNumber:", phoneNumber);
    console.log("email:", email);
    console.log("domainSelected:", domainSelected);
    console.log("problemStatement:", problemStatement);
    console.log("teamMembers:", teamMembers);
    console.log("fileUrl:", fileUrl);
    const newTeam = {
      teamName,
      teamLeaderName,
      phoneNumber,
      email,
      domainSelected,
      problemStatement,
      teamMembers,
      fileUrl,
      createdAt: new Date(), // Add a timestamp if needed
    };

    // Insert the new team into the teams collection
    const result = await db.collection("teams").insertOne(newTeam);

    return Response.json({
      message: "Team added successfully",
      team: result, // Return the newly inserted team object
    });
  } catch (error) {
    console.error("Error inserting team:", error);
    return Response.json({
      message: "Error inserting team",
      status: 444,
    });
  }
}
