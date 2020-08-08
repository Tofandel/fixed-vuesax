export default {
  insertBody(elx, parent) {
    elx = elx instanceof Node ? elx : elx.$el;
    const bodyx = parent || document.body;
    bodyx.appendChild(elx);
  },
  removeBody(elx, parent) {
    elx = elx instanceof Node ? elx : elx.$el;
    const bodyx = parent || document.body;
    bodyx.removeChild(elx);
  },
};
