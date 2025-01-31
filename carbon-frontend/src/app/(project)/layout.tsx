import Link from "next/link"

export default function ProjectLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
        <main>
            <div className="flex flex-col items-center justify-items-center min-h-screen p-8">
                <Link href={'/'} className="text-blue-400">Back</Link>
                <div>
                    {children}
                </div>
            </div>
        </main>
    )
  }
  