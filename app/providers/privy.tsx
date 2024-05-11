"use client";

import {PrivyProvider} from "@privy-io/react-auth";

export default function Providers({children}: {children: React.ReactNode}) {
  return (
    <PrivyProvider
      appId="clvw2d7im07ogm8x3x5zy9iag"
      config={{
        // Customize Privy's appearance in your app
        appearance: {
          theme: "light",
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
