import { DataTable } from "@/components/DataTable";
import Options from "@/components/Options";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/AxiosInstance";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import ConfirmationModal from "@/components/ConfirmationModal";
import Loading from "@/components/Loading";
import {
  PencilIcon,
  PlusIcon,
  Power,
  DollarSign,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Plans = {
  id: string;
  title: {
    ar: string;
    en: string;
  };
  price: string;
  description: {
    ar: string;
    en: string;
  };
  isActive: boolean;
  advantages?: {
    [key: string]: string;
  };
};

export default function Plans() {
  const [userSearch, setUserSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Plans | null>(null);

  const queryClient = useQueryClient();
  const {
    data: plans,
    isPending,
    error,
  } = useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const res = await axiosInstance.get("/products");
      return res.data;
    },
    refetchOnWindowFocus: true,
  });

  if (isPending) return <Loading />;
  if (error)
    return (
      <div className="flex justify-center items-center h-full">
        Error loading products
      </div>
    );

  const filteredData = plans.filter((plan: Plans) =>
    plan?.title?.en?.toLowerCase().includes(userSearch.toLowerCase())
  );

  // Mobile card view renderer
  const MobileCardView = ({ data }: { data: Plans[] }) => (
    <div className="space-y-4">
      {data.map((plan, index) => (
        <Card key={index} className="border shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg font-medium">
                  {plan.title.en}
                </CardTitle>
                <Badge
                  variant={plan.isActive ? "success" : "destructive"}
                  className="mt-2"
                >
                  {plan.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Link to={`/edit-product/${plan.id}`} state={{ plan }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${
                    plan.isActive
                      ? "bg-green-600 hover:bg-green-600/95"
                      : "bg-red-600 hover:bg-red-600/95"
                  } text-white hover:text-white`}
                  onClick={() => {
                    setSelectedProduct(plan);
                    setModalOpen(true);
                  }}
                >
                  <Power className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              {plan.price}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span className="line-clamp-2">{plan.description.en}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const columns: ColumnDef<Plans>[] = [
    {
      accessorKey: "title",
      header: "Plan Name",
      cell: ({ row }) => {
        const planName = row.original?.title?.en || "Unnamed Plan";
        return (
          <div className="flex gap-2 items-center">
            <p>{planName}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const description = row.original.description?.en || "No description";
        return (
          <div className="truncate w-32">
            <span className="block overflow-hidden whitespace-nowrap text-ellipsis">
              {description}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: "Price",
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const plan = row.original;
        return (
          <div className="flex gap-2">
            <Link to={`/edit-product/${plan.id}`} state={{ plan }}>
              <Button
                variant="ghost"
                size="icon"
                className="text-blue-500 hover:text-blue-600"
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className={`${
                plan.isActive
                  ? "bg-green-600 hover:bg-green-600/95"
                  : "bg-red-600 hover:bg-red-600/95"
              } text-white hover:text-white`}
              onClick={() => {
                setSelectedProduct(plan);
                setModalOpen(true);
              }}
            >
              <Power className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const handleDeactivate = async (id: string) => {
    try {
      const response = await axiosInstance.get(`/products/${id}`);
      if (!response.data) {
        console.error("Product not found:", id);
        return;
      }

      await axiosInstance.put(`products/activation/${id}`);
      setModalOpen(false);
      setSelectedProduct(null);
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    } catch (err) {
      console.error("Failed to delete plan:", err);
    }
  };

  return (
    <div className="flex flex-col p-4 md:p-10 gap-5 w-full max-w-[100vw] overflow-x-hidden pt-12 ">
      <PageTitle title="Products" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
        <Options
          haveSearch={true}
          searchValue={userSearch}
          setSearchValue={setUserSearch}
          buttons={[
            <Link
              to="/new-product"
              key="add-product"
              className="w-full sm:w-auto"
            >
              <Button
                variant="default"
                className="w-full sm:w-auto items-center gap-1 flex justify-center"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Add Product</span>
              </Button>
            </Link>,
          ]}
        />
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <MobileCardView data={filteredData} />
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <DataTable
          columns={columns}
          data={filteredData}
          editLink="/edit-product"
          handleDelete={handleDeactivate}
        />
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        alertTitle="Confirm Status Change"
        actionBtnText={selectedProduct?.isActive ? "Deactivate" : "Activate"}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        onConfirm={() => {
          if (selectedProduct) {
            handleDeactivate(selectedProduct.id);
          }
        }}
        message={`Are you sure you want to ${
          selectedProduct?.isActive ? "deactivate" : "activate"
        } the product "${selectedProduct?.title.en}"?`}
      />
    </div>
  );
}
