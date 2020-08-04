import * as vsComponents from './components';
import './style/vuesax.styl';
import vsTheme from './utils/theme.js';
import DefineVuesaxMixin from './defineGlobalMixin';
import vuesaxOptions from './utils/options';

const install = (Vue, options = {}) => {
  // set default options
  for (const prop in vuesaxOptions) {
    if (!options[prop]) {
      options[prop] = vuesaxOptions[prop];
    }
  }
  // Use Components
  Object.values(vsComponents).forEach((vsComponent) => {
    Vue.use(vsComponent);
  });
  if (options) {
    if (options.hasOwnProperty('theme')) {
      if (options.theme.hasOwnProperty('colors')) {
        if (typeof window !== 'undefined') {
          vsTheme.vsfunction(options.theme.colors, options.server);
        }
      }
    }
  }
  // Define vuesax functions and properties ($vs)
  DefineVuesaxMixin(Vue, options);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default install;

export * from './components';
