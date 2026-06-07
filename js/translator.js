const translateBtn = document.getElementById("translateBtn");
const translatorInput = document.getElementById("translatorInput");
const translationResult = document.getElementById("translationResult");

if (translateBtn && translatorInput && translationResult) {
  const meowSounds = [
    "meow_sounds/soundzee-cat-meow-361882.mp3",
    "meow_sounds/sound_garage-cat-meow-13-fx-306192.mp3",
    "meow_sounds/ribhavagrawal-cat-meow-type-02-293290.mp3",
    "meow_sounds/freesound_community-cat-meow-99835.mp3",
    "meow_sounds/freesound_community-meow-39411.mp3",
    "meow_sounds/soulfuljamtracks-cat-meow-2-fx-323466.mp3",
    "meow_sounds/dragon-studio-kitten-sfx-405457.mp3",
    "meow_sounds/freesound_community-cat-purring-and-meow-5928.mp3",
    "meow_sounds/sound_garage-cat-meow-15-fx-306190.mp3",
    "meow_sounds/sound_garage-cat-meow-4-fx-306180.mp3",
    "meow_sounds/sound_garage-cat-meow-12-fx-306191.mp3",
    "meow_sounds/soulfuljamtracks-cat-meow-1-fx-323465.mp3",
    "meow_sounds/sound_garage-cat-meow-3-fx-306179.mp3",
    "meow_sounds/sound_garage-cat-meow-14-fx-306189.mp3",
    "meow_sounds/freesound_community-angry-cat-meow-82091.mp3",
    "meow_sounds/sound_garage-cat-meow-9-fx-306185.mp3",
    "meow_sounds/freesound_community-cat-meow-81626.mp3",
    "meow_sounds/sound_garage-cat-meow-1-fx-306178.mp3",
    "meow_sounds/scottishperson-sound-effect-cat-meow-279336.mp3",
    "meow_sounds/dragon-studio-cartoon-cat-meow-487661.mp3",
    "meow_sounds/sound_garage-cat-meow-7-fx-306186.mp3",
    "meow_sounds/u_6ekfl947a2-cat-meow-297927.mp3",
    "meow_sounds/dragon-studio-cartoon-kitten-meow-487668.mp3",
    "meow_sounds/freesound_community-cat-meow-85175.mp3",
    "meow_sounds/dragon-studio-meow-sfx-405456.mp3",
    "meow_sounds/dragon-studio-cute-cat-meow-472372.mp3",
    "meow_sounds/dragon-studio-cat-meow-401729.mp3",
  ];

  const performTranslation = () => {
    const text = translatorInput.value;
    if (!text) {
      translationResult.textContent = "Please enter some text first!";
      return;
    }
    const meowText = text
      .replace(/[aeiou]/gi, "meow ")
      .replace(/[^a-zA-Z ]/g, "") + " ...meow?";
    translationResult.textContent = meowText;

    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
    }
    const soundIndex = Math.abs(hash) % meowSounds.length;
    const randomSound = meowSounds[soundIndex];
    const audio = new Audio(randomSound);
    audio.play().catch(e => console.log("Audio play failed:", e));
  };

  translateBtn.addEventListener("click", performTranslation);

  translatorInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      performTranslation();
    }
  });
}
