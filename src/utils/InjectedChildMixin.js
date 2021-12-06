import hasFlag from './hasFlag';

const sorted = 1;
const optional = 2;
const noRegister = 4;

export const Sorted = sorted;
export const Optional = optional;
export const NoRegister = noRegister;

export default (parentItemName, flags = 0, prop = 'parent') => {
  const mixin = {
    inject: { [prop]: { from: parentItemName, default: false } },
    created() {
      if (!this[prop]) {
        if (!hasFlag(flags, optional)) {
          this.$destroy();
          throw new Error('You should wrap ' + this.$options.name + ' in a ' + parentItemName);
        }
      } else if (!hasFlag(flags, noRegister) && this[prop]._registerItem) {
        this[prop]._registerItem(this);
      }
    },
    activated() {
      if (!hasFlag(flags, noRegister) && this[prop]._registerItem) {
        this[prop]._registerItem(this);
      }
    },
    deactivated() {
      if (hasFlag(flags, noRegister) && this[prop] && this[prop]._unregisterItem) {
        this[prop]._unregisterItem(this);
      }
    },
    beforeDestroy() {
      if (hasFlag(flags, noRegister) && this[prop] && this[prop]._unregisterItem) {
        this[prop]._unregisterItem(this);
      }
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
