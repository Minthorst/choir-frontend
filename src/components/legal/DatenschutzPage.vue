<script setup lang="ts">
import BaseCard from "@/components/ui/BaseCard.vue";
</script>

<template>
  <base-card class="legal-card">
    <template #header><h3>Datenschutzerklärung</h3></template>
    <div class="legal-content">
      <h4>1. Verantwortlicher</h4>
      <p>
        [nofomo], Hanssensweg 14, 22303 Hamburg<br>
        Vertreten durch: Niklas Nieschlag<br>
        E-Mail: <a href="mailto:admin.nofomo@lind-horst.com">admin.nofomo@lind-horst.com</a>
      </p>

      <h4>2. Zweck dieser Anwendung</h4>
      <p>
        Diese Anwendung dient der internen Verwaltung des [nofomo]-Chors: Mitglieder können ihren
        Ticketstand und ihre Probenteilnahmen einsehen und sich zu Proben anmelden (Check-in).
        Der Zugang ist passwortgeschützt und richtet sich ausschließlich an Chormitglieder.
      </p>

      <h4>3. Verarbeitete Daten</h4>
      <p>
        Für die Mitgliederverwaltung speichern wir: Name, Ticketkontostände (Regular-/Commit-Tickets)
        sowie die Teilnahmehistorie an Proben (Datum, Uhrzeit, Status). Rechtsgrundlage ist
        Art. 6 Abs. 1 lit. b DSGVO (Durchführung des Mitgliedschaftsverhältnisses) bzw.
        Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer geordneten Chorverwaltung).
        Die Daten werden gelöscht, wenn die Mitgliedschaft endet oder du ihre Löschung verlangst.
      </p>

      <h4>4. Technisch notwendige Cookies</h4>
      <p>
        Die Anwendung verwendet ausschließlich technisch notwendige Cookies: ein Sitzungs-Cookie
        für den Login (JSESSIONID) und ein Sicherheits-Token (XSRF-TOKEN) zum Schutz vor
        Cross-Site-Angriffen. Es findet kein Tracking statt; es werden keine Analyse- oder
        Werbedienste eingesetzt.
      </p>

      <h4>5. Hosting und Server-Daten</h4>
      <p>
        Die Anwendung wird auf einem Server der IONOS SE (Elgendorfer Str. 57, 56410 Montabaur)
        in Deutschland betrieben. Beim Aufruf der Seite wird deine IP-Adresse technisch
        verarbeitet, soweit dies für die Auslieferung der Inhalte und die Abwehr von Angriffen
        (z.&nbsp;B. Begrenzung von Login-Versuchen) erforderlich ist
        (Art. 6 Abs. 1 lit. f DSGVO). Eine dauerhafte personenbezogene Auswertung von
        Zugriffsprotokollen findet nicht statt.
      </p>

      <h4>6. Zahlungen (PayPal)</h4>
      <p>
        Für den Ticketkauf verlinken wir auf PayPal (PayPal (Europe) S.à r.l. et Cie, S.C.A.,
        22-24 Boulevard Royal, 2449 Luxembourg). Die Zahlung findet vollständig auf der Website
        von PayPal statt; diese Anwendung erhält und speichert keine Zahlungsdaten. Es gilt die
        <a href="https://www.paypal.com/de/legalhub/privacy-full" target="_blank" rel="noopener">Datenschutzerklärung von PayPal</a>.
      </p>

      <h4>7. E-Mail-Versand</h4>
      <p>
        Systembenachrichtigungen (z.&nbsp;B. Hinweise auf nicht abgeschlossene Proben) werden per
        E-Mail über den Mail-Dienst von IONOS an die Chorleitung versendet. Dabei werden keine
        Mitgliederdaten an Dritte übermittelt.
      </p>

      <h4>8. Deine Rechte</h4>
      <p>
        Du hast das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung
        (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und
        Widerspruch (Art. 21). Wende dich dafür formlos an die oben genannte E-Mail-Adresse.
        Außerdem hast du das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren —
        zuständig ist der Hamburgische Beauftragte für Datenschutz und Informationsfreiheit.
      </p>
    </div>
  </base-card>
</template>

<style scoped>
.legal-card {
  max-width: 640px;
}

.legal-content {
  text-align: left;
  width: 100%;
}

.legal-content h4 {
  margin: 1.25rem 0 0.35rem;
  color: var(--accent);
}

.legal-content h4:first-child {
  margin-top: 0;
}

.legal-content p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.6;
}

.legal-content a {
  color: var(--accent);
  word-break: break-all;
}
</style>
