<template>
  <g class="project-summary-bar" @click="handleClick">
    <rect
      :x="x"
      :y="y + height / 2 - barHeight / 2"
      :width="width"
      :height="barHeight"
      :fill="color"
      :opacity="0.3"
      class="project-summary-bar__background"
      :clip-path="`polygon(-${barHeight}px 0,calc(100% + ${barHeight}px) 0,calc(100% + ${barHeight}px) 100%,100% 100%,calc(100% - ${barHeight / 3}px) calc(100% - ${barHeight / 3}px),${barHeight / 3}px calc(100% - ${barHeight / 3}px),0 100%,-${barHeight}px 100%)`"
    />
    <rect
      v-if="progress !== undefined && progress > 0"
      :x="x"
      :y="y + height / 2 - barHeight / 2"
      :width="width * (Math.min(progress, 100) / 100)"
      :height="barHeight"
      :fill="color"
      :clip-path="progressClipPath"
      class="project-summary-bar__progress"
    />
  </g>
</template>

<script setup lang="ts">
import { computed } from "vue";
interface Props {
  projectId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  barHeight?: number;
  color?: string;
  progress?: number;
}

const props = withDefaults(defineProps<Props>(), {
  barHeight: 8,
  color: "#3b82f6",
});

// When progress < 100 the right-side triangle is omitted so the fill ends flat.
const progressClipPath = computed(() => {
  const h = props.barHeight;
  if ((props.progress ?? 0) >= 100) {
    return `polygon(-${h}px 0,calc(100% + ${h}px) 0,calc(100% + ${h}px) 100%,100% 100%,calc(100% - ${h / 3}px) calc(100% - ${h / 3}px),${h / 3}px calc(100% - ${h / 3}px),0 100%,-${h}px 100%)`;
  }
  return `polygon(-${h}px 0,calc(100% + ${h}px) 0,calc(100% + ${h}px) calc(100% - ${h / 3}px),${h / 3}px calc(100% - ${h / 3}px),0 100%,-${h}px 100%)`;
});

const emit = defineEmits<{
  click: [event: MouseEvent, projectId: string];
}>();

const handleClick = (event: MouseEvent) => {
  emit("click", event, props.projectId);
};
</script>

<style scoped>
.project-summary-bar__background {
  transition: opacity 0.2s;
}
.project-summary-bar__background:hover {
  opacity: 0.5;
}
</style>
