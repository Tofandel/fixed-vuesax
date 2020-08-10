import vsComponent from './vsDropdown';
import vsComponent2 from './vsDropdownMenu';
import vsComponent3 from './vsDropdownItem';
import vsComponent4 from './vsDropdownGroup';

export default Vue => {
  Vue.component(vsComponent.name, vsComponent);
  Vue.component(vsComponent2.name, vsComponent2);
  Vue.component(vsComponent3.name, vsComponent3);
  Vue.component(vsComponent4.name, vsComponent4);
};
