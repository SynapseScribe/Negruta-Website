const translateBtn = document.getElementById("translateBtn");
const translatorInput = document.getElementById("translatorInput");
const translationResult = document.getElementById("translationResult");

if (translateBtn && translatorInput && translationResult) {
  fetch("assets/lists/meow-sounds.json")
    .then(response => response.json())
    .then(meowSounds => {
      const hashStr = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
        }
        return Math.abs(hash) % meowSounds.length;
      };

      const performTranslation = () => {
        const text = translatorInput.value.trim();
        if (!text) {
          translationResult.textContent = "Please enter some text first!";
          return;
        }

        const words = text.split(/\s+/).filter(w => /[a-zA-Z\u00C0-\u024F]/.test(w));
        const wordCount = words.length;

        const lastChar = text.slice(-1);
        const punctuation = ["!", "?", "."].includes(lastChar) ? lastChar : ".";
        translationResult.textContent = "meow ".repeat(wordCount - 1).trim() + "...meow" + punctuation;

        const playNext = (index) => {
          if (index >= wordCount) return;
          const soundIndex = hashStr(words[index]);
          const audio = new Audio(meowSounds[soundIndex]);
          audio.play().catch(e => console.log("Audio play failed:", e));
          audio.addEventListener("ended", () => playNext(index + 1));
        };

        playNext(0);
      };

      translateBtn.addEventListener("click", performTranslation);

      translatorInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          performTranslation();
        }
      });
    })
    .catch(error => console.error("Failed to load meow sounds:", error));
}
