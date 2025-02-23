"use client";
import { Scanner } from "@yudiel/react-qr-scanner";
import toast from "react-hot-toast";
import { api } from "~/trpc/react";

export default function Admin() {
  const markDelivered = api.order.markOrderDelivered.useMutation();
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="size-[20rem]">
        <Scanner
          onScan={(result) => {
            if (result[0]?.rawValue) {
              markDelivered.mutate(
                { id: result[0]?.rawValue },
                {
                  onSuccess: () => {
                    toast.success("Order marked as delivered");
                  },
                  onError: () => {
                    toast.error("Couldn't mark order as delivered");
                  },
                },
              );
            } else {
              toast.error("Couldn't scan the QR code");
            }
          }}
        />
      </div>
    </div>
  );
}
