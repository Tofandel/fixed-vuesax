const stringColors = { black: '#000', white: '#fff' };
const vscolors = ['primary', 'success', 'danger', 'warning', 'dark', 'light'];

export default {
  darken(color, percent) {
    var f = color.split(','); var t = percent < 0 ? 0 : 255; var p = percent < 0 ? percent * -1 : percent; var R = parseInt(f[0].slice(4)); var G = parseInt(f[1]); var B = parseInt(f[2]);
    return 'rgb(' + (Math.round((t - R) * p) + R) + ',' + (Math.round((t - G) * p) + G) + ',' + (Math.round((t - B) * p) + B) + ')';
  },
  getColor(colorx, alphax = 1, defaultx = true) {
    // change color hex to RGB
    if (typeof colorx !== 'string') { return null; }

    if (/^[#]/.test(colorx)) {
      const c = this.hexToRgb(colorx);

      if (!alphax) {
        colorx = `rgb(${c.r},${c.g},${c.b})`;
      } else {
        colorx = `rgba(${c.r},${c.g},${c.b},${alphax})`;
      }
    } else if (/^rgba/.test(colorx)) {
      if (colorx.search(/.([0-9]\))$/) === -1 && !defaultx) {
        colorx = colorx.replace(/.?([0-9]\))$/, `${alphax})`);
      }
    } else if (/^(rgb)/.test(colorx)) {
    // change rgb and rgba
      if (!alphax) {
        colorx = colorx.replace(/^(rgb)/, 'rgba');
        colorx = colorx.replace(/\)$/, `,${alphax})`);
      }
    } else if (this.isColor(colorx)) {
      return this.rColor(colorx, alphax);
    }
    return colorx;
  },
  isColor(colorx) {
    return colorx in stringColors || vscolors.includes(colorx);
  },
  RandomColor() {
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }
    return `rgb(${getRandomInt(0, 255)},${getRandomInt(0, 255)},${getRandomInt(0, 255)})`;
  },
  rColor(colorx, opacity = 1) {
    if (/^[#]/.test(colorx)) {
      const c = this.hexToRgb(colorx);
      colorx = `rgba(${c.r},${c.g},${c.b},${opacity})`;
    } else if (/^[rgb]/.test(colorx)) {
      let colorSplit = colorx.split(')')[0];
      if (!/^[rgba]/.test(colorx)) {
        colorSplit.replace('rgb', 'rgba');
        colorSplit += `,${opacity})`;
      } else {
        // colorSplit.replace('rgb','rgba')
        colorSplit += ')';
      }
      colorx = colorSplit;
    }

    if (colorx in stringColors) {
      colorx = stringColors[colorx];
    }

    if (colorx) {
      if (/[#()]/.test(colorx)) {
        return colorx;
      } else {
        if (vscolors.includes(colorx)) {
          return `rgba(var(--vs-${colorx}),${opacity})`;
        } else {
          return `rgba(var(--vs-primary),${opacity})`;
        }
      }
    } else {
      return `rgba(var(--vs-primary),${opacity})`;
    }
  },
  contrastColor(elementx) {
    let c = elementx;
    if (!c) {
      return '#fff';
    }
    if (/^[#]/.test(c)) {
      const rgbx = this.hexToRgb(c);
      c = `rgb(${rgbx.r},${rgbx.g},${rgbx.b})`;
    }
    const match = c.match(/rgba?\(var\(--vs-([^)]*)/);
    if (match) {
      c = `rgb(${this.getVariable(match[1])})`;
    }
    var rgb = c.replace(/^(rgb|rgba)\(/, '').replace(/\)$/, '').replace(/\s/g, '').split(',');
    const r = rgb[0] / 255;
    const g = rgb[1] / 255;
    const b = rgb[2] / 255;

    var yiq = (r * r * 0.2126) + (g * g * 0.7152) + (b * b * 0.0722);
    if (yiq > 0.51) {
      return '#000';
    } else {
      return '#fff';
    }
  },
  setCssVariable(propertyName, value) {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--vs-' + propertyName, value);
    }
  },
  hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null;
  },
  getVariable(propertyName) {
    if (typeof window !== 'undefined') {
      return document.documentElement.style.getPropertyValue('--vs-' + propertyName).trim();
    }
  },
};
