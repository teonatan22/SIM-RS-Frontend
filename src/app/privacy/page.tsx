"use client";

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12">
      <div className="rounded-3xl bg-white p-10 shadow-comfort space-y-6">
        <h1 className="text-4xl font-semibold text-primary-700">Kebijakan Privasi SIM-RS</h1>
        <p className="text-lg">
          Kami menjaga data medis dan informasi pribadi Anda sesuai standar keamanan rumah sakit dan regulasi nasional.
          Portal ini menggunakan enkripsi dan autentikasi JWT berlapis untuk memastikan hanya pihak berwenang yang dapat
          mengakses data pasien.
        </p>
        <section className="space-y-3 text-lg">
          <h2 className="text-2xl font-semibold text-primary-700">Ringkasan</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Data disimpan di server rumah sakit dengan akses terbatas.</li>
            <li>Kami hanya mengumpulkan informasi yang dibutuhkan untuk layanan kesehatan.</li>
            <li>Pasien dapat meminta salinan atau menghapus akun melalui customer service.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

