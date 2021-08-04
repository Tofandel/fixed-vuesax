const stringColors = { black: '#000', white: '#fff' };
const vscolors = ['primary', 'success', 'danger', 'warning', 'dark', 'light'];

export default {
  darken(color, percent) {
    const f = color.split(',');
    const t = percent < 0 ? 0 : 255;
    const p = percent < 0 ? percent * -1 : percent;
    const R = parseInt(f[0].slice(4));
    const G = parseInt(f[1]);
    const B = parseInt(f[2]);
    return 'rgb(' + (Math.round((t - R) * p) + R) + ',' + (Math.round((t - G) * p) + G) + ',' + (Math.round((t - B) * p) + B) + ')';
  },
  getColor(colorx, alphax = null) {
    // change color hex to RGB
    if (typeof colorx !== 'string') {
      return null;
    }
    const round = (a) => a !== 1 ? Math.round(a * 100) / 100 : 1;

    if (/^[#]/.test(colorx)) {
      const c = this.hexToRgb(colorx);
      alphax = alphax || 1;
      if (c.a !== null) {
        alphax = c.a / 255 * alphax;
      }
      if (alphax === 1) {
        colorx = `rgb(${c.r},${c.g},${c.b})`;
      } else {
        colorx = `rgba(${c.r},${c.g},${c.b},${round(alphax)})`;
      }
    } else if (/^rgba/.test(colorx)) {
      const match = colorx.match(/(\.?\d*)\)$/);
      if (alphax !== null && match) {
        alphax *= parseFloat(match[1]);
        colorx = colorx.replace(/\.?\d*\)$/, `${round(alphax)})`);
      }
    } else if (/^(rgb)/.test(colorx) && alphax < 1 && alphax !== null) {
      // change rgb and rgba
      colorx = colorx.replace(/^(rgb)/, 'rgba');
      colorx = colorx.replace(/\)$/, `,${alphax})`);
    } else if (this.isColor(colorx)) {
      return this.rColor(colorx, alphax || 1);
    }
    return colorx;
  },
  isColor(colorx) {
    return colorx in stringColors || vscolors.includes(colorx);
  },
  rColor(colorx, opacity = 1) {
    if (colorx in stringColors) {
      colorx = stringColors[colorx];
    }

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
    } else if (vscolors.includes(colorx)) {
      colorx = `rgba(var(--vs-${colorx}),${opacity})`;
    } else {
      colorx = `rgba(var(--vs-primary),${opacity})`;
    }
    return colorx;
  },
  contrastColor(elementx) {
    let c = elementx;
    if (!c) {
      return '#fff';
    }
    c = this.getColor(elementx);
    const match = c.match(/rgba?\(var\(--vs-([^)]*)/);
    if (match) {
      c = `rgb(${this.getVariable(match[1])})`;
    }
    const rgb = c.replace(/^(rgb|rgba)\(/, '').replace(/\)$/, '').replace(/\s/g, '').split(',');
    const r = rgb[0] / 255;
    const g = rgb[1] / 255;
    const b = rgb[2] / 255;

    const yiq = (r * r * 0.2126) + (g * g * 0.7152) + (b * b * 0.0722);
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
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
          a: result[4] ? parseInt(result[4], 16) : null,
        }
      : null;
  },
  getVariable(propertyName) {
    if (typeof window !== 'undefined') {
      return document.documentElement.style.getPropertyValue('--vs-' + propertyName).trim();
    }
  },
};
