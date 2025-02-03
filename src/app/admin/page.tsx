"use client";

import PageContainer from "~/components/layout/page-container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Tabs, TabsContent} from "~/components/ui/tabs";
import { api } from "~/trpc/react";
import { MerchData } from "./_components/merchData";
import { merchColumns, orderColumns } from "./_components/columns";
import { OrderData } from "./_components/orderData";

export default function Admin() {

  const { data: merchData = [], isLoading: merchLoading } = api.merchandise.getMerchSales.useQuery();
  const { data: orderData = [], isLoading: orderLoading } = api.order.getAllUserOrders.useQuery();
  const { data: transactionData = [], isLoading: transactionLoading } = api.razorpay.getAllTransactions.useQuery();

  const totalRevenue = transactionData.reduce((acc, item) => acc + (item.amount || 0), 0).toFixed(2);
  const totalSales = merchData.reduce((acc, item) => acc + (item.stock  || 0), 0);


  

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-white">Admin Dashboard</h2>
        </div>

   
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-2 md:grid-cols-1 lg:grid-cols-2">
              <Card>
                <CardHeader className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{transactionLoading ? "Loading..." : `₹${totalRevenue}`}</div>
                </CardContent>
              </Card>


              <Card>
                <CardHeader className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{merchLoading ? "Loading..." : totalSales}</div>
                </CardContent>
              </Card>
            </div>

       
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

            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
