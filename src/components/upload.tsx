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
import Loading from "./loading";

const UploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [load, setLoad] = useState<boolean>(false);
  const [submit, setSubmit] = useState<boolean>(false);
  const { user } = useAuth();
  const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

  useEffect(() => {
    const checkEmailExists = async () => {
      try {
        const response = await fetch("/api/check", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: user?.email }),
        });

        const data = await response.json();
        setSubmit(data.exists);
      } catch (err) {
        console.error("Error checking email:", err);
      }
    };

    checkEmailExists();
  }, [user?.email]);

  // State variables for form fields
  const [teamName, setTeamName] = useState("");
  const [teamLeaderName, setTeamLeaderName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [domainSelected, setDomainSelected] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
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
  }, [user]);

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
      if (selected.size > MAX_FILE_SIZE) {
        setError("File size exceeds 3MB limit. Please select a smaller file.");
        setFile(null);
      } else {
        setFile(selected);
        setError("");
      }
    } else {
      setFile(null);
      setError("Please select a valid file (png, jpeg, pdf)");
    }
  };

  const handleUpload = async () => {
    setLoad(true);
    if (file) {
      const storageRef = ref(storage, `uploads/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Optionally, track upload progress
        },
        (error) => {
          setError(error.message);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          const teamData = {
            teamName,
            teamLeaderName,
            phoneNumber,
            email,
            domainSelected,
            problemStatement,
            teamMembers: teamMembers.slice(0, numOfMembers),
            fileUrl: url, // Uploaded file URL
          };

          try {
            const response = await fetch("/api/teams", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(teamData),
            });

            if (response.ok) {
              const result = await response.json();
              setSubmit(true);
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
    setLoad(false);
  };

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
    <div className="">
      {!submit && (
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
          <div className="w-full text-left">
            <label className="text-sm text-gray-400">
              Max file size: 3MB (png, jpeg, pdf, ppt, pptx)
            </label>
          </div>
          <input
            type="file"
            onChange={handleChange}
            className="border border-slate-700 w-full bg-slate-800 text-white p-2"
          />
          <button
            type="button"
            disabled={load}
            className={`bg-blue-500 px-4 p-2 rounded-md ${
              load ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-900"
            } duration-300 mt-4`}
            onClick={handleUpload}
          >
            {load ? <Loading /> : "Submit"}
          </button>
          {error && <p className="text-red-600">{error}</p>}
        </form>
      )}
      {submit && (
        <div className="text-white text-center mt-10 px-8">
          <h1>successfully submitted!</h1>
        </div>
      )}
    </div>
  );
};

export default UploadForm;
