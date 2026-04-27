"use client";

import { Button } from "@/components/ui/button";
import { Twitter, Facebook, Link as LinkIcon, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SocialShareProps {
  url: string;
  title: string;
}

export function SocialShare({ url, title }: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.href : url;
  const shareTitle = title;

  const shareLinks = [
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
      color: "hover:bg-sky-500 hover:text-white",
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: "hover:bg-blue-600 hover:text-white",
    },
    {
      name: "WhatsApp",
      icon: LinkIcon,
      url: `https://wa.me/?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}`,
      color: "hover:bg-green-500 hover:text-white",
    },
  ];

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground mr-1">Share:</span>
      {shareLinks.map((link) => {
        const Icon = link.icon;
        return (
          <Button
            key={link.name}
            variant="outline"
            size="icon"
            className={`h-8 w-8 transition-all duration-300 hover:scale-110 ${link.color}`}
            onClick={() => window.open(link.url, "_blank", "width=600,height=400")}
          >
            <Icon className="h-4 w-4" />
          </Button>
        );
      })}
      <Button
        variant="outline"
        size="icon"
        className={`h-8 w-8 transition-all duration-300 hover:scale-110 ${
          copied ? "bg-green-500 text-white" : "hover:bg-violet-500 hover:text-white"
        }`}
        onClick={copyLink}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
}
