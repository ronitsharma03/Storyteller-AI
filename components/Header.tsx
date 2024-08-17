import Link from "next/link";
import { BookOpen, FilePen } from "lucide-react";

function Header() {
  return (
    <header className="relative p-16 text-center select-none m-auto w-full">
      <div className="w-full flex justify-center items-center">
        <Link href="/" prefetch={false}>
          <h1 className="lg:text-6xl font-black tracking-tighter text-3xl">
            Story Teller AI
          </h1>

          <div className="flex max-sm:flex-col max-sm:gap-3 justify-center items-center whitespace-nowrap space-x-5 text-3xl lg:text-5xl -left-2 top-1 -bottom-1 -right-3 md:left-3 md:top-0 md:bottom-0 md:right-3 -rotate-1 text-center bg-rose-500 max-w-4xl mt-5 p-3">
            <h2>Bringing your stories </h2>
            <p className="font-semibold">To life!</p>
          </div>
        </Link>
      </div>
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
