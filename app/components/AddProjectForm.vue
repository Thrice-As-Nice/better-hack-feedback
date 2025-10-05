<template>
  <div class="bg-gray-900 rounded-xl p-8 border border-gray-800">
    <h2 class="text-2xl font-bold text-white mb-6">Add Your Hackathon Project</h2>

    <form class="space-y-6" @submit.prevent="handleSubmit">
      <div>
        <label for="name" class="block text-white font-semibold mb-2">
          Project Name *
        </label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          required
          placeholder="Enter your project name..."
          class="w-full px-4 py-3 bg-black text-white placeholder-gray-500 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
        />
      </div>

      <div>
        <label for="description" class="block text-white font-semibold mb-2">
          Description
        </label>
        <textarea
          id="description"
          v-model="formData.description"
          rows="4"
          placeholder="Describe what your project does..."
          class="w-full px-4 py-3 bg-black text-white placeholder-gray-500 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent resize-none"
        />
      </div>

      <div>
        <label for="groupName" class="block text-white font-semibold mb-2">
          Team/Group Name
        </label>
        <input
          id="groupName"
          v-model="formData.groupName"
          type="text"
          placeholder="Enter your team name..."
          class="w-full px-4 py-3 bg-black text-white placeholder-gray-500 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
        />
      </div>

      <button
        type="submit"
        :disabled="!isFormValid || isSubmitting"
        class="w-full py-3 px-6 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <svg
          v-if="!isSubmitting"
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
        <span v-if="isSubmitting">Adding Project...</span>
        <span v-else>Add Project</span>
      </button>
    </form>

    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 transform translate-y-2"
      enter-to-class="opacity-100 transform translate-y-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showSuccess"
        class="mt-4 p-4 bg-green-900 border border-green-700 rounded-lg flex items-center gap-3"
      >
        <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <span class="text-green-200 font-medium">Project added successfully!</span>
      </div>
    </Transition>

    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 transform translate-y-2"
      enter-to-class="opacity-100 transform translate-y-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showError"
        class="mt-4 p-4 bg-red-900 border border-red-700 rounded-lg flex items-center gap-3"
      >
        <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <span class="text-red-200 font-medium">{{ errorMessage }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'

  interface ProjectData {
    name: string
    description: string
    groupName: string
  }

  const emit = defineEmits<{
    submit: [data: ProjectData]
  }>()

  const formData = ref<ProjectData>({
    name: '',
    description: '',
    groupName: '',
  })

  const isSubmitting = ref(false)
  const showSuccess = ref(false)
  const showError = ref(false)
  const errorMessage = ref('')

  const isFormValid = computed(() => {
    return formData.value.name.trim().length > 0
  })

  const handleSubmit = async () => {
    if (!isFormValid.value) return

    isSubmitting.value = true
    showError.value = false

    try {
      emit('submit', { ...formData.value })

      showSuccess.value = true
      setTimeout(() => {
        showSuccess.value = false
      }, 3000)

      // Reset form
      formData.value = {
        name: '',
        description: '',
        groupName: '',
      }
    } catch (error) {
      console.error('Error adding project:', error)
      errorMessage.value = error instanceof Error ? error.message : 'Failed to add project'
      showError.value = true
      setTimeout(() => {
        showError.value = false
      }, 5000)
    } finally {
      isSubmitting.value = false
    }
  }
</script>
