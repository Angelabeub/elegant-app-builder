import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import Stocks from "./pages/Stocks";
import Ventes from "./pages/Ventes";
import Marges from "./pages/Marges";
import Credits from "./pages/Credits";
import Depenses from "./pages/Depenses";
import Achats from "./pages/Achats";
import Casiers from "./pages/Casiers";
import Personnel from "./pages/Personnel";
import Partenaires from "./pages/Partenaires";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/stocks" element={<AppLayout><Stocks /></AppLayout>} />
          <Route path="/ventes" element={<AppLayout><Ventes /></AppLayout>} />
          <Route path="/marges" element={<AppLayout><Marges /></AppLayout>} />
          <Route path="/credits" element={<AppLayout><Credits /></AppLayout>} />
          <Route path="/depenses" element={<AppLayout><Depenses /></AppLayout>} />
          <Route path="/achats" element={<AppLayout><Achats /></AppLayout>} />
          <Route path="/casiers" element={<AppLayout><Casiers /></AppLayout>} />
          <Route path="/personnel" element={<AppLayout><Personnel /></AppLayout>} />
          <Route path="/partenaires" element={<AppLayout><Partenaires /></AppLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
