import { Box, CreditCard, DollarSign, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import BarChart from "@/components/BarChart";
import LineChart from "@/components/LineChart";
import SalesCard from "@/components/SalesCard";
import Card, { CardContent } from "@/components/card";
import PageTitle from "@/components/PageTitle";
import axiosInstance from "@/utils/AxiosInstance";
import { RecentSale } from "@/utils/type";

export default function Home() {

  return (
    <div className="flex flex-col p-4 md:p-10 gap-5 w-full max-w-[100vw] overflow-x-hidden pt-12 ">
      <PageTitle title="Vehicles" />
      <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">
        <p className="border">Bordered Card</p>
        <p className="border">Bordered Card</p>
        <p className="border">Bordered Card</p>
        <p className="border">Bordered Card</p>
      </section>
    </div>
  );
}
