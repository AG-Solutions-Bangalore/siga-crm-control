import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Eye, Edit, Plus, Trash } from "lucide-react";
import BASE_URL from '@/config/BaseUrl';
import axios from 'axios';

// Shared state and logic
const [permission, setPermission] = useState([]);
const [isLoading, setIsLoading] = useState(false);
const [isError, setIsError] = useState(false);

useEffect(() => {
  const fetchPermissions = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-usercontrol`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPermission(response.data.usercontrol);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  fetchPermissions();
}, []);

const shouldRenderButton = (buttonName, userType, status) => {
  return permission.some((item) => {
    const userTypes = item.usertype.split(",");
    return (
      item.button === buttonName &&
      userTypes.includes(userType) &&
      item.status === status
    );
  });
};

export const ViewParticipantButton = ({ onClick, className }) => {
  const userType = localStorage.getItem("userType");
  if (!shouldRenderButton("ViewParticipantButton", userType, "active")) return null;
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
  if (!shouldRenderButton("EditParticipantButton", userType, "active")) return null;
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
  if (!shouldRenderButton("CreateParticipantButton", userType, "active")) return null;
  return (
    <Button
      variant="default"
      onClick={onClick}
      className={className}
    >
      <Plus className="h-4 w-4 mr-2" />
      Create Participant
    </Button>
  );
};

export const DeleteButton = ({ onClick, className }) => {
  const userType = localStorage.getItem("userType");
  if (!shouldRenderButton("DeleteButton", userType, "active")) return null;
  return (
    <Button
      variant="destructive"
      onClick={onClick}
      className={className}
      title="Delete Participant"
    >
      <Trash className="h-4 w-4 mr-2" />
      Delete Participant
    </Button>
  );
};

export default {
  ViewParticipantButton,
  EditParticipantButton,
  CreateParticipantButton,
  DeleteButton
};




// ButtonComponents.jsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { Eye, Edit, Plus, Trash } from "lucide-react";
import { usePermissions } from './usePermissions';

const shouldRenderButton = (permission, buttonName, userType, status) => {
  return permission.some((item) => {
    const userTypes = item.usertype.split(",");
    return (
      item.button === buttonName &&
      userTypes.includes(userType) &&
      item.status === status
    );
  });
};

export const ViewParticipantButton = ({ onClick, className }) => {
  const { permission, isLoading } = usePermissions();
  const userType = localStorage.getItem("userType");
  
  if (isLoading) return null;
  if (!shouldRenderButton(permission, "ViewParticipantButton", userType, "active")) return null;
  
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
  const { permission, isLoading } = usePermissions();
  const userType = localStorage.getItem("userType");
  
  if (isLoading) return null;
  if (!shouldRenderButton(permission, "EditParticipantButton", userType, "active")) return null;
  
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
  const { permission, isLoading } = usePermissions();
  const userType = localStorage.getItem("userType");
  
  if (isLoading) return null;
  if (!shouldRenderButton(permission, "CreateParticipantButton", userType, "active")) return null;
  
  return (
    <Button
      variant="default"
      onClick={onClick}
      className={className}
    >
      <Plus className="h-4 w-4 mr-2" />
      Create Participant
    </Button>
  );
};

export const DeleteButton = ({ onClick, className }) => {
  const { permission, isLoading } = usePermissions();
  const userType = localStorage.getItem("userType");
  
  if (isLoading) return null;
  if (!shouldRenderButton(permission, "DeleteButton", userType, "active")) return null;
  
  return (
    <Button
      variant="destructive"
      onClick={onClick}
      className={className}
      title="Delete Participant"
    >
      <Trash className="h-4 w-4 mr-2" />
      Delete Participant
    </Button>
  );
};

export default {
  ViewParticipantButton,
  EditParticipantButton,
  CreateParticipantButton,
  DeleteButton
};














import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, Edit } from "lucide-react";

// Function to retrieve the `usercontrol` data from localStorage
const getUserControlData = () => {
  const userControl = localStorage.getItem("usercontrol");
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
      item.button === buttonName &&
      userTypes.includes(userType) && // Check if the userType matches
      item.status.toLowerCase() === status.toLowerCase() // Compare status case-insensitively
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



import axios from 'axios';

// Helper function to trigger fetchPermissions
const triggerFetchPermissions = () => {
  // Call fetchPermissions function or set some state that fetches permissions again
  fetchPermissions(); // Or use state to trigger it
};

// Example of your API call functions
const updateUserControl = async (id, data) => {
  try {
    const response = await axios.put(`https://southindiagarmentsassociation.com/public/api/panel-update-usercontrol/${id}`, data);
    if (response.status === 200) {
      triggerFetchPermissions(); // Refetch the permissions after the update
    }
  } catch (error) {
    console.error('Error updating user control:', error);
  }
};

const deleteUserControl = async (id) => {
  try {
    const response = await axios.delete(`https://southindiagarmentsassociation.com/public/api/panel-delete-usercontrol/${id}`);
    if (response.status === 200) {
      triggerFetchPermissions(); // Refetch the permissions after the delete
    }
  } catch (error) {
    console.error('Error deleting user control:', error);
  }
};

const createUserControl = async (data) => {
  try {
    const response = await axios.post('https://southindiagarmentsassociation.com/public/api/panel-create-usercontrol', data);
    if (response.status === 200) {
      triggerFetchPermissions(); // Refetch the permissions after the create
    }
  } catch (error) {
    console.error('Error creating user control:', error);
  }
};
