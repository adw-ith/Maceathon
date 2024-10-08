"use client";
import { useEffect, useState } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "@/config/firebaseconfig";
import { useAuth } from "@/context/AuthContext";

const UploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const { user } = useAuth();

  // New state variables for the added fields
  const [teamName, setTeamName] = useState("");
  const [teamLeaderName, setTeamLeaderName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [domainSelected, setDomainSelected] = useState("");
  const [problemStatement, setProblemStatement] = useState("");

  // State for number of team members and details of team members
  const [numOfMembers, setNumOfMembers] = useState(0);
  const [teamMembers, setTeamMembers] = useState([
    { name: "", phoneNumber: "" },
    { name: "", phoneNumber: "" },
    { name: "", phoneNumber: "" },
  ]);

  useEffect(() => {
    if (user && user.email) {
      setEmail(user.email);
    }
  }, []);
  const types = [
    "image/png",
    "image/jpeg",
    "application/pdf",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files ? e.target.files[0] : null;
    if (selected && types.includes(selected.type)) {
      setFile(selected);
      setError("");
    } else {
      setFile(null);
      setError("Please select a valid file (png, jpeg, pdf)");
    }
  };
  const handleUpload = async () => {
    if (file) {
      const storageRef = ref(storage, `uploads/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Optionally, you can track upload progress here
        },
        (error) => {
          setError(error.message);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("File uploaded and available at:", url);

          // Prepare the data to send to the API
          const teamData = {
            teamName,
            teamLeaderName,
            phoneNumber,
            email,
            domainSelected,
            problemStatement,
            teamMembers: teamMembers.slice(0, numOfMembers),
            fileUrl: url, // Include the uploaded file URL
          };

          // Submit the form data to the API
          try {
            console.log(teamData);
            const response = await fetch("/api/teams", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(teamData),
            });

            if (response.ok) {
              const result = await response.json();
              console.log(result.message);
            } else {
              const errorData = await response.json();
              console.error("Error uploading team data:", errorData.error);
            }
          } catch (error) {
            console.error("Error uploading team data:", error);
          }
        }
      );
    }
  };

  // Handle change for team members input
  const handleTeamMemberChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedMembers = [...teamMembers];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setTeamMembers(updatedMembers);
  };

  return (
    <form className="bg-slate-900 flex flex-col p-8 justify-center text-white items-center space-y-4">
      <h4 className="text-3xl">REGISTER</h4>
      <input
        type="text"
        placeholder="Team Name"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        className="border border-slate-700 w-full bg-slate-800 text-white p-2"
      />
      <input
        type="text"
        placeholder="Team Leader's Name"
        value={teamLeaderName}
        onChange={(e) => setTeamLeaderName(e.target.value)}
        className="border border-slate-700 w-full bg-slate-800 text-white p-2"
      />
      <input
        type="tel"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="border border-slate-700 w-full bg-slate-800 text-white p-2"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        disabled
        onChange={(e) => setEmail(e.target.value)}
        className="border border-slate-700 w-full bg-slate-700 text-slate-400 p-2"
      />
      <input
        type="text"
        placeholder="Domain Selected"
        value={domainSelected}
        onChange={(e) => setDomainSelected(e.target.value)}
        className="border border-slate-700 w-full bg-slate-800 text-white p-2"
      />
      <textarea
        placeholder="Problem Statement"
        value={problemStatement}
        onChange={(e) => setProblemStatement(e.target.value)}
        className="border border-slate-700 w-full bg-slate-800 text-white p-2"
      />

      <div className="border border-slate-700 w-full bg-slate-800 text-white p-2">
        <label>Number of Team Members (1-3)</label>
        <select
          value={numOfMembers}
          onChange={(e) => setNumOfMembers(Number(e.target.value))}
          className="border border-slate-700 w-full bg-slate-800 text-white p-2"
        >
          <option value={0}>Select number of members</option>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
        </select>
      </div>

      {/* Conditionally render team member input fields */}
      {Array.from({ length: numOfMembers }, (_, index) => (
        <div
          key={index}
          className="border border-slate-700 w-full bg-slate-800 text-white p-2"
        >
          <input
            type="text"
            placeholder={`Team Member ${index + 1} Name`}
            value={teamMembers[index].name}
            onChange={(e) =>
              handleTeamMemberChange(index, "name", e.target.value)
            }
            className="border border-slate-700 w-full bg-slate-800 text-white p-2"
          />
          <input
            type="tel"
            placeholder={`Team Member ${index + 1} Phone Number`}
            value={teamMembers[index].phoneNumber}
            onChange={(e) =>
              handleTeamMemberChange(index, "phoneNumber", e.target.value)
            }
            className="border border-slate-700 w-full bg-slate-800 text-white p-2"
          />
        </div>
      ))}

      <input
        type="file"
        onChange={handleChange}
        className="border border-slate-700 w-full bg-slate-800 text-white p-2"
      />
      <button
        type="button"
        className="bg-blue-500 px-4 p-2 rounded-md hover:bg-blue-900 duration-300 mt-4"
        onClick={handleUpload}
      >
        Submit
      </button>
      <div className="output">
        {error && <div className="error text-red-500">{error}</div>}
        {file && <div>{file.name}</div>}
      </div>
    </form>
  );
};

export default UploadForm;
