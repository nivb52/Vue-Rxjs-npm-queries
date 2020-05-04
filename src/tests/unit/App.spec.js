import { mount } from "@vue/test-utils";
// import { render, Simulate } from '@testing-library/vue';

// import App from '@/src/App.vue';
import App from '../../App.vue';

describe(' App.vue ', () => {
  it('run demo test', () => {
    const demoNumber = 5;
    expect( 0 * demoNumber).toBe(0)
  });

//   it('render component', () => {
//     const wrapper = mount(App);
//     expect(wrapper.element).toMatchSnapshot()
//   });

  // it("initil data.term is null", () => {
  //     const wrapper = mount(App);
  //     expect(warpper.vm.term).toEqual('')
  // // });

  // it("create Toast Error", () => {
  //     const wrapper = mount(App);
  //     expect(warpper.vm.createToast(msg = ' Testing')).toMatchSnapshot()
  // });

});
