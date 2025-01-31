import { API_PROJECT_ROUTE } from "@/lib/const/project";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen p-8">
      <ul className={'flex flex-row gap-3'}>
        <li key="projects-all">
          <Link className="text-blue-400" href={`/${API_PROJECT_ROUTE}`}>Projects</Link>
        </li>
        <li key="search">
          <Link className="text-blue-400" href={`/${API_PROJECT_ROUTE}/search`}>Search</Link>
        </li>
        <li key="generate">
          <Link className="text-blue-400" href={`/${API_PROJECT_ROUTE}/generate`}>Generate</Link>
        </li>
      </ul>
    </div>
  );
}
