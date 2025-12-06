import { useEffect, useRef } from "react";
import { useStore } from "../store/useStore";
import bgMusicUrl from "../assets/solar-system-space-journey-153272.mp3";

/**
 * BackgroundMusic - Plays looping background music for the solar system
 *
 * Features:
 * - Auto-play on mount (with user interaction fallback)
 * - Infinite loop
 * - Volume control
 * - Toggle on/off via store
 */
export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasTriedAutoplayRef = useRef(false);
  const musicEnabled = useStore((state) => state.musicEnabled);

  /** Initialize audio element once */
  useEffect(() => {
    const audio = new Audio(bgMusicUrl);
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  /** Handle play/pause based on musicEnabled state */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (musicEnabled) {
      /** Try to play */
      const attemptPlay = async () => {
        try {
          await audio.play();
          hasTriedAutoplayRef.current = true;
        } catch (error) {
          /** Autoplay blocked - will try on next user interaction */
          if (!hasTriedAutoplayRef.current) {
            console.log("Autoplay blocked. Music will start on user interaction.");
            hasTriedAutoplayRef.current = true;
          }
        }
      };

      attemptPlay();
    } else {
      /** Pause the audio */
      if (!audio.paused) {
        audio.pause();
      }
    }
  }, [musicEnabled]);

  /** No UI needed - audio plays in background */
  return null;
}
