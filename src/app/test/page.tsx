import React from "react";
import PaymentButton from "~/components/ui/buyButton";

export default function Test() {
  return (
    <div>
      <PaymentButton
        merch={[
          {
            id: "cm5xnvasb0002sazzujw67rnh",
            quantity: 5,
            size: "FREE_SIZE",
          },
        ]}
        total={100}
      />
    </div>
  );
}
