import Vue from 'vue';
import vsLoading from './index.vue';

const loadingConstructor = Vue.extend(vsLoading);

export default {
  name: 'loading',
  vsfunction(parameters, parent) {
    const instance = new loadingConstructor({ propsData: parameters, parent });
    let containerx = document.body;
    if (parameters.container) {
      containerx = parameters.container instanceof Element ? parameters.container : document.querySelector(parameters.container);
    }
    instance.vm = instance.$mount();
    containerx.insertBefore(instance.vm.$el, containerx.firstChild);
  },
  close(elx) {
    let loadings;

    if (elx instanceof Element) {
      // Mimicking the behavior of doing `elx.querySelectorAll('> con-vs-loading')` but `>` is not well supported.
      // We are doing this because we can only add the respective classes to .con-vs-loading
      loadings = Array.from(elx.children).filter(el => el.classList.contains('con-vs-loading'));
    } else {
      loadings = document.querySelectorAll(elx || 'body > .con-vs-loading');
    }

    loadings
      .forEach((loading) => {
        loading.classList.add('beforeRemove');
        setTimeout(() => {
          loading.remove();
        }, 300);
      });
  },
};
