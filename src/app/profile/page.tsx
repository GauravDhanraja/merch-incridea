"use client";

import { api } from "~/trpc/react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react"; 
import items from "razorpay/dist/types/items";
import { MerchData } from "../admin/_components/merchData";

const Orders = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Fetch user orders using tRPC
  const { data: orders, error } = api.order.getUserOrders.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  useEffect(() => {
    if (status === "loading") return; 
    if (!session) {
      router.push("/"); 
    }
  }, [session, status, router]);

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pt-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-bl from-emerald-950 to-emerald-800">
      {/* Profile Section */}
      <div className="flex flex-col items-center md:flex-row md:justify-between mt-10 md:space-x-12 md:items-center">
        <div className="flex items-center justify-center">
          <div className="text-center md:text-left mt-8 md:mt-0">
            <h1 className="text-3xl font-bold text-palate_1/90">{session?.user?.name}</h1>
            <p className="text-xl text-palate_1/90">{session?.user?.email}</p>
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <div className="flex-grow mt-8 overflow-y-auto">
        <h2 className="text-2xl font-semibold text-palate_1/90">Your Orders</h2>
        {orders?.length === 0 ? (
          <p className="mt-4 text-gray-500 text-palate_1/90">You have no orders yet.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {orders?.map((order) => (
              <div
                key={order.id}
                className="flex flex-col md:flex-row items-center justify-between p-4 border border-gray-200 rounded-lg shadow-sm"
              >
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="flex flex-col">
                    <span className="font-semibold text-palate_1/90">Product:{MerchData.name} </span> {/*product name to be put */}
                    <span className="text-sm text-palate_1/90">
                      Date: {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="w-20 h-20 bg-gray-300 rounded-md flex items-center justify-center">
                  <QRCodeCanvas value={`https://grimaceshake.com/order/${order.id}`} size={80} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

