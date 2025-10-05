<template>
  <div class="bg-black border-b border-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <nav class="flex gap-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="relative py-4 px-2 text-sm font-medium transition-colors focus:outline-none"
          :class="[modelValue === tab.id ? 'text-white' : 'text-gray-400 hover:text-gray-300']"
          @click="emit('change', tab.id)"
        >
          <div class="flex items-center gap-2">
            <svg
              v-if="tab.id === 'feedback'"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
            <svg
              v-if="tab.id === 'vote'"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            <svg
              v-if="tab.id === 'add-project'"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span>{{ tab.label }}</span>
          </div>
          <div
            v-if="modelValue === tab.id"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
          />
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Tab {
    id: string
    label: string
  }

  const props = defineProps<{
    modelValue: string
  }>()

  const emit = defineEmits<{
    change: [tabId: string]
  }>()

  const tabs: Tab[] = [
    {
      id: 'feedback',
      label: 'Feedback',
    },
    {
      id: 'vote',
      label: 'Vote Projects',
    },
    {
      id: 'add-project',
      label: 'Add Project',
    },
  ]
</script>
