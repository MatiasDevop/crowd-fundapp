import { prepareContractCall, ThirdwebContract } from "thirdweb";
import { TransactionButton } from "thirdweb/react";

type Tier = {
  name: string;
  amount: bigint;
  backers: bigint;
};

type TierCardProps = {
  tier: Tier;
  index: number;
  contract: ThirdwebContract;
};

export default function TierCard({ tier, index, contract }: TierCardProps) {
  return (
    <div className="max-w-sm flex flex-col justify-between p-6 bg-white rounded-lg shadow border border-slate-100">
      <div>
        <div className="flex flex-row justify-between items-center">
          <p className="text-2xl font-semibold">{tier.name}</p>
          <p className="text-2xl font-semibold">${tier.amount.toString()}</p>
        </div>
      </div>
      <div className="flex flex-row justify-between items-end">
        <p className="text-xs font-semibold">
          {" "}
          Total Backers: {tier.backers.toString()}
        </p>
        <TransactionButton
          transaction={() =>
            prepareContractCall({
              contract,
              method: "function fund(uint256 _tierIndex) payable",
              params: [BigInt(index)],
              value: tier.amount,
            })
          }
          onTransactionConfirmed={async () => alert("Funded Successfully")}
          style={{
            marginTop: "1rem",
            backgroundColor: "#2563EB",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "0.375rem",
            cursor: "pointer",
          }}
        >
          Select
        </TransactionButton>
      </div>
    </div>
  );
}
