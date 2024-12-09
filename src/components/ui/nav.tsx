import { LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import { buttonVariants } from "../ui/button";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { NavLink } from "react-router-dom";

interface NavProps {
  links: {
    title: string;
    label?: string;
    icon: LucideIcon;
    variant: "default" | "ghost";
    href: string;
  }[];
  onLinkClick?: () => void; // New prop for link click callback
}

export function Nav({ links, onLinkClick }: NavProps) {
  return (
    <TooltipProvider>
      <div className="group flex flex-col gap-4 py-8 ">
        <nav className="grid gap-1">
          {links.map((link, index) => (
            <NavLink
              key={index}
              to={link.href}
              className={({ isActive }) =>
                cn(
                  "text-white",
                  buttonVariants({
                    variant: isActive ? "default" : "ghost",
                    size: "sm",
                  }),
                  link.variant === "default" &&
                    "dark:bg-muted dark:hover:bg-muted",
                  "justify-start"
                )
              }
              onClick={onLinkClick} // Trigger the onLinkClick callback
            >
              <link.icon className="mr-2 h-4 w-4" />
              {link.title}
              {link.label && (
                <span
                  className={cn(
                    "ml-auto",
                    link.variant === "default" && "text-background "
                  )}
                >
                  {link.label}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </TooltipProvider>
  );
}
