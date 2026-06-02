export default {
  insertBody(elx, parent = null, prepend = false) {
    if (Array.isArray(parent)) {
      parent.forEach((par) => this.insertBody(elx, par, prepend));
      return;
    }
    if (typeof parent === 'string') {
      parent = document.querySelector(parent);
    } else if (parent && !(parent instanceof Node)) {
      parent = parent.$el;
    }
    if (!elx) {
      return;
    }
    elx = elx instanceof Node ? elx : elx.$el;
    if (!elx) {
      return;
    }
    const bodyx = parent || document.body;
    if (prepend === true) {
      bodyx.prepend(elx);
    } else {
      if (typeof prepend === 'string') {
        bodyx.classList.add(prepend);
      }
      bodyx.appendChild(elx);
    }
  },
  removeBody(elx, parent = null, containerClass = null) {
    if (Array.isArray(parent)) {
      parent.forEach((par) => this.removeBody(elx, par));
      return;
    }
    if (typeof parent === 'string') {
      parent = document.querySelector(parent);
    } else if (parent && !(parent instanceof Node)) {
      parent = parent.$el;
    }
    if (!elx) {
      return;
    }
    elx = elx instanceof Node ? elx : elx.$el;
    if (!elx) {
      return;
    }
    const bodyx = parent || document.body;
    try {
      if (containerClass) {
        bodyx.classList.remove(containerClass);
      }
      bodyx.removeChild(elx);
    } catch (e) {
      // Already removed so ignore
    }
  },
};
