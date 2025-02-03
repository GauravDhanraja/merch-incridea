"use client";

import PageContainer from "~/components/layout/page-container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Tabs, TabsContent } from "~/components/ui/tabs";
import { api } from "~/trpc/react";
import { MerchData } from "./_components/merchData";
import { merchColumns, orderColumns } from "./_components/columns";
import { OrderData } from "./_components/orderData";
import AdminNav  from "../../components/ui/adminNav"

export default function Admin() {
  const { data: merchData = [], isLoading: merchLoading } =
    api.merchandise.getMerchSales.useQuery();
  const { data: orderData = [], isLoading: orderLoading } =
    api.order.getAllUserOrders.useQuery();
  const { data: transactionData = [], isLoading: transactionLoading } =
    api.razorpay.getAllTransactions.useQuery();

  const totalRevenue = transactionData
    .reduce((acc, item) => acc + (item.amount || 0), 0)
    .toFixed(2);
  const totalSales = merchData.reduce((acc, item) => acc + (item.stock || 0), 0);

  return (
    <PageContainer scrollable>
      <>
      < AdminNav/>
      </>
      <div className="space-y-6 px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight text-white text-center md:text-left">
            Admin Dashboard
          </h2>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {transactionLoading ? "Loading..." : `₹${totalRevenue}`}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {merchLoading ? "Loading..." : totalSales}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Data Section */}
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
              {/* Order Data */}
              <Card className="col-span-1 lg:col-span-4">
                <CardHeader>
                  <CardTitle>Order Wise Data</CardTitle>
                  <CardDescription>Detailed order-wise statistics.</CardDescription>
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
              <Card className="col-span-1 lg:col-span-3">
                <CardHeader>
                  <CardTitle>Merchandise Wise Data</CardTitle>
                  <CardDescription>Detailed merchandise sales data.</CardDescription>
                </CardHeader>
                <CardContent>
                  {merchLoading ? (
                    <p className="text-muted-foreground">Loading merchandise data...</p>
                  ) : (
                    <MerchData columns={merchColumns} data={merchData} />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
