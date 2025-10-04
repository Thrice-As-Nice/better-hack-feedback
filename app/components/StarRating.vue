<template>
  <div class="flex items-center gap-2">
    <button
      v-for="star in 5"
      :key="star"
      type="button"
      class="transition-all duration-200 hover:scale-110 focus:outline-none"
      :class="[star <= modelValue ? 'text-yellow-400' : 'text-gray-600']"
      @click="setRating(star)"
    >
      <svg
        class="w-10 h-10"
        :class="star <= modelValue ? 'fill-current' : 'fill-none stroke-current stroke-2'"
        viewBox="0 0 24 24"
      >
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    modelValue: number
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: number]
  }>()

  const setRating = (rating: number) => {
    emit('update:modelValue', rating)
  }
</script>
