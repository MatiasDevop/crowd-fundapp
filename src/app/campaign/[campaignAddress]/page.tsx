"use client";

import { client } from "@/app/client";
import { useParams } from "next/navigation";
import React from "react";
import { getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { useReadContract } from "thirdweb/react";

export default function CampaignPage() {
  const { campaignAddress } = useParams();
  const contract = getContract({
    client: client,
    chain: baseSepolia,
    address: campaignAddress as string,
  });

  const { data: name, isLoading: isLoadingName } = useReadContract({
    contract: contract,
    method: "function name() view returns (string)",
    params: [],
  });

  const { data: description } = useReadContract({
    contract: contract,
    method: "function description() view returns (string)",
    params: [],
  });

  const { data: deadline, isLoading: isLoadingDeadline } = useReadContract({
    contract: contract,
    method: "function deadline() view returns (uint256)",
    params: [],
  });

  const deadlineDate = new Date(
    parseInt(deadline?.toString() as string) * 1000
  );
  const deadlinePassed = deadlineDate < new Date();

  const { data: goal, isLoading: isLoadingGoal } = useReadContract({
    contract: contract,
    method: "function goal() view returns (uint256)",
    params: [],
  });

  const { data: balance, isPending: isLoadingBalance } = useReadContract({
    contract: contract,
    method: "function getContractBalance() view returns (uint256)",
    params: [],
  });

  const totalBalance = balance?.toString();
  const totalGoal = goal?.toString();
  let balancePercentage =
    (parseInt(totalBalance as string) / parseInt(totalGoal as string)) * 100;

  if (balancePercentage >= 100) {
    balancePercentage = 100;
  }

  const { data: tiers, isLoading: isLoadingTiers } = useReadContract({
    contract: contract,
    method:
      "function getTiers() view returns ((string name, uint256 amount, uint256 backers)[])",
    params: [],
  });

  const { data: owner, isLoading: isLoadingOwner } = useReadContract({
    contract: contract,
    method: "function owner() view returns (address)",
    params: [],
  });

  const { data: status } = useReadContract({
    contract: contract,
    method: "function status() view returns (uint8)",
    params: [],
  });

  return (
    <div className="max-auto max-w-7xl px-2 mt-4 sm:px-6 lg:px-8">
      <div className="flex flex-row justify-between items-center">
        {!isLoadingName && <p className="text-4xl font-semibold">{name}</p>}
      </div>
      <div className="my-4">
        <p className="text-lg font-semibold">Description:</p>
        <p>{description}</p>
      </div>
      <div className="mb-4">
        <p className="text-lg font-semibold">Deadline:</p>
        {!isLoadingDeadline && (
          <p>
            {deadlinePassed
              ? "The deadline has passed"
              : deadlineDate.toDateString()}
          </p>
        )}
      </div>
      {!isLoadingBalance && !isLoadingGoal && (
        <div className="mb-4">
          <p className="text-lg font-semibold">
            Campaign Goal: ${goal?.toString()}
          </p>
          <div className="relative w-full h-6 bg-gray-200 rounded-full dark:bg-gray-700">
            <div
              className="h-6 bg-blue-600 rounded-full dark:bg-blue-500 text-right"
              style={{ width: `${balancePercentage?.toString()}%` }}
            >
              <p className="text-white dark:text-white text-xs p-1">
                ${balance?.toString()}
              </p>
            </div>
            <p className="absolute top-0 right-0 text-white dark:text-white text-xs p-1">
              {balancePercentage >= 100
                ? ""
                : `${balancePercentage?.toString()}%`}
            </p>
          </div>
        </div>
      )}
      <div>
        <p className="text-lg font-semibold">Tiers:</p>
        <div>
          {isLoadingTiers ? (
            <p>Loading...</p>
          ) : tiers && tiers.length > 0 ? (
            tiers.map((tier, index) => (
              <div key={index} className="flex flex-row justify-between">
                <p>{tier.name}</p>
                <p>${tier.amount}</p>
                <p>{tier.backers} backers</p>
              </div>
            ))
          ) : (
            <p>No Tiers available</p>
          )}
        </div>
      </div>
    </div>
  );
}
