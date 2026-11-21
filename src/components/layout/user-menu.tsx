"use client";

import Link from "next/link";
import { LayoutDashboardIcon, LogOutIcon, UserCogIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type NavUser = {
  name: string;
  email: string;
  image?: string | null;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function UserAvatar({ user, className }: { user: NavUser; className?: string }) {
  return (
    <Avatar className={className}>
      {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
      <AvatarFallback className="bg-accent font-medium text-primary">
        {getInitials(user.name)}
      </AvatarFallback>
    </Avatar>
  );
}

export function UserMenu({ user }: { user: NavUser }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-lg"
          aria-label="Open profile menu"
          className="size-10 rounded-full p-0"
        >
          <UserAvatar user={user} className="size-9" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-64 p-1.5">
        <DropdownMenuLabel className="flex items-center gap-3 px-2 py-2 font-normal">
          <UserAvatar user={user} className="size-10" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {user.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="px-2 py-2">
            <Link href="/dashboard">
              <LayoutDashboardIcon />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="px-2 py-2">
            <Link href="/dashboard/profile">
              <UserCogIcon />
              Profile settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" className="px-2 py-2">
          <LogOutIcon />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
