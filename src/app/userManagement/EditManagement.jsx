import React, { useState, useEffect, useContext } from "react";
import { CreditCardIcon, Save } from "lucide-react";
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ButtonComponents from "@/components/base/ButtonComponents";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ContextPanel } from "@/lib/ContextPanel";
import { Input } from "@/components/ui/input";

const EditManagement = ({ id, refetch, setIsViewExpanded }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { fetchPermissions } = useContext(ContextPanel);
  // const buttonOptions = Object.keys(ButtonComponents).map(buttonKey => ({
  //   value: buttonKey,
  //   label: buttonKey
  // }));

  const userTypes = [
    { value: "1", label: "Test User" },
    { value: "2", label: "Admin" },
    { value: "3", label: "Super Admin" },
    { value: "4", label: "SIGA Admin" },
  ];

  const [formData, setFormData] = useState({
    pages: "",
    button: "",
    usertype: [],
    status: "",
  });

  // Fetch existing data
  const { data, isLoading: isFetching } = useQuery({
    queryKey: ["userControl", id],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://southindiagarmentsassociation.com/public/api/panel-fetch-usercontrol-by-id/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (updatedData) => {
      const token = localStorage.getItem("token");
      const payload = {
        ...updatedData,
        usertype: updatedData.usertype.join(","),
      };

      const response = await axios.put(
        `https://southindiagarmentsassociation.com/public/api/panel-update-usercontrol/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User control updated successfully",
        variant: "success",
      });
      fetchPermissions();
      refetch();
      setIsViewExpanded(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update user control",
        variant: "destructive",
      });
    },
  });

  // Update form data when fetched data is available
  useEffect(() => {
    if (data?.usercontrol) {
      const userTypeArray = data.usercontrol.usertype
        ? data.usercontrol.usertype.split(",")
        : [];

      setFormData({
        pages: data.usercontrol.pages || "",
        button: data.usercontrol.button || "",
        usertype: userTypeArray,
        status: data.usercontrol.status || "",
      });
    }
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleSelectChange = (value, field) => {
    if (field === "usertype") {
      setFormData((prev) => {
        const newUserTypes = prev.usertype.includes(value)
          ? prev.usertype.filter((type) => type !== value)
          : [...prev.usertype, value];

        return {
          ...prev,
          usertype: newUserTypes,
        };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  if (isFetching) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-2">
      <h1 className="text-2xl font-bold mb-2 flex items-center">
        <CreditCardIcon className="mr-2" /> Edit  Management
      </h1>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-1 gap-6">
          <div className="flex gap-2 items-center justify-center">
          <div>
            <label className="block mb-2 text-sm font-medium">Pages</label>
            <Input
              name="pages"
              value={formData.pages}
              onChange={handleInputChange}
              placeholder="Enter page name"
              className="w-full"
              disabled
            
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Button</label>
            <Input
              name="button"
              value={formData.button}
              onChange={handleInputChange}
              placeholder="Enter button name"
              className="w-full"
              disabled
            />
          </div>
          </div>
          {/* <div>
              <label className="block mb-2 text-sm font-medium">Button</label>
              <ShadcnSelect
                name="button"
                value={formData.button}
                onValueChange={(value) => handleSelectChange(value, 'button')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Button" />
                </SelectTrigger>
                <SelectContent>
                  {buttonOptions.map((button) => (
                    <SelectItem key={button.value} value={button.value}>
                      {button.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </ShadcnSelect>
            </div> */}

          <div>
            <label className="block mb-2 text-sm font-medium">User</label>
            <div className="space-y-2">
              {userTypes.map((user) => (
                <div key={user.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`usertype-${user.value}`}
                    checked={formData.usertype.includes(user.value)}
                    onChange={() => handleSelectChange(user.value, "usertype")}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor={`usertype-${user.value}`} className="text-sm">
                    {user.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Status</label>
            <ShadcnSelect
              name="status"
              value={formData.status}
              onValueChange={(value) => handleSelectChange(value, "status")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </ShadcnSelect>
          </div>
        </div>

        <div className="mt-6">
          <Button
            type="submit"
            className="flex items-center gap-2"
            variant="default"
            disabled={updateMutation.isLoading}
          >
            <Save className="h-4 w-4" />
            {updateMutation.isLoading ? "Updating..." : "Update Role"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditManagement;
