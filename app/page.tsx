import Image from "next/image";
import Logo from "../images/logo3.png"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import StoryWriter from "@/components/StoryWriter";


export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        <div className="bg-rose-400 flex flex-col space-y-5 justify-center items-center order-1 lg:-order-1 pb-20">
          <Image src={Logo} height={320} alt="logo" />
          <Button asChild className="px-18 p-6 text-lg"><Link className=" text-black" href="/stories">Explore Story Library </Link></Button>
        </div>

        <StoryWriter />
      </section>
    </main>
  );
}
