"use client";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function ToggleButton({ isChecked, setIsChecked, name }) {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="toggle-button"
        checked={isChecked}
        onCheckedChange={() => setIsChecked((prev) => !prev)}
      />
      <Label htmlFor="toggle-button" className="text-sm font-medium">
        {name}
      </Label>
    </div>
  );
}
