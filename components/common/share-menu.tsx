import { Copy, Mail, MessageCircle, Share2, Smartphone } from "lucide-react";

import useSplit from "@/hooks/split/use-split";
import { ISplit } from "@/types/split.types";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type Props = {
  splitId: string;
  setShowCopyAlert: (show: boolean) => void;
};

export default function ShareMenu({ splitId, setShowCopyAlert }: Props) {
  const { split } = useSplit({ splitId });

  const handleCopyUrl = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      setShowCopyAlert(true);
      setTimeout(() => setShowCopyAlert(false), 3000);
    } catch (error) {
      console.error("Failed to copy URL:", error);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setShowCopyAlert(true);
      setTimeout(() => setShowCopyAlert(false), 3000);
    }
  };

  const handleShare = async (platform: string, split: ISplit) => {
    if (!split) return;

    const url = window.location.href;
    const text = `Check out our expense split for "${split.name}" on Their Share`;
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(url);

    let shareUrl = "";
    switch (platform) {
      case "email":
        shareUrl = `mailto:?subject=${encodedText}&body=Join our expense group: ${encodedUrl}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodedText} ${encodedUrl}`;
        break;
      case "x":
        shareUrl = `https://x.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "sms":
        shareUrl = `sms:?body=${encodedText} ${encodedUrl}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  if (!split) {
    return null; // or a loading state
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="size-4" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleCopyUrl} className="gap-2">
          <Copy className="size-4" />
          Copy URL
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => handleShare("email", split)}
          className="gap-2"
        >
          <Mail className="size-4" />
          Email
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleShare("whatsapp", split)}
          className="gap-2"
        >
          <MessageCircle className="size-4" />
          WhatsApp
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleShare("sms", split)}
          className="gap-2"
        >
          <Smartphone className="size-4" />
          Text Message
        </DropdownMenuItem>

        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
