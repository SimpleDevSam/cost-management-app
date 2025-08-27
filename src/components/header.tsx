import { AlignJustify } from "lucide-react";

interface HeaderProps {
  companyName: string;
}

export function Header({ companyName }: HeaderProps) {
  return (
    <header className="w-full p-4 border-b bg-background text-gray-900">
      <div className="flex flex-row justify-center items-center gap-2">
        <AlignJustify />
        <h1 className="text-lg  font-bold text-center">{companyName} App</h1>
      </div>
    </header>
  );
}