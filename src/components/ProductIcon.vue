<script setup>
defineProps({
  name: { type: String, required: true },
  size: { type: Number, default: 24 },
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <g v-if="name === 'mother'">
      <path d="M8.5 7.5a3.5 3.5 0 1 1 7 0c0 2-1.2 3.5-3.5 3.5S8.5 9.5 8.5 7.5Z" />
      <path d="M6.5 21v-4.5a5.5 5.5 0 0 1 11 0V21" />
      <path d="M9 17.5c1.8-2 4.2-2 6 0" />
      <circle cx="12" cy="17.2" r="1.7" />
    </g>
    <g v-else-if="name === 'skin'">
      <path d="M8.2 3.5c-2.4 2-3.7 4.5-3.7 7.4 0 5.3 3.3 9.6 7.5 9.6s7.5-4.3 7.5-9.6c0-2.9-1.3-5.4-3.7-7.4" />
      <path d="M9 9.5c.7-.8 1.7-1.2 3-1.2s2.3.4 3 1.2M9.5 15c1.5 1 3.5 1 5 0" />
      <circle cx="8.2" cy="12.5" r=".7" fill="currentColor" stroke="none" />
      <circle cx="15.8" cy="12.5" r=".7" fill="currentColor" stroke="none" />
    </g>
    <g v-else-if="name === 'digestive'">
      <path d="M9.2 3.2v4.4c0 1.2-.7 2.2-1.8 2.7l-1.2.5c-1.4.6-2.2 2-2 3.5.3 2.4 2.2 4.3 4.6 4.5" />
      <path d="M14.8 3.2v4.2c0 1.3.7 2.4 1.9 3l.8.4c1.5.7 2.4 2.4 2 4-.4 2-2.2 3.5-4.3 3.6" />
      <path d="M9 18.8c0-3.3 1.2-5.4 3-5.4s3 2.1 3 5.4c0 1.3-.9 2.2-3 2.2s-3-.9-3-2.2Z" />
    </g>
    <g v-else-if="name === 'medication'">
      <path d="M7.2 5.2a4 4 0 0 1 5.6 0l6 6a4 4 0 0 1-5.6 5.6l-6-6a4 4 0 0 1 0-5.6Z" />
      <path d="m10 8 6 6" />
      <path d="M5 18.5h5M7.5 16v5" />
    </g>
    <g v-else-if="name === 'oncology'">
      <path d="M12 3v18M7.5 6.5c3 2 6 2 9 0M7 17.5c3-2 7-2 10 0" />
      <path d="M5.5 11.5h13" />
      <circle cx="12" cy="12" r="9" />
    </g>
    <g v-else-if="name === 'telecare'">
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
      <path d="M7.5 10.5h2.2l1.2-2.8 2.1 5 1.2-2.2h2.3" />
    </g>
    <g v-else-if="name === 'vision'">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M7 9V7h3M17 9V7h-3M7 15v2h3M17 15v2h-3" />
      <circle cx="12" cy="12" r="2.2" />
    </g>
    <g v-else-if="name === 'autoclave'">
      <rect x="4" y="3" width="16" height="18" rx="2.5" />
      <circle cx="12" cy="11" r="4.5" />
      <path d="M8 5.8h3M16.5 5.8h.1M10 18h4" />
    </g>
    <g v-else-if="name === 'sterilization'">
      <rect x="3" y="3.5" width="18" height="17" rx="2" />
      <path d="M7 3.5v17M17 3.5v17M7 8h10M7 16h10" />
      <path d="M10 12h4" />
    </g>
    <g v-else-if="name === 'glucose'">
      <path d="M12 2.8S6.5 9.4 6.5 14a5.5 5.5 0 0 0 11 0C17.5 9.4 12 2.8 12 2.8Z" />
      <path d="M9.5 14h1.8l1-2.2 1.3 4 1-1.8h1.1" />
    </g>
    <g v-else>
      <rect x="6" y="3" width="12" height="18" rx="2" />
      <path d="M9 7h6M9 11h6M9 15h3" />
      <path d="m14 17 1.4 1.4L18 15.8" />
    </g>
  </svg>
</template>
