import { Navbar } from "@/components/nav/Navbar";
import { AwakeningCountdown } from "@/components/home/AwakeningCountdown";
import { CircleProvider } from "@/components/circle/CircleProvider";

/** The home screen is one thing now: the countdown to the Yazhi Awakening.
    The bar stays for About, Services and Contact. */
export default function Home() {
  return (
    <CircleProvider>
      <Navbar />
      <AwakeningCountdown />
    </CircleProvider>
  );
}
