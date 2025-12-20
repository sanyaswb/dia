/**
 * SmartLoader v9.5 (Instant Load)
 * * -------------------------------------------------------------------------
 * ІНСТРУКЦІЯ: ЯК НАЛАШТУВАТИ PARCEL
 * -------------------------------------------------------------------------
 * 1. npm install -D parcel-reporter-static-files-copy
 * 2. .parcelrc: { "extends": "@parcel/config-default", "reporters": ["...", "parcel-reporter-static-files-copy"] }
 * 3. package.json: "staticFiles": { "staticPath": "src/images", "staticOutDir": "images" }
 * 4. npm start
 * -------------------------------------------------------------------------
 */

// (CONFIG)
const APP_CONFIG = {
  USE_PARCEL: true, // true -> dist (Parcel), false -> src (Live Server)

  PATHS: {
    parcel: "./",
    vanilla: "/src/images/",
  },

  FORCE_WEBP_LOW_RES: true,

  UI: {
    ENABLE_BLUR: false, // true: увімкнути розмиття, false: вимкнути (буде просто скелетон -> чітка картинка)
    SKELETON: {
      BASE_COLOR: "#e0e0e0",
      SHIMMER_COLOR: "rgba(111, 111, 111, 0.5)",
    },
  },
};

class SmartLoader {
  constructor() {
    this.basePath = APP_CONFIG.USE_PARCEL
      ? APP_CONFIG.PATHS.parcel
      : APP_CONFIG.PATHS.vanilla;

    this.forceWebpLowRes = APP_CONFIG.FORCE_WEBP_LOW_RES;
    this.tasks = [];

    this._injectStyles();

    console.log(
      `🔧 SmartLoader v9.4 (Instant). Mode: ${
        APP_CONFIG.USE_PARCEL ? "Parcel" : "Vanilla"
      }`
    );
  }

  _injectStyles() {
    const styleId = "smart-loader-styles";
    if (document.getElementById(styleId)) return;

    const { BASE_COLOR, SHIMMER_COLOR } = APP_CONFIG.UI.SKELETON;
    const blurAmount = APP_CONFIG.UI.ENABLE_BLUR ? "3px" : "0";

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      @keyframes smart-shimmer {
        0% { background-position: -100% 0; }
        100% { background-position: 200% 0; }
      }

      [data-image]:not(.smart-loaded):not(.is-blur) {
        background-color: ${BASE_COLOR};
        background-image: linear-gradient(90deg, rgba(255,255,255,0) 0, ${SHIMMER_COLOR} 50%, rgba(255,255,255,0) 100%);
        background-size: 200% 100%;
        background-repeat: no-repeat;
        animation: smart-shimmer 1.5s infinite linear;
        min-height: 50px; 
        display: block; 
      }
      
      img[data-image]:not(.smart-loaded) {
        object-position: -99999px 99999px; 
        color: transparent;
      }

      /* Стилі після завантаження */
      .smart-loaded {
        background-color: transparent !important;
        animation: none !important;
        min-height: auto;
      }
    `;
    document.head.appendChild(style);
  }

  scanDOM() {
    const elements = document.querySelectorAll("[data-image]");
    if (elements.length === 0) return false;

    this.tasks = Array.from(elements).map((el) => {
      if (el.tagName === "IMG" && !el.getAttribute("src")) {
        el.src =
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
      }

      const relativePath = el.dataset.image;
      const highPath = `${this.basePath}${relativePath}`;

      let lowPath = null;
      if (!relativePath.toLowerCase().endsWith(".svg")) {
        const lastDotIndex = relativePath.lastIndexOf(".");
        let namePart =
          lastDotIndex === -1
            ? relativePath
            : relativePath.substring(0, lastDotIndex);
        const extPart =
          lastDotIndex !== -1 ? relativePath.substring(lastDotIndex) : "";

        if (this.forceWebpLowRes) {
          lowPath = `${this.basePath}${namePart}--low.webp`;
        } else {
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
        if (task.type === "img") {
          task.element.src = task.lowPath;
          task.element.style.backgroundImage = `url('${task.lowPath}')`;
          task.element.style.backgroundSize = "cover";
          task.element.style.backgroundPosition = "center";
        } else {
          task.element.style.backgroundImage = `url('${task.lowPath}')`;
        }

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
          if (task.type === "img") {
            task.element.src = task.highPath;
          } else {
            task.element.style.backgroundImage = `url('${task.highPath}'), url('${task.lowPath}')`;
          }

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
