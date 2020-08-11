import Vue from 'vue';
import vsLoading from './index.vue';

const loadingConstructor = Vue.extend(vsLoading);
let instances = [];

export default {
  name: 'loading',
  vsfunction(props = {}, parent = null) {
    const found = instances.find((i) => {
      return parent === i.container || (parent instanceof Node && parent.isEqualNode(i.container));
    });
    if (found) {
      return found;
    }

    const instance = new loadingConstructor({ propsData: props, parent });
    instance.vm = instance.$mount();
    instance.vm.close = (i) => {
      if (!i) {
        instances.splice(instances.indexOf(instance.vm));
      }
      instance.$destroy();
    };
    instances.push(instance.vm);
    return instance.vm;
  },
  close(elx) {
    if (elx instanceof Node) {
      const instance = instances.find((i) => {
        return elx.isEqualNode(i.container);
      });
      if (instance) {
        instance.close();
      }
    } else {
      instances.forEach((i) => i.close());
      instances = [];
    }
  },
};
