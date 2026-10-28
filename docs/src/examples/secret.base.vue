<script setup>
import { ref } from 'vue'
import { UiSecret } from '@myadion/ui'

const secret = ref('7Hq2kP9sLm4Vx8Rt1Zc6Wy3Nb5Jd0FgQ2kP9sLm4')
</script>

<template>
  <UiSecret :secret="secret" title="Le secret de l’application, à copier maintenant : il ne s’affichera plus." @done="secret = '7Hq2kP9sLm4Vx8Rt1Zc6Wy3Nb5Jd0FgQ2kP9sLm4'" />
</template>
