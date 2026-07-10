import type { Metadata } from "next";

import { MinecraftScroll } from "./minecraft-scroll";

export const metadata: Metadata = {
  title: "Minecraft Survival - Build. Explore. Belong. | bits&bytes™",
  description:
    "A Minecraft world worth returning to. Java and Bedrock crossplay survival from bits&bytes™. Join at mc.gobitsnbytes.org.",
  keywords: [
    "bits&bytes minecraft",
    "minecraft survival server",
    "java bedrock crossplay",
    "minecraft community server",
    "mc.gobitsnbytes.org",
  ],
  alternates: {
    canonical: "https://gobitsnbytes.org/minecraft",
  },
  openGraph: {
    title: "Minecraft Survival - Build. Explore. Belong. | bits&bytes™",
    description:
      "A Minecraft world worth returning to. Java and Bedrock crossplay survival from bits&bytes™.",
    url: "https://gobitsnbytes.org/minecraft",
    type: "website",
  },
};

const SERVER_IP = "mc.gobitsnbytes.org";

export default function MinecraftPage() {
  return <MinecraftScroll serverIp={SERVER_IP} />;
}
