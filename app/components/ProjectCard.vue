<template>
  <div
    class="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-gray-700 transition-colors"
  >
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1">
        <h3 class="text-xl font-bold text-white mb-2">{{ project.name }}</h3>
        <p class="text-gray-400 text-sm mb-3">{{ project.description }}</p>
        <p class="text-gray-500 text-xs">
          by <span class="text-white font-medium">{{ project.team }}</span>
        </p>
      </div>
    </div>

    <div class="flex items-center justify-between pt-4 border-t border-gray-800">
      <div class="flex items-center gap-2 text-gray-400">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"
          />
        </svg>
        <span class="font-semibold text-white">{{ project.votes }}</span>
      </div>

      <button
        :disabled="hasVoted || isVoting || disabled"
        class="py-2 px-6 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        :class="[
          hasVoted
            ? 'bg-gray-800 text-gray-400'
            : disabled
              ? 'bg-gray-700 text-gray-500'
              : 'bg-white text-black hover:bg-gray-200',
        ]"
        @click="handleVote"
      >
        <span v-if="hasVoted" class="flex items-center gap-2">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
          Voted
        </span>
        <span v-else>Vote</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  interface Project {
    id: string
    name: string
    description: string
    team: string
    votes: number
  }

  const props = defineProps<{
    project: Project
    hasVoted: boolean
    disabled?: boolean
  }>()

  const emit = defineEmits<{
    vote: [projectId: string]
  }>()

  const isVoting = ref(false)

  const handleVote = async () => {
    if (props.hasVoted || isVoting.value || props.disabled) return

    isVoting.value = true
    try {
      emit('vote', props.project.id)
    } finally {
      isVoting.value = false
    }
  }
</script>
