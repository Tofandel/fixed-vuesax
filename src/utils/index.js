export default {
  insertBody(elx, parent) {
    if (typeof parent === 'string') {
      parent = document.querySelector(parent);
    }
    elx = elx instanceof Node ? elx : elx.$el;
    const bodyx = parent || document.body;
    bodyx.appendChild(elx);
  },
  removeBody(elx, parent) {
    if (typeof parent === 'string') {
      parent = document.querySelector(parent);
    }
    elx = elx instanceof Node ? elx : elx.$el;
    const bodyx = parent || document.body;
    bodyx.removeChild(elx);
  },
};
