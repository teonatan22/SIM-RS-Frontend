import Link from "next/link";

const actors = [
  { name: "Pasien & Keluarga", description: "Portal lansia, caregiver, dan keluarga untuk jadwal dan kontrol." },
  { name: "Customer Service", description: "Aktivasi akun, panduan registrasi, verifikasi dokumen pasien." },
  { name: "Dokter & Perawat", description: "Dashboard jadwal, triase IGD, perencanaan perawatan pasien lansia." },
  { name: "Petugas IGD & Ambulans", description: "Pencatatan kasus gawat darurat, status triase, koordinasi ambulans." },
  { name: "Admin Rumah Sakit", description: "Monitoring kamar, antrian, KPI layanan, dan integrasi antar unit." },
  { name: "Farmasi & Laboratorium", description: "Integrasi resep, permintaan lab, dan tracking hasil pemeriksaan." },
  { name: "Keuangan & Asuransi", description: "Verifikasi kepesertaan, approval klaim, dan status pembayaran." },
  { name: "Petugas Kebersihan & Keamanan", description: "Penjadwalan kebersihan kamar, eskalasi keamanan, dan laporan fasilitas." },
];

const steps = [
  {
    title: "1. Isi Data Diri",
    detail: "Lengkapi formulir online dengan tulisan besar dan panduan visual yang nyaman bagi pengguna lansia.",
  },
  {
    title: "2. Buat Akun",
    detail: "Akun dibuat secara instan tanpa OTP atau email; keluarga pendamping dapat membantu proses ini.",
  },
  {
    title: "3. Pantau Layanan",
    detail: "Lihat jadwal kontrol, antrian IGD, ketersediaan kamar, dan komunikasi dengan petugas.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
          <span className="text-3xl font-semibold text-primary-700">SIM-RS+</span>
          <nav className="flex gap-6 text-lg">
            <Link href="/auth/login" className="text-primary-700 hover:underline focus-elevated rounded-md px-2 py-1">
              Masuk
            </Link>
            <Link href="/auth/register" className="text-primary-700 hover:underline focus-elevated rounded-md px-2 py-1">
              Aktivasi Akun
            </Link>
            <Link
              href="/igd"
              className="rounded-full bg-accent-500 px-5 py-2 text-lg font-semibold text-white shadow-md focus-elevated"
            >
              IGD 24 Jam
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-12">
        <section className="grid gap-10 rounded-3xl bg-white p-10 shadow-comfort lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <span className="rounded-full bg-primary-100 px-4 py-2 text-primary-700">Sistem Informasi Rumah Sakit</span>
            <h1 className="text-4xl font-bold leading-snug text-elderText md:text-5xl">
              Pelayanan modern dengan sentuhan humanis untuk pasien lansia dan keluarga mereka.
            </h1>
            <p>
              SIM-RS+ menghadirkan pendaftaran, IGD, dan manajemen kamar dalam satu portal. Navigasi sederhana, font
              besar, dan kontras tinggi memastikan kenyamanan pengguna senior.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/auth/login"
                className="rounded-full bg-primary-500 px-6 py-3 text-xl font-semibold text-white shadow-lg focus-elevated"
              >
                Masuk Portal Pasien
              </Link>
              <Link
                href="/rooms"
                className="rounded-full border-2 border-primary-300 px-6 py-3 text-xl font-semibold text-primary-700 focus-elevated"
              >
                Cek Ketersediaan Kamar
              </Link>
            </div>
          </div>
          <div className="grid gap-4 rounded-3xl bg-calm p-8 text-lg">
            <h2 className="text-2xl font-semibold text-primary-700">Highlight Sistem</h2>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="mt-1 h-3 w-3 rounded-full bg-primary-500" />
                <p>Registrasi mudah langsung di portal atau dibantu customer service tanpa proses OTP.</p>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-3 w-3 rounded-full bg-primary-500" />
                <p>Integrasi IGD, triase lansia, ambulance tracking, hingga alokasi kamar real-time.</p>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-3 w-3 rounded-full bg-primary-500" />
                <p>Monitoring aktor rumah sakit: medis, penunjang, keuangan, keamanan, dan kebersihan.</p>
              </li>
            </ul>
          </div>
        </section>

        <section className="grid gap-6">
          <h2 className="text-3xl font-semibold text-elderText">Seluruh Aktor dalam Jejaring Rumah Sakit</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {actors.map((actor) => (
              <article key={actor.name} className="bg-comfort p-6 text-lg">
                <h3 className="text-2xl font-semibold text-primary-700">{actor.name}</h3>
                <p className="mt-2 text-lg">{actor.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-8 rounded-3xl bg-white p-10 shadow-comfort lg:grid-cols-[1fr,1fr]">
          <div>
            <h2 className="text-3xl font-semibold text-elderText">Alur Registrasi Ramah Lansia</h2>
            <p className="mt-4 text-lg">
              Formulir besar, navigasi sederhana, dan dukungan audio visual membantu pasien senior menyelesaikan
              pendaftaran mandiri maupun didampingi keluarga.
            </p>
          </div>
          <ol className="space-y-4 text-lg">
            {steps.map((step) => (
              <li key={step.title} className="rounded-2xl border border-primary-100 bg-calm p-5 shadow-sm">
                <h3 className="text-xl font-semibold text-primary-700">{step.title}</h3>
                <p className="mt-2 text-lg">{step.detail}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="grid gap-6 rounded-3xl bg-primary-700 p-10 text-white lg:grid-cols-[2fr,1fr]">
          <div className="space-y-4 text-lg">
            <h2 className="text-3xl font-semibold">IGD & Tanggap Darurat</h2>
            <p>
              Triase cepat dengan indikator warna, prioritas lansia, dan informasi alat bantu medis. Petugas IGD dan
              ambulans mendapatkan pembaruan real-time.
            </p>
            <ul className="space-y-2 pl-5 text-lg">
              <li className="list-disc">Pemantauan kedatangan ambulans & komunikasi lintas unit.</li>
              <li className="list-disc">Profil pasien lengkap: alergi, riwayat obat, kontak darurat keluarga.</li>
              <li className="list-disc">Analitik beban IGD dan dashboard eskalasi.</li>
            </ul>
          </div>
          <div className="flex flex-col gap-3 rounded-3xl bg-white/10 p-6 text-lg">
            <span className="text-xl font-semibold">Kontak Darurat</span>
            <p className="text-2xl font-bold">Hotline IGD: 021-1234-911</p>
            <Link
              href="/igd"
              className="rounded-full bg-white px-4 py-3 text-center text-lg font-semibold text-primary-700 focus-elevated"
            >
              Laporkan Kedatangan IGD
            </Link>
          </div>
        </section>

        <section className="grid gap-6 rounded-3xl bg-white p-10 shadow-comfort">
          <h2 className="text-3xl font-semibold text-elderText">Integrasi Sistem</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <article className="bg-calm p-6">
              <h3 className="text-xl font-semibold text-primary-700">Backend Django</h3>
              <p className="mt-2 text-lg">
                API modular dengan autentikasi JWT, registrasi langsung, triase IGD, dan integrasi Celery + Redis.
              </p>
            </article>
            <article className="bg-calm p-6">
              <h3 className="text-xl font-semibold text-primary-700">Database PostgreSQL</h3>
              <p className="mt-2 text-lg">
                Skema terstruktur untuk aktor rumah sakit, rawat inap, pendaftaran IGD, dan fasilitas kamar.
              </p>
            </article>
            <article className="bg-calm p-6">
              <h3 className="text-xl font-semibold text-primary-700">Frontend Tailwind</h3>
              <p className="mt-2 text-lg">
                Komponen kontras tinggi, ikon besar, dan panduan visual untuk pengalaman pengguna lansia.
              </p>
            </article>
          </div>
        </section>
      </main>

      <footer className="bg-white py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 text-lg text-elderText lg:flex-row lg:items-center lg:justify-between">
          <span>© {new Date().getFullYear()} SIM-RS+. Semua hak cipta dilindungi.</span>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="hover:underline">
              Kebijakan Privasi
            </Link>
            <Link href="/support" className="hover:underline">
              Pusat Bantuan
            </Link>
            <Link href="/contact" className="hover:underline">
              Kontak Rumah Sakit
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
