import { useTranslations } from "next-intl";

export default function TermsPage() {
  const t = useTranslations("terms");

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold">{t("title")}</h1>
          <p className="text-sm">{t("lastUpdated")}</p>
        </header>

        <p>{t("intro")}</p>

        <section>
          <h2 className="text-xl font-medium mb-2">1. {t("sections.1.title")}</h2>
          <p>{t("sections.1.content")}</p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-2">2. {t("sections.2.title")}</h2>
          <p>{t("sections.2.content")}</p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-2">3. {t("sections.3.title")}</h2>
          <p>{t("sections.3.content")}</p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-2">4. {t("sections.4.title")}</h2>
          <ul className="list-disc pl-5 space-y-1">
            {(t.raw("sections.4.content") as string[]).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-2">5. {t("sections.5.title")}</h2>
          <p>{t("sections.5.content")}</p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-2">6. {t("sections.6.title")}</h2>
          <p>{t("sections.6.content")}</p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-2">7. {t("sections.7.title")}</h2>
          <p>{t("sections.7.content")}</p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-2">8. {t("sections.8.title")}</h2>
          <p>{t("sections.8.content")}</p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-2">9. {t("sections.9.title")}</h2>
          <p>
            {t("sections.9.content")}{" "}
            <a href="mailto:zhengjiawen44@gmail.com" className="underline">
              zhengjiawen44@gmail.com
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}