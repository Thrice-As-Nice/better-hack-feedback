<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-white">Vote for Projects</h2>
      <div class="text-gray-400 text-sm">
        {{ votedProjects.size }} of {{ projects.length }} voted
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <ProjectCard
        v-for="project in projects"
        :key="project.id"
        :project="project"
        :has-voted="votedProjects.has(project.id)"
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
  import { ref } from 'vue'

  interface Project {
    id: string
    name: string
    description: string
    team: string
    votes: number
  }

  const props = defineProps<{
    projects: Project[]
  }>()

  const emit = defineEmits<{
    vote: [projectId: string]
  }>()

  const votedProjects = ref<Set<string>>(new Set())

  const handleVote = (projectId: string) => {
    votedProjects.value.add(projectId)
    emit('vote', projectId)
  }
</script>
