"use client";

import PageContainer from "~/components/layout/page-container";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { api } from "~/trpc/react";
import { MerchData } from "./_components/merchData";
import { merchColumns, orderColumns } from "./_components/columns";
import { OrderData } from "./_components/orderData";
import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "~/server/api/root";

type MerchSalesData = inferProcedureOutput<AppRouter["merchandise"]["getMerchSales"]>;
type UserOrdersData = inferProcedureOutput<AppRouter["order"]["getAllUserOrders"]>;

export default function Admin() {
  // Fetching data from API
  const { data: merchData = [], isLoading: merchLoading } = api.merchandise.getMerchSales.useQuery();
  const { data: orderData = [], isLoading: orderLoading } = api.order.getAllUserOrders.useQuery();
  const { data: transactionData = [], isLoading: transactionLoading } = api.razorpay.getAllTransactions.useQuery();

  // Calculate total revenue and sales
  const totalRevenue = merchData.reduce((acc, item) => acc + (item.originalPrice || 0), 0).toFixed(2);
  const totalSales = merchData.reduce((acc, item) => acc + (item.stock || 0), 0);

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-white">Admin Dashboard</h2>
          <div className="hidden items-center space-x-2 md:flex">
            <Button className="text-white">Create Merch</Button>
            <Button className="text-white">Download</Button>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics" disabled>Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Content */}
          <TabsContent value="overview" className="space-y-4">
            {/* Cards Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Total Revenue */}
              <Card>
                <CardHeader className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{merchLoading ? "Loading..." : `₹${totalRevenue}`}</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>

              {/* Total Sales */}
              <Card>
                <CardHeader className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{merchLoading ? "Loading..." : totalSales}</div>
                  <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                </CardContent>
              </Card>

              {/* Sales Growth (Placeholder) */}
              <Card>
                <CardHeader className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Sales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+12,234</div>
                  <p className="text-xs text-muted-foreground">+19% from last month</p>
                </CardContent>
              </Card>

              {/* Active Users (Placeholder) */}
              <Card>
                <CardHeader className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+573</div>
                  <p className="text-xs text-muted-foreground">+201 since last hour</p>
                </CardContent>
              </Card>
            </div>

            {/* Order & Merchandise Data Tables */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              {/* Order Data */}
              <Card className="col-span-5 md:col-span-4">
                <CardHeader>
                  <CardTitle>Order Wise Data</CardTitle>
                  <CardDescription>This is the order-wise data.</CardDescription>
                </CardHeader>
                <CardContent>
                  {orderLoading ? (
                    <p className="text-muted-foreground">Loading order data...</p>
                  ) : (
                    <OrderData columns={orderColumns} data={orderData} />
                  )}
                </CardContent>
              </Card>

              {/* Merchandise Data */}
              <Card className="col-span-4 md:col-span-3">
                <CardHeader>
                  <CardTitle>Merchandise Wise Data</CardTitle>
                  <CardDescription>This is the merchandise-wise data.</CardDescription>
                </CardHeader>
                <CardContent>
                  {merchLoading ? (
                    <p className="text-muted-foreground">Loading merchandise data...</p>
                  ) : (
                    <MerchData columns={merchColumns} data={merchData} />
                  )}
                </CardContent>
              </Card>

              {/* Placeholder for Graphs */}
              <div className="col-span-4">{/* <PieGraph /> */}</div>
              <div className="col-span-4 md:col-span-3">{/* <PieGraph /> */}</div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
