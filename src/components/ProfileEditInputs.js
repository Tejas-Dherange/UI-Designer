import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

export default function ProfileEditInputs({
  id,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div className="grid gap-3">
      <Label htmlFor={id}>{id.charAt(0).toUpperCase() + id.slice(1)}</Label>
      <Input
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}
