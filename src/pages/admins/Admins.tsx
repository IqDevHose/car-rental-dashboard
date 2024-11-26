import { useEffect, useState } from "react";
import { DataTable } from "@/components/DataTable";
import Options from "@/components/Options";
import PageTitle from "@/components/PageTitle";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/AxiosInstance";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Link, useNavigate } from "react-router-dom";
import ConfirmationModal from "@/components/ConfirmationModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Calendar,
  PencilIcon,
  Phone,
  PlusIcon,
  TrashIcon,
  UserIcon,
} from "lucide-react";
import Loading from "@/components/Loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
type User = {
  avatar: null;
  birthDay: string;
  email: string;
  gender: "male";
  id: number;
  name: string;
  phone: string;
  type: string;
};

export default function Admins() {
  const navigate = useNavigate();
  const [userSearch, setUserSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // Initialize query client
  const queryClient = useQueryClient();

  // Query to fetch users
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users");
      console.log("Fetched Admins:", res.data);
      return res.data;
    },
  });

  const currentUserId = localStorage.getItem("userId"); // Assume this hook gives us the current user's info

  // Function to handle deletion
  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/auth/admins/${id}`);
      setModalOpen(false); // Close modal after deletion
      setSelectedUser(null); // Clear selected user
      queryClient.invalidateQueries({ queryKey: ["users"] }); // Refetch users to update the list
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  // Loading state
  // if (isLoading) return <Loading />;

  // if (error)
  //   return (
  //     <div className="flex justify-center items-center h-full self-center mx-auto">
  //       Error loading users
  //     </div>
  //   );

  const MobileCardView = ({ data }: { data: User[] }) => (
    <div className="space-y-4">
      {data.map((user) => (
        <Card key={user.id} className="border shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium">{user.name}</CardTitle>
              <Link to={`/edit-admin/${user.id}`} state={{ user }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-blue-500 hover:text-blue-600"
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              {user.phone || "N/A"}
            </div>
            <div className="text-sm">
              <span className="font-medium">Email: </span>
              {user.email || "N/A"}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Filter users based on search input
  // const filteredData = users?.filter(
  //   (user: User) =>
  //     user?.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
  //     user?.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
  //     user?.phone?.includes(userSearch)
  // );
  // console.log(users);

  // Define the columns for the table
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const isCurrentUser = row.original.id === Number(currentUserId);
        return (
          <div className="flex items-center gap-1">
            <span>{row.getValue("name")}</span>
            {isCurrentUser && <Badge variant="outline">Me</Badge>}
          </div>
        );
      },
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const id = row.original.id; // Access the user's ID
        const name = row.getValue("name") as string; // Access the user's name
        console.log(row.original);

        return (
          <div className="flex gap-2">
            {/* Link to Edit user */}
            <Link to={`/edit-admin/${id}`} state={{ user: row.original }}>
              <Button
                variant="ghost"
                size="icon"
                className="text-blue-500 hover:text-blue-600"
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
            </Link>
            {/* Button to Delete user */}
            {/* <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-600"
              onClick={() => {
                setSelectedUser({ id, name }); // Set selected user for deletion
                setModalOpen(true); // Open confirmation modal
              }}
            >
              <TrashIcon className="h-4 w-4" />
            </Button> */}
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col p-4 md:p-10 gap-5 w-full max-w-[100vw] overflow-x-hidden pt-12 ">
      <PageTitle title="Admins" />
      <Options
        haveSearch={true}
        searchValue={userSearch}
        setSearchValue={setUserSearch}
        buttons={[
          <Link to="/new-admin" key="add-user">
            {/* add plus icon */}

            <Button variant="default" className="flex items-center gap-1">
              <PlusIcon className="w-4 h-4" />
              <span>Add Admin</span>
            </Button>
          </Link>,
        ]}
      />

      {/* Mobile View */}
      {/* <div className="md:hidden">
        <MobileCardView data={filteredData || []} />
      </div> */}

      {/* Pass the filtered data to the DataTable */}
      {/* <div className="hidden md:block">
        <DataTable
          columns={columns}
          data={filteredData || []}
          editLink={"/edit-admin"} // Provide the base link for editing users
          handleDelete={function (id: string): void {
            throw new Error("Function not implemented.");
          }}
        />
      </div> */}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() => {
          if (selectedUser) {
            handleDelete(selectedUser.id); // Call delete function with the selected user ID
          }
        }}
        message={`Are you sure you want to delete user with name "${selectedUser?.name}"?`} // Updated message to use user's name
      />
    </div>
  );
}
