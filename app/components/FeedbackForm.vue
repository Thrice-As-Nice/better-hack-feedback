<template>
  <div class="bg-gray-900 rounded-xl p-8 border border-gray-800">
    <h2 class="text-2xl font-bold text-white mb-6">Share Your Hackathon Experience</h2>

    <form class="space-y-6" @submit.prevent="handleSubmit">
      <div>
        <label class="block text-white font-semibold mb-3"> Overall Rating </label>
        <StarRating v-model="formData.rating" />
      </div>

      <div>
        <label for="liked" class="block text-white font-semibold mb-2">
          What did you like about the hackathon?
        </label>
        <textarea
          id="liked"
          v-model="formData.liked"
          rows="4"
          placeholder="Share what made this hackathon awesome..."
          class="w-full px-4 py-3 bg-black text-white placeholder-gray-500 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent resize-none"
        />
      </div>

      <div>
        <label for="improvements" class="block text-white font-semibold mb-2">
          What could be improved?
        </label>
        <textarea
          id="improvements"
          v-model="formData.improvements"
          rows="4"
          placeholder="Help us make the next hackathon even better..."
          class="w-full px-4 py-3 bg-black text-white placeholder-gray-500 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent resize-none"
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
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
        <span v-if="isSubmitting">Submitting...</span>
        <span v-else>Submit Feedback</span>
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
        <span class="text-green-200 font-medium">Feedback submitted successfully!</span>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'

  interface FeedbackData {
    rating: number
    liked: string
    improvements: string
  }

  const emit = defineEmits<{
    submit: [data: FeedbackData]
  }>()

  const formData = ref<FeedbackData>({
    rating: 0,
    liked: '',
    improvements: '',
  })

  const isSubmitting = ref(false)
  const showSuccess = ref(false)

  const isFormValid = computed(() => {
    return formData.value.rating > 0 && formData.value.liked.trim().length > 0
  })

  const handleSubmit = async () => {
    if (!isFormValid.value) return

    isSubmitting.value = true

    try {
      emit('submit', { ...formData.value })

      showSuccess.value = true
      setTimeout(() => {
        showSuccess.value = false
      }, 3000)

      formData.value = {
        rating: 0,
        liked: '',
        improvements: '',
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
    } finally {
      isSubmitting.value = false
    }
  }
</script>
