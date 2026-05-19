import {
  BookOpen,
  Building2,
  FileText,
  GraduationCap,
  HardDrive,
  LayoutDashboard,
  Settings,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const adminNavItems: AdminNavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Papers", href: "/papers", icon: FileText },
  { label: "Boards", href: "/boards", icon: Building2 },
  { label: "Subjects", href: "/subjects", icon: BookOpen },
  { label: "Classes", href: "/classes", icon: GraduationCap },
  { label: "Common questions", href: "/questions", icon: Zap },
  { label: "Media", href: "/media", icon: HardDrive },
  { label: "Settings", href: "/settings", icon: Settings },
];
