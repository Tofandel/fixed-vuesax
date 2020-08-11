export default {
  insertBody(elx, parent = null, prepend = false) {
    if (typeof parent === 'string') {
      parent = document.querySelector(parent);
    }
    elx = elx instanceof Node ? elx : elx.$el;
    if (!elx) {
      return;
    }
    const bodyx = parent || document.body;
    if (prepend) {
      bodyx.prepend(elx);
    } else {
      bodyx.appendChild(elx);
    }
  },
  removeBody(elx, parent = null) {
    if (typeof parent === 'string') {
      parent = document.querySelector(parent);
    }
    elx = elx instanceof Node ? elx : elx.$el;
    const bodyx = parent || document.body;
    if (!elx) {
      return;
    }
    try {
      bodyx.removeChild(elx);
    } catch (e) {
      // Already removed so ignore
    }
  },
};
