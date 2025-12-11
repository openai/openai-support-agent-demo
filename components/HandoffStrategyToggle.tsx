import useHandoffStrategy from "@/stores/useHandoffStrategy";

const HandoffStrategyToggle = () => {
  const { value, setStrategy } = useHandoffStrategy();

  return (
    <div className="flex items-center gap-2">
      <span>Handoff Strategy:</span>
      <select
        className="border rounded px-2 py-1"
        value={value}
        onChange={(e) => setStrategy(e.target.value as "confirm" | "auto")}
      >
        <option value="confirm">Confirm</option>
        <option value="auto">Auto</option>
      </select>
    </div>
  );
};

export default HandoffStrategyToggle;
