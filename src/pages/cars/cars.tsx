import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import axiosInstance from "@/utils/AxiosInstance";
import { Car } from "@/types/car";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";

export default function Cars() {
  const navigate = useNavigate();
  const {
    data: cars,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cars"],
    queryFn: async () => {
      const response = await axiosInstance.get("/cars");
      return response.data;
    },
  });

  const queryClient = useQueryClient(); // Access the query client

  const toggleMostRentedMutation = useMutation({
    mutationFn: async (id: any) => {
      return await axiosInstance.patch(`/cars/most-rented/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cars"]);
    },
  });

  const handleSwitchChange = (id: any) => {
    toggleMostRentedMutation.mutate(id);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading cars</div>;

  return (
    <div className="container mx-auto p-4 mt-12 md:mt-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cars</h1>
        <Button onClick={() => navigate("/cars/create")}>Add New Car</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cars?.map((car: Car) => (
          <Card
            key={car.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="p-4" onClick={() => navigate(`/cars/${car.id}`)}>
              {car.images?.[0] && (
                <img
                  src={car.images[0].link}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}
              <h2 className="text-xl font-semibold">
                {car.brand} {car.model}
              </h2>
              <p className="text-gray-600">{car.name}</p>
              <p className="text-lg font-bold text-primary mt-2">
                {car.price.toLocaleString()} IQD
              </p>
              <p className="text-gray-500 mt-2 line-clamp-2">
                {car.description}
              </p>
            </div>
            <div className="flex gap-x-4 items-center p-4">
              <h3>Is Most Rented</h3>

              <Switch
                checked={car.isMostRented}
                onCheckedChange={() => handleSwitchChange(car.id)}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
