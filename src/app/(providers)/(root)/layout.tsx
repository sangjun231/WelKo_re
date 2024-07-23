import { PropsWithChildren } from "react";

function RootLayout({ children }: PropsWithChildren) {
  return (
    <div id="root" className="flex flex-col max-w-[1440px] sm:max-w-[] min-h-screen mx-auto">
      <div className="flex flex-1 gap-4">
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default RootLayout;