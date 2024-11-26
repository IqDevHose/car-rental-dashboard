import { Box, CreditCard, DollarSign, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import BarChart from "@/components/BarChart";
import LineChart from "@/components/LineChart";
import SalesCard from "@/components/SalesCard";
import Card, { CardContent } from "@/components/card";
import PageTitle from "@/components/PageTitle";
import axiosInstance from "@/utils/AxiosInstance";
import { RecentSale } from "@/utils/type";

// API functions
const fetchSubscriptionStats = async () => {
  const res = await axiosInstance.get("/stats/subscription-stats");
  return res.data;
};

const fetchRevenueStats = async () => {
  const res = await axiosInstance.get("/stats/revenue-stats");
  return res.data;
};

const fetchSalesStats = async () => {
  const res = await axiosInstance.get("/stats/sales-stats");
  return res.data;
};

const fetchRecentSales = async () => {
  const res = await axiosInstance.get("/stats/recent-sales");
  return res.data;
};

export default function Home() {
  const { data: SubscriptionStats } = useQuery({
    queryKey: ["SubscriptionStats"],
    queryFn: fetchSubscriptionStats,
  });

  const { data: revenueStats } = useQuery({
    queryKey: ["revenueStats"],
    queryFn: fetchRevenueStats,
  });

  const { data: salesStats } = useQuery({
    queryKey: ["salesStats"],
    queryFn: fetchSalesStats,
  });

  const { data: recentSales } = useQuery({
    queryKey: ["recentSales"],
    queryFn: fetchRecentSales,
  });

  const cardData = [
    {
      label: "Total Revenue",
      amount: revenueStats
        ? `$${revenueStats.totalRevenue.toFixed(2)}`
        : "Loading...",
      description: "From shipped and delivered orders",
      icon: DollarSign,
    },
    {
      label: "Total Subscriptions",
      amount: SubscriptionStats
        ? SubscriptionStats.totalOrders.toString()
        : "Loading...",
      description: `${SubscriptionStats?.pendingOrders || 0} pending`,
      icon: Users,
    },
    {
      label: "Total Sales",
      amount: salesStats ? salesStats.totalSales.toString() : "Loading...",
      description: "Items sold",
      icon: CreditCard,
    },
    {
      label: "Total Products",
      amount: SubscriptionStats
        ? SubscriptionStats.totalProducts.toString()
        : "Loading...",
      description: "Items in stock",
      icon: Box,
    },
  ];

  return (
    <div className="flex flex-col p-4 md:p-10 gap-5 w-full max-w-[100vw] overflow-x-hidden pt-12 ">
      <PageTitle title="Dashboard" />
      <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">
        {cardData.map((data, index) => (
          <Card
            key={index}
            amount={data.amount}
            description={data.description}
            icon={data.icon}
            label={data.label}
          />
        ))}
      </section>
    </div>
  );
}
