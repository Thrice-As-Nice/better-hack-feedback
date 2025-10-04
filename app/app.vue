<template>
  <div class="min-h-screen bg-black">
    <AppHeader :user="user" @logout="handleLogout" />

    <TabNavigation v-model="activeTab" @change="handleTabChange" />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="activeTab === 'feedback'">
        <FeedbackForm @submit="handleFeedbackSubmit" />
      </div>

      <div v-if="activeTab === 'vote'">
        <VoteProjects :projects="projects" @vote="handleProjectVote" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'

  interface User {
    id: string
    name: string
    username?: string
    photoUrl?: string
  }

  interface Project {
    id: string
    name: string
    description: string
    team: string
    votes: number
  }

  interface FeedbackData {
    rating: number
    liked: string
    improvements: string
  }

  const activeTab = ref('feedback')

  const user = ref<User>({
    id: '123456789',
    name: 'Dagim Dot',
    username: 'dagimdot',
    photoUrl: '',
  })

  const projects = ref<Project[]>([
    {
      id: '1',
      name: 'AI Code Assistant',
      description: 'An intelligent coding companion powered by machine learning',
      team: 'Team Alpha',
      votes: 42,
    },
    {
      id: '2',
      name: 'Better Auth Mini App Plugin',
      description: 'Telegram Mini App authentication for Better Auth framework',
      team: 'Team Beta',
      votes: 38,
    },
    {
      id: '3',
      name: 'DevOps Dashboard',
      description: 'Real-time monitoring and deployment management tool',
      team: 'Team Gamma',
      votes: 35,
    },
    {
      id: '4',
      name: 'Smart Calendar',
      description: 'AI-powered scheduling assistant with smart suggestions',
      team: 'Team Delta',
      votes: 31,
    },
  ])

  onMounted(async () => {
    // TODO: Initialize Better Auth
    // const initData = await sendInitData()
    // Fetch user session from Better Auth
    console.log('Initializing Better Auth...')
  })

  const handleTabChange = (tabId: string) => {
    activeTab.value = tabId
  }

  const handleLogout = async () => {
    // TODO: Implement Better Auth logout
    console.log('Logging out...')
  }

  const handleFeedbackSubmit = async (data: FeedbackData) => {
    // TODO: Submit feedback to API
    console.log('Feedback submitted:', data)
  }

  const handleProjectVote = async (projectId: string) => {
    // TODO: Submit vote to API
    console.log('Voted for project:', projectId)

    // Optimistic update
    const project = projects.value.find((p) => p.id === projectId)
    if (project) {
      project.votes++
    }
  }
</script>
