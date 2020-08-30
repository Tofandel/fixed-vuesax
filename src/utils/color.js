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
    if (/[#]/g.test(elementx)) {
      const rgbx = this.hexToRgb(elementx);
      c = `rgb(${rgbx.r},${rgbx.g},${rgbx.b})`;
    }
    if (!c) {
      return '#fff';
    }
    var rgb = c.replace(/^(rgb|rgba)\(/, '').replace(/\)$/, '').replace(/\s/g, '').split(',');
    var yiq = ((rgb[0] * 299) + (rgb[1] * 587) + (rgb[2] * 114)) / 1000;
    if (yiq > 128) {
      return '#000';
    } else {
      return '#fff';
    }
  },
  setCssVariable(propertyName, value) {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty(propertyName, value);
    }
  },
  hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null;
  },
  getVariable(styles, propertyName) {
    return String(styles.getPropertyValue(propertyName)).trim();
  },
};
