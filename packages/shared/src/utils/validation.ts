export const validateMessage = (
  message: string
): { isValid: boolean; error?: string } => {
  if (!message?.trim()) {
    return { isValid: false, error: "Message cannot be empty" };
  }
  if (message.length > 1000) {
    return { isValid: false, error: "Message too long (max 1000 characters)" };
  }
  return { isValid: true };
};
