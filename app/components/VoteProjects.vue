<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-white">Vote for Projects</h2>
      <div class="text-right">
        <div class="text-gray-400 text-sm">{{ votedCount }} of {{ projects.length }} voted</div>
        <div class="text-sm" :class="remainingVotes > 0 ? 'text-blue-400' : 'text-red-400'">
          {{ remainingVotes }} votes remaining ({{ maxVotes }} max)
        </div>
      </div>
    </div>

    <div
      v-if="remainingVotes === 0"
      class="bg-amber-900 border border-amber-700 rounded-lg p-4 flex items-center gap-3"
    >
      <svg
        class="w-6 h-6 text-amber-400 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
      <span class="text-amber-200 font-medium"
        >You have used all your votes ({{ maxVotes }}/{{ maxVotes }})</span
      >
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <ProjectCard
        v-for="project in projects"
        :key="project.id"
        :project="project"
        :has-voted="project.hasVoted"
        :disabled="!project.hasVoted && remainingVotes <= 0"
        @vote="handleVote"
      />
    </div>

    <div
      v-if="projects.length === 0"
      class="bg-gray-900 rounded-xl p-12 border border-gray-800 text-center"
    >
      <svg
        class="w-16 h-16 text-gray-600 mx-auto mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
      <p class="text-gray-400">No projects to vote on yet</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  interface Project {
    id: string
    name: string
    description: string
    team: string
    votes: number
    hasVoted: boolean
  }

  const props = defineProps<{
    projects: Project[]
    remainingVotes: number
    maxVotes: number
    userVoteCount: number
  }>()

  const emit = defineEmits<{
    vote: [projectId: string]
  }>()

  const votedCount = computed(() => {
    return props.projects.filter((project) => project.hasVoted).length
  })

  const handleVote = (projectId: string) => {
    emit('vote', projectId)
  }
</script>
