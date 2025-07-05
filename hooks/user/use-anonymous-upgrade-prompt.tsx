import { useState } from "react";
import { useGetCurrentUser } from "./use-user";

export default function useAnonymousUpgradePrompt() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: user } = useGetCurrentUser();

  const showPrompt = () => {
    if (user?.isAnonymous) {
      setIsOpen(true);
    }
  };

  return {
    isOpen,
    showPrompt,
    hidePrompt: () => setIsOpen(false),
    isAnonymous: user?.isAnonymous || false,
  };
}
