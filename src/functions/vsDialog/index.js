import Vue from 'vue';
import vsPopup from '../../components/vsPopup/vsPopup';

const dialogConstructor = Vue.extend(vsPopup);

let instance;

export default {
  name: 'dialog',
  vsfunction(props, parent) {
    return new Promise((resolve) => {
      instance = new dialogConstructor({
        propsData: { ...props, prompt: true },
        parent,
      });

      instance.vm = instance.$mount();

      instance.vm.$on('accept', () => {
        resolve(true);
        if (props.accept) {
          props.accept();
        }
      });
      instance.vm.$on('cancel', () => {
        resolve(false);
        if (props.cancel) {
          props.cancel();
        }
      });
    });
  },

};
