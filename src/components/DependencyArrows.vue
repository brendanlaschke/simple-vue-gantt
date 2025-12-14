<template>
  <g v-if="showDependencies" class="dependency-arrows">
    <!-- Arrow Marker Definition -->
    <defs>
      <marker
        id="arrowhead"
        markerWidth="10"
        markerHeight="10"
        refX="9"
        refY="3"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <polygon points="0 0, 10 3, 0 6" fill="#64748b" />
      </marker>

      <!-- Gradient for a more polished look (optional) -->
      <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#94a3b8;stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:#64748b;stop-opacity:1" />
      </linearGradient>
    </defs>

    <!-- Arrows -->
    <path
      v-for="arrow in arrows"
      :key="arrow.id"
      :d="arrow.path"
      fill="none"
      stroke="#64748b"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      marker-end="url(#arrowhead)"
      class="dependency-path"
    />
  </g>
</template>

<script setup lang="ts">
interface Arrow {
  id: string
  path: string
}

interface Props {
  arrows: Arrow[]
  showDependencies?: boolean
}

withDefaults(defineProps<Props>(), {
  showDependencies: true
})
</script>

<style scoped>
.dependency-path {
  transition: stroke-width 0.2s ease, stroke 0.2s ease;
}

.dependency-path:hover {
  stroke: #475569;
  stroke-width: 2;
  cursor: pointer;
}
</style>
