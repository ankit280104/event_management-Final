import { userAtom } from "@/atom/userAtoms";
import { useAtom } from "jotai";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const CreateAdmin = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [userData] = useAtom(userAtom);
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/profile/role/${userData._id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          role: "ADMIN",
        }),
      }
    );

    // Handle response
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to sync user with backend.");
    }
    const data = await response.json();
    setUser(data.data);
    alert("Success: Email verified successfully!");
  };
  return (
    <div>
      {" "}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Admin</DialogTitle>
            <DialogDescription>
              Enter the Email of the user you want to make Admin
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your user  email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating Admin..." : "Create Amdin"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateAdmin;
