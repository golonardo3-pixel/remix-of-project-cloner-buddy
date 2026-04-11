import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import CrmLeads from "./pages/CrmLeads.tsx";
import LeadSite from "./pages/LeadSite.tsx";
import LeadSiteConversion from "./pages/LeadSiteConversion.tsx";
import SiteEditor from "./pages/SiteEditor.tsx";
import MessageDispatch from "./pages/MessageDispatch.tsx";
import LeadMining from "./pages/LeadMining.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/crm" element={<CrmLeads />} />
          <Route path="/site/:slug" element={<LeadSite />} />
          <Route path="/site/:slug/conversao" element={<LeadSiteConversion />} />
          <Route path="/crm/editor/:id" element={<SiteEditor />} />
          <Route path="/crm/disparo" element={<MessageDispatch />} />
          <Route path="/crm/mineracao" element={<LeadMining />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
