"use client";

import { getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { client } from "./client";
import { CROWDFUNDING_FACTORY } from "./constants/contracts";

export default function Home() {
  const contract = getContract({
    client: client,
    chain: baseSepolia,
    address: CROWDFUNDING_FACTORY,
  });
  return (
    <main className="max-w-7xl mx-auto px-4 mt-4 sm:px-6 lg:px-8">
      <div className="py-10">
        <h1 className="text-4xl font-bold mb-4">Campaings:23mn</h1>
      </div>
    </main>
  );
}
