export function useDsfrScheme () {
  const isThemeModalOpen = useState('theme-modal', () => false)

  return {
    isThemeModalOpen
  }
}
