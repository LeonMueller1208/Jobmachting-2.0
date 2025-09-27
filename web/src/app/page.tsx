import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <main className="mx-auto max-w-4xl px-6 py-16 grid gap-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Job-Matching</h1>
          <p className="mt-4 text-lg text-gray-600">Finde den perfekten Job oder den idealen Kandidaten</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <Link href="/applicant/choose" className="group rounded-xl border-2 border-gray-200 p-8 hover:border-blue-300 hover:shadow-lg transition-all duration-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Job suchen</h2>
              <p className="text-gray-600">Als Bewerber passende Stellen finden und sich bewerben</p>
            </div>
          </Link>
          
          <Link href="/company/choose" className="group rounded-xl border-2 border-gray-200 p-8 hover:border-green-300 hover:shadow-lg transition-all duration-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Stellen anbieten</h2>
              <p className="text-gray-600">Als Unternehmen Talente finden und Stellen ausschreiben</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
