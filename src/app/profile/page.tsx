"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Profile = () => {
  const { data: session, status } = useSession(); 
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; 

    if (!session) {
      router.push("/"); 
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div className="flex justify-center items-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col pt-16 px-4 sm:px-6 lg:px-8">
      {/* Profile Section */}
      <div className="flex flex-col items-center md:flex-row md:justify-between mt-10 md:space-x-12 md:items-center">
        <div className="flex items-center justify-center">
          <div className="text-center md:text-left mt-8 md:mt-0">
             <h1 className="text-3xl font-bold">{session?.user?.name}</h1>
             <p className="text-xl text-gray-500">{session?.user?.email}</p>
           </div>
        </div>
      </div>

      {/* Orders Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold">Your Orders</h2>
        <div className="mt-4 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between p-4 border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="flex flex-col">
                <span className="font-semibold">Product Name</span>
                <span className="text-sm text-gray-500">Order Date</span>
              </div>
            </div>
            <div className="w-20 h-20 bg-gray-300 rounded-md flex items-center justify-center">
              <span className="text-white">QR</span>
            </div>
          </div>
      
          
        
          <p className="mt-4 text-gray-500">You have no orders yet.</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;




