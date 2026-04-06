import { ReactNode } from "react";

const MobileFrame = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-forest/10 via-sage-light to-peach/30">
      {/* Decorative blobs for desktop background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden hidden md:block">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-sage/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-peach/30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* Phone shell */}
      <div className="relative mx-auto w-full max-w-[430px] md:my-8">
        {/* Phone bezel on desktop */}
        <div className="md:rounded-[3rem] md:border md:border-foreground/10 md:bg-foreground/5 md:p-3 md:shadow-2xl md:shadow-foreground/10">
          <div className="md:rounded-[2.25rem] md:overflow-hidden md:shadow-inner relative">
            {/* Notch */}
            <div className="pointer-events-none absolute top-0 left-1/2 z-50 hidden -translate-x-1/2 md:block">
              <div className="h-7 w-32 rounded-b-2xl bg-foreground/90" />
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileFrame;
