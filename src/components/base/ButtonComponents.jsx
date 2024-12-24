import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, Edit } from "lucide-react";


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
  const data = getUserControlData(); 
 
  return data.some((item) => {
    const userTypes = item.usertype.split(","); 
    return (
      item.button == buttonName &&
      userTypes.includes(userType) && 
      item.status.toLowerCase() == status.toLowerCase() 
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
