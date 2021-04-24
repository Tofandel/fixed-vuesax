import hasFlag from './hasFlag';

const sorted = 1;
const optional = 2;

export const Sorted = sorted;
export const Optional = optional;

export default (parentItemName, flags = 0, prop = 'parent') => {
  const mixin = {
    inject: { [prop]: { from: parentItemName, default: false } },
    created() {
      if (!this[prop]) {
        if (!hasFlag(flags, optional)) {
          this.$destroy();
          throw new Error('You should wrap ' + this.$options.name + ' in a ' + parentItemName);
        }
      } else if (this[prop]._registerItem) {
        this[prop]._registerItem(this);
      }
      console.log(this[prop].childItems);
    },
    beforeDestroy() {
      if (this[prop] && this[prop]._unregisterItem) {
        this[prop]._unregisterItem(this);
      }
      console.log(this[prop].childItems);
    },
  };
  if (hasFlag(flags, sorted)) {
    mixin.data = () => {
      return {
        index: null,
      };
    };
  }
  return mixin;
};
