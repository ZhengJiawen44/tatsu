export default function PrivacyPage() {
  return (
    <main className="min-h-screen  px-6 py-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold">Privacy Policy</h1>
          <p className="text-sm">Last updated: January 19, 2026</p>
        </header>

        <p>
          Sanity (“we”, “our”, or “us”) is a personal productivity app available
          at https://tatsu-gg.vercel.app/. This Privacy Policy explains what
          data we collect and how we use it.
        </p>

        <section>
          <h2 className="text-xl font-medium mb-2">
            1. Information We Collect
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Account data: email address and time zone</li>
            <li>User content: todos, notes, and encrypted files</li>
            <li>Technical data: IP address, browser and session info</li>
            <li>Cookies and local storage for authentication</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-2">2. How We Use Your Data</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Provide and operate Sanity</li>
            <li>Authenticate users</li>
            <li>Store and sync your content</li>
            <li>Maintain security and prevent abuse</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-2">
            3. Data Storage & Security
          </h2>
          <p>
            Sanity uses NextAuth for authentication, NeonDB for storage, and
            Vercel for hosting. Files are encrypted where applicable. While no
            system is perfectly secure, reasonable steps are taken to protect
            your data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-2">4. Sharing of Data</h2>
          <p>
            We only share data with service providers required to operate
            Sanity. We do not sell your personal data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-2">5. Cookies</h2>
          <p>
            Cookies and local storage are used for login sessions, preferences,
            and security. Disabling cookies may affect functionality.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-2">6. Data Retention</h2>
          <p>
            We keep your data while your account is active. You may delete your
            account at any time and your content will be removed within a
            reasonable period.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-2">7. Your Rights</h2>
          <p>
            You may access, correct, delete, or export your data using the app
            features.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-2">8. Changes</h2>
          <p>
            We may update this policy from time to time. Updates will appear on
            this page.
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
