import { useGetMeQuery } from "@/store/slices/authSlice";
import { ChangePassForm } from "@/components/auth/ChangePassForm"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function UserProfile() {
  const { data: apiResponse, isLoading, error, isFetching } = useGetMeQuery();

  const user = apiResponse?.data?.user;

  if (isLoading || isFetching) return <div className="text-center text-muted-foreground">Loading profile...</div>;

  if (error) {
    let errorMessage = "Unable to load profile";
    if (typeof error === 'object' && error !== null && 'status' in error) {
        const queryError = error as { status: string | number, data?: { message?: string }, error?: string };
        errorMessage = `Error ${queryError.status}: ${queryError.data?.message || queryError.error || 'Unknown error'}`;
    } else if (error instanceof Error) {
        errorMessage = error.message;
    }
    return <div className="text-center text-destructive">{errorMessage}</div>;
  }
  
  if (apiResponse?.status !== 'success' || !user) {
    return <div className="text-center text-muted-foreground">{apiResponse?.message || "User data not found or failed to load."}</div>;
  }

  const capitalizeRole = (role: string) => {
    if (!role) return "";
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card className="shadow-md">
        <CardHeader className="bg-gradient-to-b from-campus-blue to-campus-indigo text-white">
          <CardTitle className="text-2xl font-bold">User Profile</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <dl className="space-y-4">
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-muted-foreground">Email</dt>
              <dd className="text-sm">{user.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-muted-foreground">Full Name</dt>
              <dd className="text-sm">{user.firstName} {user.lastName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-muted-foreground">Role</dt>
              <dd className="text-sm">{capitalizeRole(user.role)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader className="bg-gradient-to-b from-campus-blue to-campus-indigo text-white">
          <CardTitle className="text-2xl font-bold">Change Password</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ChangePassForm />
        </CardContent>
      </Card>
    </div>
  );
}