interface PotBarProps {
  pot: number;
}

export default function PotBar({ pot }: PotBarProps) {
  return (
    <div className="bg-gray-200 p-4 text-center text-xl font-bold">
      Pot: ${pot}
    </div>
  );
}