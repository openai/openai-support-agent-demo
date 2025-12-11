import useCustomerStore from "@/stores/useDataStore";

function DetailItem({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-sm text-zinc-500 w-40">{label}</span>
      <span className={`text-sm ${className}`}>{value}</span>
    </div>
  );
}

export default function CustomerDetails() {
  const { customerDetails } = useCustomerStore();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <DetailItem label="Name" value={customerDetails.name} />
        <DetailItem
          label="ID"
          value={customerDetails.id}
          className="font-mono text-xs"
        />
        <DetailItem label="Email" value={customerDetails.email} />
        <DetailItem label="Phone" value={customerDetails.phone} />
        <DetailItem label="Address" value={customerDetails.address} />
        <DetailItem
          label="# Orders"
          value={customerDetails.orderNb.toString()}
        />
        <DetailItem
          label="Signup Date"
          value={customerDetails.signupDate.toString()}
        />
      </div>
    </div>
  );
}
