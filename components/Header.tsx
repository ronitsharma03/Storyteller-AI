import Link from "next/link";
import { BookOpen, FilePen } from "lucide-react";

function Header() {
  return (
    <header className="relative p-16 text-center select-none">
      <Link href="/" prefetch={false}>
        <h1 className="text-6xl font-black tracking-tighter ">
          Story Teller AI
        </h1>
        <div className="flex justify-center items-center whitespace-nowrap space-x-5 text-3xl lg:text-5xl">
          <h2>Bringing your stories </h2>
          <div className="relative">
            <div className="bg-rose-400 -left-2 top-1 -bottom-1 -right-2 md:left-3 md:top-0 md:bottom-0 md:right-3 -rotate-1 text-center">
              <p className="relative text-white text-4xl p-1">To life!</p>
            </div>
          </div>
        </div>
      </Link>

      <div className="absolute -top-5 right-5 flex space-x-2">
        <Link href="/">
          <FilePen className="w-8 h-8 lg:w-10 lg:h-10 mx-auto text-rose-500 mt-10 p-2 rounded-md hover:opacity-70 cursor-pointer" />
        </Link>

        <Link href="/stories">
          <BookOpen className="w-8 h-8 lg:w-10 lg:h-10 mx-auto text-rose-500 mt-10 p-2 rounded-md hover:opacity-70 cursor-pointer" />
        </Link>
      </div>
    </header>
  );
}

export default Header;
