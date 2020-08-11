import Vue from 'vue';
import vsPopup from '../../components/vsPopup/vsPopup';

const dialogConstructor = Vue.extend(vsPopup);

export default {
  name: 'dialog',
  vsfunction(props = {}, parent = null) {
    return new Promise((resolve) => {
      props.prompt = true;
      props.value = true;
      const instance = new dialogConstructor({
        propsData: props,
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
      instance.vm.$on('close', () => {
        props.value = false;
        instance.$nextTick(() => {
          instance.$destroy();
        });
      });
    });
  },

};
