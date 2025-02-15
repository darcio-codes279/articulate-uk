"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { SettingsIcon } from "lucide-react"

interface SettingsProps {
  maxSkips: number
  onMaxSkipsChange: (value: number) => void
}

export function Settings({ maxSkips, onMaxSkipsChange }: SettingsProps) {
  const [localMaxSkips, setLocalMaxSkips] = useState(maxSkips)

  const handleSave = () => {
    onMaxSkipsChange(localMaxSkips)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <SettingsIcon className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Game Settings</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="maxSkips">Maximum Number of Skips</Label>
          <Input
            id="maxSkips"
            type="number"
            value={localMaxSkips}
            onChange={(e) => setLocalMaxSkips(Number(e.target.value))}
            min="0"
            max="10"
          />
        </div>
        <Button onClick={handleSave}>Save Settings</Button>
      </DialogContent>
    </Dialog>
  )
}

