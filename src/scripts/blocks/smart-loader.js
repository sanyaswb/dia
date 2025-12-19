const APP_CONFIG = {
  // true  -> Режим Parcel (файли беруться зі збірки dist)
  // false -> Режим Live Server (файли беруться напряму з src)
  USE_PARCEL: true,

  PATHS: {
    // Шлях, якщо використовується Parcel.
    // Якщо staticOutDir: "images" -> ставте '/images/'
    // Якщо файли копіюються в корінь dist -> ставте './'
    parcel: "./",

    // Шлях для звичайної розробки (Live Server)
    vanilla: "/src/images/",
  },

  // НАЛАШТУВАННЯ РОЗШИРЕНЬ
  // false: Low-Res матиме те саме розширення, що й оригінал (img.jpg -> img--low.jpg)
  // true:  Low-Res завжди буде .webp (img.jpg -> img--low.webp)
  FORCE_WEBP_LOW_RES: true,
};

class SmartLoader {
  constructor() {
    this.basePath = APP_CONFIG.USE_PARCEL
      ? APP_CONFIG.PATHS.parcel
      : APP_CONFIG.PATHS.vanilla;

    this.forceWebpLowRes = APP_CONFIG.FORCE_WEBP_LOW_RES;
    this.tasks = [];

    console.log(
      `🔧 SmartLoader v8.0. Mode: ${
        APP_CONFIG.USE_PARCEL ? "Parcel" : "Vanilla"
      }`
    );
    console.log(`📂 Base Path: "${this.basePath}"`);
  }

  scanDOM() {
    const elements = document.querySelectorAll("[data-image]");
    if (elements.length === 0) return false;

    this.tasks = Array.from(elements).map((el) => {
      const relativePath = el.dataset.image;

      const highPath = `${this.basePath}${relativePath}`;

      let lowPath = null;
      if (!relativePath.toLowerCase().endsWith(".svg")) {
        const lastDotIndex = relativePath.lastIndexOf(".");

        let namePart;

        if (lastDotIndex === -1) {
          namePart = relativePath;
        } else {
          namePart = relativePath.substring(0, lastDotIndex);
        }

        if (this.forceWebpLowRes) {
          lowPath = `${this.basePath}${namePart}--low.webp`;
        } else {
          const extPart =
            lastDotIndex !== -1 ? relativePath.substring(lastDotIndex) : "";
          lowPath = `${this.basePath}${namePart}--low${extPart}`;
        }
      }

      return {
        element: el,
        highPath: highPath,
        lowPath: lowPath,
        type: el.tagName === "IMG" ? "img" : "bg",
        originalName: relativePath,
        isSvg: relativePath.toLowerCase().endsWith(".svg"),
      };
    });

    return true;
  }

  async applyLowRes() {
    const promises = this.tasks.map(async (task) => {
      if (task.isSvg || !task.lowPath) return;

      const exists = await this._checkImage(task.lowPath);

      if (exists) {
        this._applyImage(task, task.lowPath);
        task.element.classList.add("is-blur");
      }
    });

    await Promise.all(promises);
  }

  async loadHighRes() {
    const promises = this.tasks.map((task) => this._preloadSingleImage(task));
    await Promise.all(promises);
    console.log("🎉 SmartLoader: Всі зображення завантажено.");
  }

  _preloadSingleImage(task) {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = task.highPath;

      img
        .decode()
        .then(() => {
          this._applyImage(task, task.highPath);
          task.element.classList.remove("is-blur");
          task.element.classList.add("smart-loaded");
          task.element.removeAttribute("data-image");
          resolve();
        })
        .catch(() => {
          console.warn(
            `❌ SmartLoader: Не вдалося завантажити оригінал: ${task.highPath}`
          );
          resolve();
        });
    });
  }

  _applyImage(task, src) {
    if (task.type === "img") {
      task.element.src = src;
    } else {
      task.element.style.backgroundImage = `url('${src}')`;
    }
  }

  _checkImage(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });
  }

  async run() {
    if (!this.scanDOM()) return;
    await this.applyLowRes();
    await this.loadHighRes();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const loader = new SmartLoader();
  loader.run();
});
