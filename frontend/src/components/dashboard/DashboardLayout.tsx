import { ReactNode } from "react";
import {
  Bell,
  Calendar,
  Home,
  LogOut,
  Search,
  Settings,
  Shield,
  Lightbulb,
  Building2,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppSelector } from "@/hooks/redux";
import { LogoutForm } from "@/components/auth/LogoutButton";

interface DashboardLayoutProps {
  children: ReactNode;
  userRole?: "student" | "lecturer" | "admin" | "guest" | "security";
}

export function DashboardLayout({ children, userRole = "student" }: DashboardLayoutProps) {
  // Get user info from Redux store
  const user = useAppSelector((state) => state.auth.user);
  
  // Calculate user details with fallback values
  const userName = user ? `${user.firstName} ${user.lastName}` : "Guest";
  const userEmail = user ? user.email : "";
  const userInitials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : "G";
  const effectiveUserRole = user ? user.role : userRole;
  console.log("User Role:", effectiveUserRole);

  // Define navigation items based on user role
  const navigationItems = [
    { name: "Dashboard", icon: Home, href: "/dashboard", roles: ["admin", "student", "lecturer", "staff", "security"] },
    { name: "Schedule", icon: Search, href: "/dashboard/schedule-search", roles: ["admin", "student", "lecturer", "staff", "security"] },
    { name: "My Bookings", icon: Calendar, href: "/dashboard/bookings", roles: ["admin", "lecturer"] },
    { name: "Security Controls", icon: Shield, href: "/dashboard/security", roles: ["admin", "security"] },
    // { name: "Device Usage", icon: Lightbulb, href: "/dashboard/devices", roles: ["admin", "security", "staff"] },
    { name: "Room Management", icon: Building2, href: "/dashboard/rooms", roles: ["admin", "staff"] },
    { name: "Schedule Management", icon: Calendar, href: "/dashboard/schedule", roles: ["admin", "staff"] },
  ];

  // Filter items based on user role
  const filteredNavItems = navigationItems.filter(item => 
    item.roles.includes(effectiveUserRole.toLowerCase())
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar>
          <SidebarHeader className="py-6 px-3">
            <div className="flex justify-center">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold text-campus-blue">
                  SCAMS
                </span>
              </Link>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filteredNavItems.map((item) => (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton
                        asChild
                        className={
                          location.pathname === item.href
                            ? "bg-sidebar-accent"
                            : ""
                        }
                      >
                        <Link to={item.href} className="flex items-center">
                          <item.icon className="h-5 w-5 mr-3" />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Account</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link
                        to="/dashboard/settings"
                        className="flex items-center"
                      >
                        <Settings className="h-5 w-5 mr-3" />
                        <span>Settings</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <LogoutForm />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow-sm z-10">
            <div className="flex h-16 items-center justify-between px-4">
              <div className="flex items-center">
                <SidebarTrigger />
                <h2 className="text-xl font-semibold text-campus-blue ml-4">
                  Smart Campus System
                </h2>
              </div>

              <div className="flex items-center space-x-4">
                <Button variant="outline" size="icon" className="relative">
                  <Bell size={18} />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback>{userInitials}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{userName}</p>
                        <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
                        <p className="text-xs leading-none text-muted-foreground capitalize">Role: {effectiveUserRole}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link
                        to="/dashboard/settings"
                        className="w-full flex items-center"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LogoutForm />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6">{children}</main>

          <footer className="bg-white border-t py-4 px-4 text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Smart Campus System. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}