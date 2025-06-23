import { Navbar } from "../components/navbar"

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Finans Takip Uygulamasına Hoş Geldin</h1>
        <a
          href="/login"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Giriş Yap
        </a>
      </main>
    </>
  );
}

