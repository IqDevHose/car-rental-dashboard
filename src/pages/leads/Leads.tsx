import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import Options from "@/components/Options";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/AxiosInstance";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loading from "@/components/Loading";
import { PencilIcon, PlusIcon, Phone, Building2, Calendar } from "lucide-react";

export default function Leads() {
  const [userSearch, setUserSearch] = useState("");
  const [selectedService, setSelectedService] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const {
    data: records,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["records"],
    queryFn: async () => {
      const res = await axiosInstance.get("/sales");
      return res.data;
    },
  });

  if (isLoading) return <Loading />;
  if (error)
    return (
      <div className="flex justify-center items-center h-full">
        Error loading users
      </div>
    );

  const filteredData = records?.filter((record: any) => {
    const matchesService =
      selectedService === "all" || record?.serviceRequired === selectedService;
    const matchesStatus =
      selectedStatus === "all" || record?.leadStatus === selectedStatus;
    const matchesSearch =
      userSearch === "" ||
      record?.leadName.toLowerCase().includes(userSearch.toLowerCase()) ||
      record?.company.toLowerCase().includes(userSearch.toLowerCase());

    return matchesService && matchesStatus && matchesSearch;
  });

  // Mobile card view renderer
  const MobileCardView = ({ data }: { data: any[] }) => (
    <div className="space-y-4">
      {data.map((record, index) => (
        <Card key={index} className="border shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-medium">
                {record.leadName}
              </CardTitle>
              <Link to={`/edit-sale/${record.id}`} state={{ user: record }}>
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
              <Building2 className="h-4 w-4" />
              {record.company}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              {record.phoneNumber}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {record.date}
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <div className="text-sm">
                <span className="font-medium">Service: </span>
                {record.serviceRequired}
              </div>
              <div className="text-sm">
                <span className="font-medium">Status: </span>
                {record.leadStatus}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Desktop columns definition
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "leadName",
      header: "Lead Name",
    },
    {
      accessorKey: "company",
      header: "Company",
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone",
    },
    {
      accessorKey: "serviceRequired",
      header: "Service Required",
    },
    {
      accessorKey: "leadStatus",
      header: "Status",
    },
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Link
          to={`/edit-sale/${row.original.id}`}
          state={{ user: row.original }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="text-blue-500 hover:text-blue-600"
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="flex flex-col p-4 md:p-10 gap-5 w-full max-w-[100vw] overflow-x-hidden pt-12 ">
      <PageTitle title="Sales" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
        <Options
          haveSearch={true}
          searchValue={userSearch}
          setSearchValue={setUserSearch}
          buttons={[
            <Link to="/new-sale" key="add-user" className="w-full sm:w-auto">
              <Button
                variant="default"
                className="w-full sm:w-auto items-center gap-1 flex justify-center"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Add Sale</span>
              </Button>
            </Link>,
          ]}
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Select
          value={selectedService}
          onValueChange={(value) => setSelectedService(value)}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by Service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Service Required</SelectItem>
            <SelectItem value="domain_registration_with_hosting">
              Domain Registration With Hosting
            </SelectItem>
            <SelectItem value="domain_registration">
              Domain Registration
            </SelectItem>
            <SelectItem value="portfolio_website">Portfolio Website</SelectItem>
            <SelectItem value="ecommerce_website">Ecommerce Website</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={selectedStatus}
          onValueChange={(value) => setSelectedStatus(value)}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Status</SelectItem>
            <SelectItem value="cold_lead">Cold Lead</SelectItem>
            <SelectItem value="hot_lead">Hot Lead</SelectItem>
            <SelectItem value="unsure">Unsure</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <MobileCardView data={filteredData || []} />
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <DataTable
          columns={columns}
          data={filteredData || []}
          editLink="/edit-sale"
          handleDelete={(id: string) => console.log("Delete", id)}
        />
      </div>
    </div>
  );
}
