import React from "react";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/hooks/redux";
import { logout } from "@/store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { LogOut } from "lucide-react";
export function LogoutForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    dispatch(logout());
    toast({
      title: "Logout Successful",
      description: "You have been logged out.",
    });
    navigate("/login");
  };

  return (
    <Button
      onClick={handleLogout}
      variant="ghost"
      className="text-red-500 hover:bg-red-100 w-full justify-start" 
    >
      <LogOut className="mr-2 h-4 w-4" /> {}
      <span>Logout</span>
    </Button>
  );
}