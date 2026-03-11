'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Moon } from "lucide-react";
import { Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  return (
    <nav className="flex items-center justify-between p-4 border-b bg-background">
      <div>
        <Link href="/">
          <p className="font-semibold text-lg hover:text-primary transition-colors">Imagine It</p>
          <p className="text-sm text-muted-foreground">Imagine ur Concept!</p>
        </Link>
      </div>
      <div className="gap-2 flex">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/create">Create Page</Link>
        </Button>
        <Button variant="link" asChild>
          <a href="https://github.com/Salmanzahi/" target="_blank" rel="noopener noreferrer">
            My Github
          </a>
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          {theme === 'light' ? <Moon /> : <Sun />}
        </Button>
      </div>
    </nav>
  );
}
