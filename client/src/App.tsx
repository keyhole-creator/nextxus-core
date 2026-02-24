import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AnimatedBackground from "@/components/AnimatedBackground";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Federation from "@/pages/Federation";
import Directives from "@/pages/Directives";
import KnowledgeBase from "@/pages/KnowledgeBase";
import SystemTerminal from "@/pages/SystemTerminal";
import Calibration from "@/pages/Calibration";
import Podcasts from "@/pages/Podcasts";
import Chat from "@/pages/Chat";
import Blog from "@/pages/Blog";
import CanonicalFooter from "@/components/CanonicalFooter";
import NavBar from "@/components/NavBar";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/calibration" component={Calibration} />
      <Route path="/chat" component={Chat} />
      <Route path="/directives" component={Directives} />
      <Route path="/federation" component={Federation} />
      <Route path="/knowledge" component={KnowledgeBase} />
      <Route path="/podcasts" component={Podcasts} />
      <Route path="/terminal" component={SystemTerminal} />
      <Route path="/blog" component={Blog} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AnimatedBackground />
        <Toaster />
        <NavBar />
        <Router />
        <CanonicalFooter />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
