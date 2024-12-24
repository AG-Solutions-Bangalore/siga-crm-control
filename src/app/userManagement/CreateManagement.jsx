import React, { useContext, useState } from 'react';
import Page from '../dashboard/page';
import { CreditCardIcon, Save } from 'lucide-react';
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ButtonComponents from '@/components/base/ButtonComponents';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import { useNavigate } from 'react-router-dom';
import { ContextPanel } from '@/lib/ContextPanel';
const CreateManagement = () => {
   const { toast } = useToast();
   const {fetchPermissions} = useContext(ContextPanel)
   const animatedComponents = makeAnimated();
   const navigate = useNavigate()
  const buttonOptions = Object.keys(ButtonComponents).map(buttonKey => ({
      value: buttonKey,
      label: buttonKey 
    }));
  

//   .replace(/([A-Z])/g, ' $1').trim()
  const userTypes = [
    { value: "1", label: "Test User" },
    { value: "2", label: "Admin" },
    { value: "3", label: "Super Admin" },
    { value: "4", label: "SIGA Admin" }
  ];

  // Form state
  const [formData, setFormData] = useState({
    button: "",
    usertype: [],
    status: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      const payload = {
        ...formData,
        usertype: formData.usertype.map(type => type.value).join(',')
      };
      const response = await axios.post(
        'https://southindiagarmentsassociation.com/public/api/panel-create-usercontrol',
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          
          }
        }
      );
      
      toast({
        title: "Success",
        description: "User control created successfully",
        variant: "success",
      });
      fetchPermissions()
      navigate('/user-management')

      // Reset form
      setFormData({
        button: "",
        usertype: [],
        status: ""
      });

    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to create user control",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle select changes
  const handleSelectChange = (value, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      height: "36px",
      minHeight: "36px",
      fontSize: "0.75rem",
      borderRadius: "0.4rem",
      borderColor: "#E2E8F0",
     
    }),
    menu: (provided) => ({
      ...provided,
      fontSize: "0.75rem",
      
    }),
  };

  return (
    <Page>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <CreditCardIcon className="mr-2" /> Create Access Management
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
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
          </div>

          {/* <div>
            <label className="block mb-2 text-sm font-medium">User</label>
            <Select
              name="usertype"
              value={formData.usertype}
              onValueChange={(value) => handleSelectChange(value, 'usertype')}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select User Type" />
              </SelectTrigger>
              <SelectContent>
                {userTypes.map((user) => (
                  <SelectItem key={user.value} value={user.value}>
                    {user.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}
            <div>
            <label className="block mb-2 text-sm font-medium">User</label>
            <Select
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti
              options={userTypes}
              className="basic-multi-select"
              classNamePrefix="select"
              value={formData.usertype}
              onChange={(value) => handleSelectChange(value, 'usertype')}
              placeholder="Select User Types"
              styles={customStyles}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Status</label>
            <ShadcnSelect
              name="status"
              value={formData.status}
              onValueChange={(value) => handleSelectChange(value, 'status')}
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
            >
              <Save className="h-4 w-4" />
              Create Role
            </Button>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default CreateManagement;