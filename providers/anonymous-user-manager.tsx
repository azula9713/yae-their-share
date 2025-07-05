"use client"

import { useAnonymousUserManager } from "@/hooks/user/use-anonymous-data-migration";

export default function AnonymousUserManager() {
 useAnonymousUserManager();
  return null;
}