export default function TermsPage() {
  return (
    <main className="min-h-screen px-6 py-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold">Terms of Service</h1>
          <p className="text-sm ">Last updated: January 19, 2026</p>
        </header>

        <p>
          By using Sanity at https://tatsu-gg.vercel.app/ (the “Service”), you
          agree to these Terms of Service.
        </p>

        <section>
          <h2 className="text-xl font-medium mb-2">1. Use of the Service</h2>
          <p>
            Sanity is a free productivity app for managing todos, notes, and
            files. You agree to use the Service lawfully and not abuse or
            disrupt it.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-2">2. Accounts</h2>
          <p>
            You are responsible for keeping your account secure and all activity
            under your account. Information must be accurate.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-2">3. Your Content</h2>
          <p>
            You retain ownership of your content. By using Sanity, you grant
            permission to store and process it only to operate the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-2">4. Acceptable Use</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>No illegal, harmful, or malicious content</li>
            <li>No accessing other users’ data</li>
            <li>No abusing infrastructure</li>
            <li>No unlawful use of the Service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-2">5. Availability</h2>
          <p>
            Sanity is a personal project provided on a best-effort basis. The
            Service may change, go offline, or be discontinued at any time.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-2">6. Termination</h2>
          <p>
            You may stop using Sanity at any time. We may suspend access if
            these Terms are violated.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-2">7. Disclaimer</h2>
          <p>
            Sanity is provided “as is”. We are not responsible for data loss,
            interruptions, or damages resulting from use of the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-2">8. Changes</h2>
          <p>
            We may update these Terms. Continued use means you accept the
            changes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-2">9. Contact</h2>
          <p>
            Questions? Email{" "}
            <a href="mailto:zhengjiawen44@gmail.com" className="underline">
              zhengjiawen44@gmail.com
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
