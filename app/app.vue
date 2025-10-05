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
          <VoteProjects
            :projects="projects"
            :remaining-votes="remainingVotes"
            :max-votes="maxVotes"
            :user-vote-count="userVoteCount"
            @vote="handleProjectVote"
          />
        </div>

        <div v-if="activeTab === 'add-project'">
          <AddProjectForm @submit="handleProjectSubmit" />
        </div>

        <div v-if="activeTab === 'view-feedbacks'">
          <ViewFeedbacks />
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
    hasVoted: boolean
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
  const userVoteCount = ref(0)
  const maxVotes = ref(3)
  const remainingVotes = ref(3)

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
          hasVoted: project.hasVoted,
        }))

        // Update vote limit tracking
        userVoteCount.value = response.userVoteCount || 0
        maxVotes.value = response.maxVotes || 3
        remainingVotes.value = response.remainingVotes || 3
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
    // Find the project in our local state
    const projectIndex = projects.value.findIndex((p) => p.id === projectId)
    if (projectIndex === -1) {
      console.error('Project not found:', projectId)
      return
    }

    const project = projects.value[projectIndex]

    // Prevent voting if already voted
    if (project.hasVoted) {
      console.warn('User has already voted for this project')
      return
    }

    // Prevent voting if user has reached vote limit
    if (remainingVotes.value <= 0) {
      console.warn('You have reached the maximum limit of 3 votes')
      return
    }

    // Store original state for potential rollback
    const originalVotes = project.votes
    const originalHasVoted = project.hasVoted
    const originalUserVoteCount = userVoteCount.value
    const originalRemainingVotes = remainingVotes.value

    try {
      // Optimistic UI update - update immediately
      projects.value[projectIndex] = {
        ...project,
        votes: project.votes + 1,
        hasVoted: true,
      }
      userVoteCount.value += 1
      remainingVotes.value -= 1

      // Make API call
      const response = await $fetch(`/api/projects/${projectId}/vote`, {
        method: 'POST',
      })

      if (response.success) {
        // API call succeeded - update with server data to ensure consistency
        projects.value[projectIndex] = {
          ...project,
          votes: response.project.vote_count,
          hasVoted: true,
        }
        console.log('Vote recorded successfully')
      }
    } catch (error) {
      // Rollback optimistic update on error
      projects.value[projectIndex] = {
        ...project,
        votes: originalVotes,
        hasVoted: originalHasVoted,
      }
      userVoteCount.value = originalUserVoteCount
      remainingVotes.value = originalRemainingVotes

      console.error('Error voting for project:', error)

      // Show user-friendly error message based on error type
      if (error.status === 409) {
        console.warn('You have already voted for this project')
      } else if (error.status === 403) {
        console.warn('You have reached the maximum limit of 3 votes')
      } else {
        console.error('Failed to record vote. Please try again.')
      }
    }
  }
</script>
