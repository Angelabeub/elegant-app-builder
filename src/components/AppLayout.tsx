import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FileText,
  TrendingUp,
  CreditCard,
  Wallet,
  ShoppingCart,
  Box,
  Users,
  Building2,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { to: "/", label: "Tableau de Bord", icon: LayoutDashboard },
  { to: "/stocks", label: "Stocks", icon: Package },
  { to: "/ventes", label: "Fiche Journalière", icon: FileText },
  { to: "/marges", label: "Marges", icon: TrendingUp },
  { to: "/credits", label: "Crédits Clients", icon: CreditCard },
  { to: "/depenses", label: "Dépenses", icon: Wallet },
  { to: "/achats", label: "Achats", icon: ShoppingCart },
  { to: "/casiers", label: "Casiers", icon: Box },
  { to: "/personnel", label: "Personnel", icon: Users },
  { to: "/partenaires", label: "Partenaires & Taxes", icon: Building2 },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const currentPage = navItems.find((item) => item.to === location.pathname);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-foreground/20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between border-b border-border px-5 py-5">
            <div>
              <h1 className="text-lg font-bold font-heading tracking-tight text-foreground">
                DÉPÔT ORIENTAL
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-0.5">
                Distribution de Boissons
              </p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-muted-foreground hover:text-foreground"
            >
              <X size={18} />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <div className="space-y-0.5">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`
                  }
                  end={item.to === "/"}
                >
                  <item.icon size={16} strokeWidth={1.8} />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t border-border px-5 py-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
              © 2026 Dépôt Oriental
            </p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-4 border-b border-border bg-card px-4 py-3 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 text-muted-foreground hover:text-foreground lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="hidden sm:inline">Dépôt Oriental</span>
            {currentPage && (
              <>
                <ChevronRight size={14} />
                <span className="font-medium text-foreground">{currentPage.label}</span>
              </>
            )}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString("fr-FR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
