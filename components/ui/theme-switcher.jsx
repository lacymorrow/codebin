"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu"
import { Button } from "./button"

export function ThemeSwitcher() {
  const { setTheme } = useTheme()

  return (
    <>
      <Button className="dark:flex hidden" variant="outline" size="icon" onClick={() => setTheme('light')}><Sun className="h-4 w-4" /></Button>
      <Button className="flex dark:hidden" variant="outline" size="icon" onClick={() => setTheme('dark')}><Moon className="h-4 w-4" /></Button>
    </>
  )
}
