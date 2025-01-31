"use client";

import { api } from "~/trpc/react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import items from "razorpay/dist/types/items";
import { MerchData } from "../admin/_components/merchData";
import { Card } from "~/components/ui/card";
import { Merchandise,type OrderItem } from "@prisma/client";



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
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen overflow-auto flex-col items-center bg-gradient-to-bl from-emerald-950 to-emerald-800 px-2 pt-16 sm:px-4">
      {/* Profile Section */}
      <div className="flex flex-col w-full px-4 py-4 lg:w-[60%] mt-16 shadow-lg rounded-2xl lg:py-10 lg:px-16 bg-gradient-to-tr from-emerald-700 to-emerald-600">
        <div className="flex flex-col items-center lg:flex-row lg:items-center lg:justify-center lg:space-x-12">
          <div className="flex items-center justify-center">
            <div className="mt-8 text-center lg:mt-0 lg:text-left">
              <h1 className="text-3xl font-bold text-palate_1/90">
                {session?.user?.name}
              </h1>
              <p className="text-xl text-palate_1/90">{session?.user?.email}</p>
            </div>
          </div>
        </div>

        
        
        {/* Orders Section */}
        <div className="mt-8 flex-grow overflow-y-auto">
          <h2 className="text-4xl font-semibold text-palate_1/90 px-2">
            Orders
          </h2>
          {orders?.length === 0 ? (
            <p className="mt-4 text-2xl text-gray-500 text-palate_1/90">
              You have no orders yet.
            </p>
          ) : (
            <div className="mt-4 space-y-6">
              {orders?.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-row justify-between bg-palate_2 rounded-lg border border-gray-200 p-4 shadow-sm"
                >
                  <div className="mb-4 h-full flex lg:mb-0">
                    <div className="flex flex-col">
                      <span className="font-semibold text-2xl text-palate_1/90">
                        {MerchData.name}{" "}
                      </span>{" "}
                      {/*product name to be put */}
                      <span className="text-xl text-palate_1/90">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="rounded-md flex items-center justify-center">
                  <QRCodeCanvas bgColor="rgba(0,0,0,0)" fgColor="#FEFED8" value={`${order.id}`} size={140} />
                </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
