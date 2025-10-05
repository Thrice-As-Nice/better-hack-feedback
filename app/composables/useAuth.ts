/**
 * Composable for checking user authorization status
 */
export const useAuth = () => {
  const isAuthorized = ref(false)
  const isChecking = ref(true)

  const checkAuthorization = async () => {
    try {
      isChecking.value = true
      
      // Try to make a request that requires authorization
      // We'll use the feedbacks endpoint as a test since it requires admin access
      await $fetch('/api/feedbacks', {
        method: 'GET',
      })
      
      // If we get here without an error, user is authorized
      isAuthorized.value = true
      return true
    } catch (error: unknown) {
      // If we get a 403 error, user is not authorized
      if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 403) {
        isAuthorized.value = false
        return false
      }
      
      // For other errors (like 401), also consider not authorized
      isAuthorized.value = false
      return false
    } finally {
      isChecking.value = false
    }
  }

  return {
    isAuthorized: readonly(isAuthorized),
    isChecking: readonly(isChecking),
    checkAuthorization,
  }
}
