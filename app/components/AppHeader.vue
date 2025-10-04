<template>
  <header class="bg-black border-b border-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-white rounded flex items-center justify-center">
            <svg class="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
              />
            </svg>
          </div>
          <h1 class="text-xl font-bold text-white">Better Hack Echo</h1>
        </div>

        <div class="relative">
          <button
            class="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors overflow-hidden focus:outline-none focus:ring-2 focus:ring-white"
            @click="toggleProfile"
          >
            <img
              v-if="user?.photoUrl"
              :src="user.photoUrl"
              :alt="user.name"
              class="w-full h-full object-cover"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center text-white font-semibold"
            >
              {{ userInitials }}
            </div>
          </button>

          <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-1"
          >
            <div
              v-if="isProfileOpen"
              class="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
            >
              <div class="p-4">
                <div class="flex items-start gap-3 mb-4">
                  <div class="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                    <img
                      v-if="user?.photoUrl"
                      :src="user.photoUrl"
                      :alt="user.name"
                      class="w-full h-full object-cover"
                    />
                    <div
                      v-else
                      class="w-full h-full flex items-center justify-center text-gray-600 text-xl font-semibold"
                    >
                      {{ userInitials }}
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="text-lg font-semibold text-gray-900 truncate">
                      {{ user?.name || 'User' }}
                    </h3>
                    <p v-if="user?.username" class="text-sm text-gray-500 truncate">
                      @{{ user.username }}
                    </p>
                  </div>
                </div>

                <div class="space-y-2 mb-4">
                  <div class="flex items-center gap-2 text-sm">
                    <span class="text-gray-500">User ID:</span>
                    <span class="text-gray-900 font-mono">{{ user?.id || 'N/A' }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <span class="text-gray-500">Session:</span>
                    <span class="text-green-600 font-semibold">Active</span>
                  </div>
                </div>

                <button
                  class="w-full py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                  @click="handleLogout"
                >
                  Logout
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <div v-if="isProfileOpen" class="fixed inset-0 z-40" @click="toggleProfile" />
  </header>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'

  interface User {
    id: string
    name: string
    username?: string
    photoUrl?: string
    isPremium?: boolean
  }

  const props = defineProps<{
    user?: User
  }>()

  const emit = defineEmits<{
    logout: []
  }>()

  const isProfileOpen = ref(false)

  const toggleProfile = () => {
    isProfileOpen.value = !isProfileOpen.value
  }

  const userInitials = computed(() => {
    if (!props.user?.name) return 'U'
    const names = props.user.name.split(' ')
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return names[0][0].toUpperCase()
  })

  const handleLogout = () => {
    toggleProfile()
    emit('logout')
  }
</script>
