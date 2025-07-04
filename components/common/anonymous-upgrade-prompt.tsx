"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { Sparkles, User } from "lucide-react";
import { useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetCurrentUser } from "@/hooks/user/use-user";

interface AnonymousUpgradePromptProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  feature?: string;
}

export function AnonymousUpgradePrompt({
  isOpen,
  onClose,
  title = "Save Your Data Permanently",
  description = "Sign in to sync your data across devices and never lose your expense splits.",
  feature,
}: AnonymousUpgradePromptProps) {
  const { signIn } = useAuthActions();
  const { data: user } = useGetCurrentUser();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google");
      onClose();
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user?.isAnonymous) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
            {feature && (
              <span className="block mt-2 text-sm font-medium">
                🔒 {feature} requires a permanent account
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <User className="size-4" />
            <AlertDescription>
              You currently have a <strong>temporary session</strong>. Your data will be lost when you clear your browser data.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <Button
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="size-4 border-2 border-current border-t-transparent animate-spin rounded-full"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                <>
                  <svg className="size-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={onClose}>
              Continue with temporary session
            </Button>
          </div>

          <div className="text-xs text-center text-muted-foreground space-y-1">
            <p>✅ Your existing data will be automatically migrated when you sign in</p>
            <p>💾 Signed-in users get automatic backup and sync across devices</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Simplified hook for managing upgrade prompts
export function useAnonymousUpgradePrompt() {
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
