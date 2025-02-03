"use client";

import { api } from "~/trpc/react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import { FaCopy } from "react-icons/fa";
import createToast from "~/components/ui/toast";

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

  const handleCopy = async (copyString: string) => {
    try {
      await navigator.clipboard.writeText(copyString);
      await createToast(Promise.resolve(), "URL copied to clipboard");
    } catch (error) {
      console.log(error);
      await createToast(
        Promise.reject(new Error("Failed to copy URL to clipboard")),
        "Failed to copy URL to clipboard",
      );
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center overflow-auto bg-gradient-to-bl from-emerald-950 to-emerald-800 px-2 pt-16 sm:px-4">
      {/* Profile Section */}
      <div className="mt-16 flex w-full flex-col rounded-2xl bg-gradient-to-tr from-emerald-700 to-emerald-600 px-2 py-4 shadow-lg lg:w-[60%] lg:px-16 lg:py-10">
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
        <div className="mt-8 flex-grow overflow-y-auto overflow-x-hidden">
          <h2 className="px-2 text-4xl font-semibold text-palate_1/90">
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
                  className="flex flex-row justify-between rounded-lg border border-gray-200 bg-palate_2 p-2 shadow-sm lg:p-4"
                >
                  <div className="flex h-full overflow-x-scroll lg:mb-0">
                    <div className="flex flex-col gap-2">
                      <div>
                        <div className="flex flex-row items-center">
                          <span className="text-md mr-4 text-center font-semibold text-palate_1/90 md:text-xl">
                            Copy Order ID:
                          </span>
                          <button
                            onClick={async () => await handleCopy(order.id)}
                          >
                            <FaCopy className="size-6 items-center pb-1 text-palate_1" />
                          </button>
                        </div>
                        <span className="text-wrap text-xs font-semibold text-palate_1/25 lg:text-xl">
                          {order.id}
                        </span>
                      </div>
                      {order.OrderItem.map((item) => {
                        return (
                          <span key={item.id} className="font-semibold text-palate_1 lg:text-xl">
                            {item.Merchandise.name} x{item.quantity}
                          </span>
                        );
                      })}
                      <span className="text-xl text-palate_1/90 py-2">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center rounded-md">
                    <QRCodeCanvas
                      bgColor="rgba(0,0,0,0)"
                      fgColor="#FEFED8"
                      value={`${order.id}`}
                      size={140}
                    />
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
