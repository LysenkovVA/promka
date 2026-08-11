export const simulateDelay = (msDelay: number) =>
  new Promise((resolve) => setTimeout(resolve, msDelay))
