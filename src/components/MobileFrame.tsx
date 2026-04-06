import { ReactNode } from "react";

const MobileFrame = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-transparent md:bg-gradient-to-br md:from-forest/10 md:via-sage-light md:to-peach/30 transition-colors duration-500">
      {/* Decorative blobs for desktop background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden hidden md:block z-[-1]">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-sage/20 blur-3xl opacity-50 animate-float-slow" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-peach/30 blur-3xl opacity-50 animate-float" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl animate-breathe" />
      </div>

      {/* Phone shell */}
      <div className="relative mx-auto w-full h-[100dvh] md:h-auto md:max-w-[400px] lg:max-w-[430px] md:my-8 flex flex-col">
        {/* Phone bezel on desktop */}
        <div className="flex-1 md:flex-none md:h-[850px] md:rounded-[3rem] md:border-8 md:border-black/90 md:bg-black md:shadow-2xl md:shadow-foreground/20 md:overflow-hidden relative flex flex-col transition-all duration-300">
          <div className="flex-1 bg-background md:rounded-[2.25rem] overflow-hidden relative flex flex-col pt-safe pb-safe">
            {/* Notch */}
            <div className="pointer-events-none absolute top-0 left-1/2 z-50 hidden -translate-x-1/2 md:block">
              <div className="h-7 w-36 rounded-b-3xl bg-black flex items-center justify-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
                <div className="h-1.5 w-12 rounded-full bg-white/10" />
              </div>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileFrame;
