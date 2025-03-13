import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function getEmotionColor(emotion: string) {
  switch (emotion) {
    case "happy":
      return "#FFD700";
    case "sad":
      return "#1E90FF";
    case "angry":
      return "#FF4500";
    case "surprised":
      return "#9400D3";
    case "neutral":
      return "#808080";
    default:
      return "#000000";
  }
}
export function getEmotionEmoji(emotion: string) {
  switch (emotion) {
    case "happy":
      return "😃";
    case "sad":
      return "😢";
    case "angry":
      return "😡";
    case "surprised":
      return "😲";
    case "neutral":
      return "😐";
    default:
      return "❓";
  }
}
export function getEmotionName(emotion: string) {
  switch (emotion) {
    case "happy":
      return "Happy";
    case "sad":
      return "Sad";
    case "angry":
      return "Angry";
    case "surprised":
      return "Surprised";
    case "neutral":
      return "Neutral";
    default:
      return "Unknown";
  }
}
export function getEmotionIcon(emotion: string) {
  switch (emotion) {
    case "happy":
      return "😃";
    case "sad":
      return "😢";
    case "angry":
      return "😡";
    case "surprised":
      return "😲";
    case "neutral":
      return "😐";
    default:
      return "❓";
  }
}
export function getEmotionDescription(emotion: string) {
  switch (emotion) {
    case "happy":
      return "You're feeling happy!";
    case "sad":
      return "You're feeling sad.";
    case "angry":
      return "You're feeling angry.";
    case "surprised":
      return "You're feeling surprised!";
    case "neutral":
      return "You're feeling neutral.";
    default:
      return "You're feeling something.";
  }
}
export function getEmotionGif(emotion: string) {
  switch (emotion) {
    case "happy":
      return "https://media.giphy.com/media/3o7TKz4D1b5K4zRwnK/giphy.gif";
    case "sad":
      return "https://media.giphy.com/media/3o7TKz4D1b5K4zRwnK/giphy.gif";
    case "angry":
      return "https://media.giphy.com/media/3o7TKz4D1b5K4zRwnK/giphy.gif";
    case "surprised":
      return "https://media.giphy.com/media/3o7TKz4D1b5K4zRwnK/giphy.gif";
    case "neutral":
      return "https://media.giphy.com/media/3o7TKz4D1b5K4zRwnK/giphy.gif";
    default:
      return "https://media.giphy.com/media/3o7TKz4D1b5K4zRwnK/giphy.gif";
  }
}
export function getEmotionTitle(emotion: string) {
  switch (emotion) {
    case "happy":
      return "Happy";
    case "sad":
      return "Sad";
    case "angry":
      return "Angry";
    case "surprised":
      return "Surprised";
    case "neutral":
      return "Neutral";
    default:
      return "Unknown";
  }
}
export function getEmotionSubtitle(emotion: string) {
  switch (emotion) {
    case "happy":
      return "You're feeling happy!";
    case "sad":
      return "You're feeling sad.";
    case "angry":
      return "You're feeling angry.";
    case "surprised":
      return "You're feeling surprised!";
    case "neutral":
      return "You're feeling neutral.";
    default:
      return "You're feeling something.";
  }
}
