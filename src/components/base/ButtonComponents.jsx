import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, Edit } from "lucide-react";

// Function to retrieve the `usercontrol` data from localStorage
const getUserControlData = () => {
  const userControl = localStorage.getItem("userControl");
  try {
    return userControl ? JSON.parse(userControl) : [];
  } catch (error) {
    console.error("Error parsing usercontrol data from localStorage", error);
    return [];
  }
};


const shouldRenderButton = (buttonName, userType, status) => {
  const data = getUserControlData(); // Retrieve data dynamically
 
  return data.some((item) => {
    const userTypes = item.usertype.split(","); // Split the usertype string into an array
    return (
      item.button == buttonName &&
      userTypes.includes(userType) && // Check if the userType matches
      item.status.toLowerCase() == status.toLowerCase() // Compare status case-insensitively
    );
  });
};

export const ViewParticipantButton = ({ onClick, className }) => {
  const userType = localStorage.getItem("userType");
  if (!shouldRenderButton("ViewParticipantButton", userType, "active"))
    return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={className}
      title="View Participant"
    >
      <Eye className="h-4 w-4" />
    </Button>
  );
};

export const EditParticipantButton = ({ onClick, className }) => {
  const userType = localStorage.getItem("userType");
  if (!shouldRenderButton("EditParticipantButton", userType, "active"))
    return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={className}
      title="Edit Participant"
    >
      <Edit className="h-4 w-4" />
    </Button>
  );
};

export const CreateParticipantButton = ({ onClick, className }) => {
  const userType = localStorage.getItem("userType");
  if (!shouldRenderButton("CreateParticipantButton", userType, "active"))
    return null;

  return (
    <Button
      variant="default"
      onClick={onClick}
      className={` ${className}`}
    >
      Create Participant
    </Button>
  );
};

export const DeleteButton = ({ onClick, className }) => {
  const userType = localStorage.getItem("userType");
  if (!shouldRenderButton("DeleteButton", userType, "active"))
    return null;

  return (
    <Button
      variant="default"
      onClick={onClick}
      className={` ${className}`}
    >
      Delete
    </Button>
  );
};

export default {
  ViewParticipantButton,
  EditParticipantButton,
  CreateParticipantButton,
  DeleteButton,
};
