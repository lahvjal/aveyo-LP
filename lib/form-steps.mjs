export const FORM_STEP_IDS = [1, 2, 3, 4, 5, 6, 7, 8]
export const ZIP_STEP_ID = 4

export function getFormStepIds(initialZip) {
  const zipAlreadyCollected = /^\d{5}$/.test(initialZip)
  return FORM_STEP_IDS.filter((step) => step !== ZIP_STEP_ID || !zipAlreadyCollected)
}
