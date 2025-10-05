<template>
  <div class="min-h-screen bg-black">
    <!-- Loading state -->
    <div v-if="isAuthenticating" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
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
          @click="initializeAuth"
          class="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
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
      </main>
    </div>

    <!-- No user state -->
    <div v-else class="flex items-center justify-center min-h-screen">
      <div class="text-center max-w-md mx-auto px-4">
        <div class="text-blue-400 text-6xl mb-4">📱</div>
        <h2 class="text-xl font-bold text-white mb-2">Telegram Mini App</h2>
        <p class="text-gray-400 mb-4">
          This app requires authentication through Telegram. Please access it through a Telegram Mini App.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { authenticateWithTelegram, authClient } from './lib/client'

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

  const activeTab = ref('feedback')
  const user = ref<User | null>(null)
  const isAuthenticating = ref(false)
  const authError = ref<string | null>(null)

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
    await initializeAuth()
  })

  const initializeAuth = async () => {
    try {
      isAuthenticating.value = true
      authError.value = null

      // Check if we have Telegram init data to authenticate with
      const hasInitData = typeof window !== 'undefined' &&
        (window.location.hash.startsWith('#tgWebAppData=') ||
         new URLSearchParams(window.location.search).has('tgWebAppData'))

      if (hasInitData) {
        // Authenticate with Telegram
        const authResult = await authenticateWithTelegram()
        user.value = {
          id: authResult.user.id,
          name: authResult.user.name || 'Unknown User',
          username: (authResult.user as TelegramUser).username,
          photoUrl: (authResult.user as TelegramUser).photoUrl,
          isPremium: (authResult.user as TelegramUser).isPremium,
        }
      } else {
        // Try to get existing session
        const session = await authClient.getSession()
        if (session?.data) {
          user.value = {
            id: session.data.user.id,
            name: session.data.user.name || 'Unknown User',
            username: (session.data.user as TelegramUser).username,
            photoUrl: (session.data.user as TelegramUser).photoUrl,
            isPremium: (session.data.user as TelegramUser).isPremium,
          }
        }
      }
    } catch (error) {
      console.error('Authentication error:', error)
      authError.value = error instanceof Error ? error.message : 'Authentication failed'
    } finally {
      isAuthenticating.value = false
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
