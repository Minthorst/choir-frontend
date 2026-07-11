<script setup lang="ts">
import BaseCard from "@/components/ui/BaseCard.vue";
</script>

<template>
  <base-card class="legal-card">
    <template #header><h3>Impressum</h3></template>
    <div class="legal-content">
      <h4>Angaben gemäß § 5 DDG</h4>
      <p>
        [nofomo]<br>
        Hanssensweg 14<br>
        22303 Hamburg
      </p>

      <h4>Vertreten durch</h4>
      <p>Niklas Nieschlag</p>

      <h4>Kontakt</h4>
      <p>E-Mail: <a href="mailto:admin.nofomo@lind-horst.com">admin.nofomo@lind-horst.com</a></p>

      <h4>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h4>
      <p>Niklas Nieschlag</p>

      <h4>Technische Umsetzung &amp; Betrieb</h4>
      <p>E-Mail: <a href="mailto:admin.nofomo@lind-horst.com">admin.nofomo@lind-horst.com</a></p>

      <h4>Streitschlichtung</h4>
      <p>
        Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
        <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener">https://ec.europa.eu/consumers/odr</a>.
        Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
        Verbraucherschlichtungsstelle teilzunehmen.
      </p>

      <h4>Haftung für Links</h4>
      <p>
        Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
        Einfluss haben. Für diese fremden Inhalte übernehmen wir keine Gewähr; verantwortlich ist
        stets der jeweilige Anbieter oder Betreiber der Seiten.
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
