
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-base-300 bg-base-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm sm:px-6 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="font-bold text-base-content">
          বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </Link>

        <p className="text-base-content/60 md:max-w-lg md:text-right">
          সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </p>
      </div>
    </footer>
  );
}
