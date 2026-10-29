<script setup>
/*
 * UN ACCUEIL, APRES UNE REUSSITE (Adion UI, 2026-10-29). Le titre au-dessus,
 * une coche verte ronde au centre qui se dessine dans un halo, deux ondes et
 * une gerbe d'etincelles ; le bouton juste dessous. Peu de mots.
 *
 *   title  la phrase d'accueil (« Bienvenue chez Adion Cloud, Kevin ! »)
 *   lead   une ligne facultative sous la coche
 *   #default  les boutons
 *
 * Sans animation quand la personne l'a demande (prefers-reduced-motion).
 */
defineProps({
  title: { type: String, required: true },
  lead: { type: String, default: '' },
})
/* Huit etincelles en couronne ; l'angle et la couleur alternent. */
const SPARKS = Array.from({ length: 8 }, (_, i) => ({ angle: i * 45 + 22.5, tone: i % 2 ? 'b' : 'a' }))
</script>

<template>
  <div class="ui-welcome" role="status">
    <h2 class="ui-welcome__title" tabindex="-1">{{ title }}</h2>
    <div class="ui-welcome__mark" aria-hidden="true">
      <span class="ui-welcome__halo" />
      <span class="ui-welcome__wave" />
      <span class="ui-welcome__wave is-late" />
      <span
        v-for="spark in SPARKS"
        :key="spark.angle"
        class="ui-welcome__spark"
        :class="`is-${spark.tone}`"
        :style="{ '--ui-spark-angle': `${spark.angle}deg` }"
      />
      <svg viewBox="0 0 96 96">
        <circle class="ui-welcome__disc" cx="48" cy="48" r="44" />
        <path class="ui-welcome__tick" d="M30 49 l12 12 l24 -26" />
      </svg>
    </div>
    <p v-if="lead" class="ui-welcome__lead">{{ lead }}</p>
    <div v-if="$slots.default" class="ui-welcome__actions"><slot /></div>
  </div>
</template>
