"use client";

import { getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { client } from "./client";

export default function Home() {
  const contract = getContract({
    client: client,
    chain: baseSepolia,
    address: "0x6d7f5a7f1e0a9e6b9b0a3f1f4b3b3f0d2f7b3c3",
  });
  return (
    <main className="max-w-7xl mx-auto px-4 mt-4 sm:px-6 lg:px-8">
      <div className="py-10">
        <h1 className="text-4xl font-bold mb-4">Campaings:23mn</h1>
      </div>
    </main>
  );
}
