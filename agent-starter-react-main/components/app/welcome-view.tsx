import { Button } from '@/components/livekit/button';

function MarketAnalysisIcon() {
  return (
    <div className="relative mb-8">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 text-indigo-500 dark:text-purple-400"
      >
        <rect width="80" height="80" rx="20" fill="currentColor" fillOpacity="0.1"/>
        <path d="M20 50L30 40L40 50L60 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="30" cy="40" r="3" fill="currentColor"/>
        <circle cx="40" cy="50" r="3" fill="currentColor"/>
        <circle cx="60" cy="30" r="3" fill="currentColor"/>
        <path d="M15 20h50v3H15z" fill="currentColor" fillOpacity="0.6"/>
        <path d="M15 60h50v3H15z" fill="currentColor" fillOpacity="0.6"/>
        <path d="M25 25v30M35 30v25M45 35v20M55 25v30" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4"/>
      </svg>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}

interface WelcomeViewProps {
  startButtonText: string;
  onStartCall: () => void;
}

export const WelcomeView = ({
  startButtonText,
  onStartCall,
  ref,
}: React.ComponentProps<'div'> & WelcomeViewProps) => {
  return (
    <div ref={ref} className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-20">
        <section className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
          <MarketAnalysisIcon />
          
          <p className="text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed">
            Advanced AI-powered market intelligence platform. Get real-time insights, 
            predictive analytics, and strategic recommendations through natural conversation.
          </p>

          <Button 
            variant="primary" 
            size="lg" 
            onClick={onStartCall} 
            className="mb-16 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            {startButtonText}
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
            <div className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="flex justify-center mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Real-time Analytics</h3>
              <p className="text-muted-foreground text-sm">Live market data analysis with instant insights and trend identification</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="flex justify-center mb-4">
                <svg className="w-8 h-8 text-chart-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Predictive Modeling</h3>
              <p className="text-muted-foreground text-sm">AI-driven forecasts and predictive analytics for strategic planning</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="flex justify-center mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Natural Conversation</h3>
              <p className="text-muted-foreground text-sm">Interact with complex data through simple, natural language queries</p>
            </div>
          </div>
        </section>
      </div>

      <div className="fixed bottom-5 left-0 flex w-full items-center justify-center">
        <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg px-6 py-3">
          <p className="text-muted-foreground text-sm text-center">
            Powered by advanced AI technology for intelligent market analysis
          </p>
        </div>
      </div>
    </div>
  );
};
