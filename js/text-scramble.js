/* text-scramble.js — Hero text scramble reveal effect */

class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&';
    this._raf = null;
  }

  setText(text, duration = 1800) {
    return new Promise(resolve => {
      const len = text.length;
      const totalFrames = Math.ceil(duration / 16);
      let frame = 0;
      cancelAnimationFrame(this._raf);

      const update = () => {
        const progress = Math.min(frame / totalFrames, 1);
        const locked = Math.floor(this._easeOut(progress) * len);
        let out = '';
        for (let i = 0; i < len; i++) {
          if (i < locked) {
            out += text[i];
          } else {
            out += this.chars[Math.floor(Math.random() * this.chars.length)];
          }
        }
        this.el.textContent = out;
        if (progress < 1) {
          frame++;
          this._raf = requestAnimationFrame(update);
        } else {
          this.el.textContent = text;
          resolve();
        }
      };

      this._raf = requestAnimationFrame(update);
    });
  }

  _easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }
}
