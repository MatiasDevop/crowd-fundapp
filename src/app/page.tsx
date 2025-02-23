"use client";

import { getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { client } from "./client";
import { CROWDFUNDING_FACTORY } from "./constants/contracts";
import { useReadContract } from "thirdweb/react";
import CampaignCard from "./components/CampaignCard";

// contract address 9c66fe86d23e737f8805ec77199537b0
export default function Home() {
  const contract = getContract({
    client: client,
    chain: baseSepolia,
    address: CROWDFUNDING_FACTORY,
  });

  console.log("here the contract....", contract);
  const { data: campaigns, isPending } = useReadContract({
    contract,
    method:
      "function getAllCampaigns() view returns ((address campaignAddress, address owner, string name, uint256 creationTime)[])",
    params: [],
  });
  console.log("here the campaigns....", campaigns);

  return (
    <main className="max-w-7xl mx-auto px-4 mt-4 sm:px-6 lg:px-8">
      <div className="py-10">
        <h1 className="text-4xl font-bold mb-4">Campaings:23mn</h1>
        <div className="grid grid-cols-3 gap-4">
          {!isPending &&
            campaigns &&
            (campaigns.length > 0 ? (
              campaigns.map((campaign, index) => (
                <CampaignCard
                  key={campaign.campaignAddress}
                  campaignAddress={campaign.campaignAddress}
                />
              ))
            ) : (
              <p>No campaigns found</p>
            ))}
        </div>
      </div>
    </main>
  );
}
