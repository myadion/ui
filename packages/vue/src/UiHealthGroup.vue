<script setup>
import { computed } from 'vue'
import { healthOf, historyStrip, measuredText, uptimeText } from './health'
import UiBadge from './UiBadge.vue'

/*
 * UNE FAMILLE OU UNE SECTION DE SERVICES (Adion UI, coordination#78) : une
 * ligne (nom, etat), qui se deplie sur ses services. Chaque service dit son
 * point d'etat, sa disponibilite sur 24 h et 90 jours, et une frise de 90
 * jours ; un jour sans mesure est gris. Les codes d'etat viennent de Nexus,
 * les mots de health.js.
 */
const props = defineProps({
  title: { type: String, required: true },
  status: { type: String, default: 'unknown' },
  services: { type: Array, default: () => [] },
  open: { type: Boolean, default: false },
})

const state = computed(() => healthOf({ status: props.status }))
const rows = computed(() =>
  props.services.map((s) => ({
    ...s,
    state: healthOf(s),
    strip: s.history ? historyStrip(s.history) : null,
    measured: measuredText(s.measured_days),
  }))
)
const dateText = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
const stripLabel = (d) => `${dateText(d.date)} : ${d.uptime === null ? 'non mesuré' : uptimeText(d.uptime)}`
</script>

<template>
  <details class="ui-health" :open="open">
    <summary class="ui-health__head">
      <v-icon class="ui-health__chevron" icon="mdi-chevron-right" size="18" />
      <strong class="ui-health__title">{{ title }}</strong>
      <span class="ui-health__count">{{ services.length }} service{{ services.length > 1 ? 's' : '' }}</span>
      <UiBadge :label="state.label" :tone="state.tone" />
    </summary>
    <ul class="ui-health__list">
      <li v-for="s in rows" :key="s.name" class="ui-health__row">
        <div class="ui-health__main">
          <span class="ui-health__name"><span class="ui-health__dot" :class="`is-tone-${s.state.tone}`" aria-hidden="true" />{{ s.name }}</span>
          <span class="ui-health__state">{{ s.state.label }}</span>
          <dl class="ui-health__uptime">
            <div><dt>24 h</dt><dd>{{ uptimeText(s.uptime_24h) }}</dd></div>
            <div><dt>90 jours</dt><dd>{{ uptimeText(s.uptime_90d) }}</dd></div>
          </dl>
        </div>
        <div v-if="s.strip" class="ui-health__strip" role="img" :aria-label="`Disponibilité de ${s.name} sur 90 jours`">
          <span v-for="d in s.strip" :key="d.date" class="ui-health__day" :class="`is-${d.tone}`" :title="stripLabel(d)" />
        </div>
        <p v-if="s.measured" class="ui-health__note">{{ s.measured }}</p>
      </li>
      <li v-if="!rows.length" class="ui-health__row ui-health__note">Aucun service à afficher.</li>
    </ul>
  </details>
</template>
