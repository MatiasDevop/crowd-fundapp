"use client";
import { client } from "@/app/client";
import CampaignCard from "@/app/components/CampaignCard";
import { CROWDFUNDING_FACTORY } from "@/app/constants/contracts";
import { useState } from "react";
import { getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { deployPublishedContract } from "thirdweb/deploys";
import { useActiveAccount, useReadContract } from "thirdweb/react";

export default function DashboardPage() {
  const account = useActiveAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const contract = getContract({
    client: client,
    chain: baseSepolia,
    address: CROWDFUNDING_FACTORY,
  });

  const { data, isLoading } = useReadContract({
    contract,
    method:
      "function getUserCampaigns(address _user) view returns ((address campaignAddress, address owner, string name, uint256 creationTime)[])",
    params: [account?.address as string],
  });

  return (
    <div className="max-w-7xl mx-auto px-4 mt-16 sm:px-6 lg:px-8">
      <div className="flex flex-row justify-between items-center mb-8">
        <p className="text-4xl font-semibold">Dashboard</p>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={() => setIsModalOpen(true)}
        >
          Create Campaign
        </button>
      </div>
      <p className="text-2xl font-semibold mb-4">My campaigns</p>
      <div className="grid grid-cols-3 gap-3">
        {!isLoading &&
          data &&
          (data && data.length > 0 ? (
            data.map((campaign, index) => (
              <CampaignCard
                key={index}
                campaignAddress={campaign.campaignAddress}
              />
            ))
          ) : (
            <p>No campaigns found</p>
          ))}
      </div>
      {isModalOpen && <CreateCampaignModal setIsModalOpen={setIsModalOpen} />}
    </div>
  );
}

type CreateCampaignModalProps = {
  setIsModalOpen: (value: boolean) => void;
};

const CreateCampaignModal = ({ setIsModalOpen }: CreateCampaignModalProps) => {
  const account = useActiveAccount();
  const [campaignName, setCampaignName] = useState<string>("");
  const [campaignDescription, setCampaignDescription] = useState<string>("");
  const [campaignGoal, setCampaignGoal] = useState<number>(1);
  const [campaignDeadline, setCampaignDeadline] = useState<number>(1);
  const [isDeployingContract, setIsDeployingContract] =
    useState<boolean>(false);

  const handleDewployContract = async () => {
    setIsDeployingContract(true);
    try {
      // deploy the contract
      console.log("deploying contract...", account);
      const contractAddress = await deployPublishedContract({
        client: client,
        chain: baseSepolia,
        account: account!,
        contractId: "CrowdfundingFactory",
        contractParams: {
          campaignName: campaignName,
          campaignDescription: campaignDescription,
          campaignGoal: campaignGoal,
          campaignDeadline: campaignDeadline,
        },
        publisher: "0x5C7E546f8F6877cC44C5Db93ecD17590a80CA499",
        version: "1.0.1",
      });
      alert(`Campaign created successfully`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeployingContract(false);
      setIsModalOpen(false);
    }
  };

  const handleCampaignGoal = (value: number) => {
    if (value < 1) {
      setCampaignGoal(1);
    } else {
      setCampaignGoal(value);
    }
  };

  const handleCampaignLength = (value: number) => {
    if (value < 1) {
      setCampaignDeadline(1);
    } else {
      setCampaignDeadline(value);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center backdrop-blur-md">
      <div className="w-1/2 bg-slate-100 p-6 rounded-md">
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-semibold">Create a Campaign</p>
          <button
            className="text-sm px-4 py-2 bg-slate-600 text-white rounded-md"
            onClick={() => setIsModalOpen(false)}
          >
            Close
          </button>
        </div>
        <div className="flex flex-col">
          <label>Campaign Name:</label>
          <input
            type="text"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            placeholder="Campaign Name"
            className="mb-4 px-4 py-2 bg-slate-200 rounded-md"
          />
          <label>Campaign Description:</label>
          <textarea
            value={campaignDescription}
            onChange={(e) => setCampaignDescription(e.target.value)}
            placeholder="Campaign Description"
            className="mb-4 px-4 py-2 bg-slate-200 rounded-md"
          />
          <label>Campaign Goal:</label>
          <input
            type="number"
            value={campaignGoal}
            onChange={(e) => handleCampaignGoal(parseInt(e.target.value))}
            placeholder="Campaign Goal"
            className="mb-4 px-4 py-2 bg-slate-200 rounded-md"
          />
          <label>{`Campaign Length (Days)`}</label>
          <input
            type="number"
            value={campaignDeadline}
            onChange={(e) => handleCampaignLength(parseInt(e.target.value))}
            placeholder="Campaign Deadline"
            className="mb-4 px-4 py-2 bg-slate-200 rounded-md"
          />
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={handleDewployContract}
            disabled={isDeployingContract}
          >
            {isDeployingContract ? "Creating campaign..." : "Create Campaign"}
          </button>
        </div>
      </div>
    </div>
  );
};
