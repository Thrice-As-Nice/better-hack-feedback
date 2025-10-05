<template>
  <div class="min-h-screen bg-black">
    <!-- Loading state -->
    <div v-if="isAuthenticating" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
        <p class="text-white">Authenticating...</p>
      </div>
    </div>

    <!-- Auth error state -->
    <div v-else-if="authError" class="flex items-center justify-center min-h-screen">
      <div class="text-center max-w-md mx-auto px-4">
        <div class="text-red-400 text-6xl mb-4">⚠️</div>
        <h2 class="text-xl font-bold text-white mb-2">Authentication Error</h2>
        <p class="text-gray-400 mb-4">{{ authError }}</p>
        <button
          class="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
          @click="initializeAuth"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Main app -->
    <div v-else-if="user">
      <AppHeader :user="user" @logout="handleLogout" />

      <TabNavigation v-model="activeTab" @change="handleTabChange" />

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div v-if="activeTab === 'feedback'">
          <FeedbackForm @submit="handleFeedbackSubmit" />
        </div>

        <div v-if="activeTab === 'vote'">
          <VoteProjects :projects="projects" @vote="handleProjectVote" />
        </div>

        <div v-if="activeTab === 'add-project'">
          <AddProjectForm @submit="handleProjectSubmit" />
        </div>
      </main>
    </div>

    <!-- No user state -->
    <div v-else class="flex items-center justify-center min-h-screen">
      <div class="text-center max-w-md mx-auto px-4">
        <div class="text-blue-400 text-6xl mb-4">📱</div>
        <h2 class="text-xl font-bold text-white mb-2">Telegram Mini App</h2>
        <p class="text-gray-400 mb-4">
          This app requires authentication through Telegram. Please access it through a Telegram
          Mini App.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { getTelegramInitData, authClient } from './lib/client'

  interface User {
    id: string
    name: string
    username?: string
    photoUrl?: string
    isPremium?: boolean
  }

  interface TelegramUser extends User {
    username?: string
    photoUrl?: string
    isPremium?: boolean
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

  interface ProjectData {
    name: string
    description: string
    groupName: string
  }

  const activeTab = ref('feedback')
  const user = ref<User | null>(null)
  const isAuthenticating = ref(true)
  const authError = ref<string | null>(null)

  const projects = ref<Project[]>([])

  onMounted(async () => {
    await initializeAuth()
    if (user.value) {
      await fetchProjects()
    }
  })

  const initializeAuth = async () => {
    try {
      isAuthenticating.value = true
      authError.value = null

      await authClient.signIn.telegramMiniApp({
        initData: getTelegramInitData(),
      })

      const session = await authClient.getSession()
      user.value = session?.data?.user || (null as TelegramUser)
    } catch (error) {
      console.error('Authentication error:', error)
      authError.value = error instanceof Error ? error.message : 'Authentication failed'
    } finally {
      isAuthenticating.value = false
    }
  }

  const fetchProjects = async () => {
    try {
      const response = await $fetch('/api/projects')
      if (response.success) {
        // Map database fields to frontend interface
        projects.value = response.projects.map((project: any) => ({
          id: project.id,
          name: project.name,
          description: project.description || '',
          team: project.groupName || 'Individual',
          votes: project.vote_count,
        }))
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      // Keep empty array if fetch fails
      projects.value = []
    }
  }

  const handleTabChange = (tabId: string) => {
    activeTab.value = tabId
  }

  const handleLogout = async () => {
    try {
      await authClient.signOut()
      user.value = null
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleFeedbackSubmit = async (data: FeedbackData) => {
    try {
      const response = await $fetch('/api/feedback', {
        method: 'POST',
        body: {
          rating: data.rating,
          liked: data.liked,
          improvements: data.improvements,
        },
      })

      if (response.success) {
        console.log('Feedback submitted successfully:', response.feedback)
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
      throw error
    }
  }

  const handleProjectSubmit = async (data: ProjectData) => {
    try {
      const response = await $fetch('/api/projects', {
        method: 'POST',
        body: {
          name: data.name,
          description: data.description,
          groupName: data.groupName,
        },
      })

      if (response.success) {
        // Refresh the projects list to include the new project
        await fetchProjects()
        
        // Switch to vote tab to show the new project
        activeTab.value = 'vote'
      }
    } catch (error) {
      console.error('Error submitting project:', error)
      throw error
    }
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
