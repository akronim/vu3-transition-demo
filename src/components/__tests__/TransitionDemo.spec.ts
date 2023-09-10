import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TransitionDemo from '../TransitionDemo.vue'
import { nextTick } from 'vue';

describe('TransitionDemo', () => {
  it('renders correctly when showSlide is true', async () => {
    const wrapper = mount(TransitionDemo);

    await wrapper.find('button[data-test="show-button"]').trigger('click');
    expect(wrapper.find('.container').isVisible()).toBe(true);
  });

  it('closes the component correctly when "Close" is clicked', async () => {
    const wrapper = mount(TransitionDemo);

    await wrapper.find('button[data-test="show-button"]').trigger('click');
    await wrapper.find('button[data-test="close-button"]').trigger('click');
    expect(wrapper.find('.container').exists()).toBe(false);
  });

  it('registers event listeners when "Show" button is clicked', async () => {
    const wrapper = mount(TransitionDemo);

    await wrapper.find('button[data-test="show-button"]').trigger('click');

    const containerRef = wrapper.vm.$refs.containerRef;
    const headerRef = wrapper.vm.$refs.headerRef;

    const containerElement = containerRef as HTMLElement;
    const headerElement = headerRef as HTMLElement;

    const containerSpy = vi.spyOn(containerElement, 'addEventListener');
    const headerSpy = vi.spyOn(headerElement, 'addEventListener');

    wrapper.vm.afterTransitionEnter(document.createElement('div'))

    expect(containerSpy).toHaveBeenCalledTimes(3);
    expect(headerSpy).toHaveBeenCalledTimes(3);

    ['touchstart', 'touchmove', 'touchend'].forEach(eventName => {
      expect(containerSpy).toHaveBeenCalledWith(eventName, expect.any(Function));
      expect(headerSpy).toHaveBeenCalledWith(eventName, expect.any(Function));
    });

    containerSpy.mockRestore();
    headerSpy.mockRestore();
  });

  it('unregisters event listeners when component is destroyed', async () => {
    const wrapper = mount(TransitionDemo);

    await wrapper.find('button[data-test="show-button"]').trigger('click');

    const containerRef = wrapper.vm.$refs.containerRef;
    const headerRef = wrapper.vm.$refs.headerRef;

    const containerElement = containerRef as HTMLElement;
    const headerElement = headerRef as HTMLElement;

    const containerSpy = vi.spyOn(containerElement, 'removeEventListener');
    const headerSpy = vi.spyOn(headerElement, 'removeEventListener');

    wrapper.unmount();

    expect(containerSpy).toHaveBeenCalledTimes(3);
    expect(headerSpy).toHaveBeenCalledTimes(3);

    ['touchstart', 'touchmove', 'touchend'].forEach(eventName => {
      expect(containerSpy).toHaveBeenCalledWith(eventName, expect.any(Function));
      expect(headerSpy).toHaveBeenCalledWith(eventName, expect.any(Function));
    });

    containerSpy.mockRestore();
    headerSpy.mockRestore();
  });

  it('closes the backdrop when "Close" button is clicked', async () => {
    const wrapper = mount(TransitionDemo);

    await wrapper.find('button[data-test="show-button"]').trigger('click');
    expect(wrapper.find('.backdrop--show').isVisible()).toBe(true);

    await wrapper.find('button[data-test="close-button"]').trigger('click');
    wrapper.vm.afterTransitionLeave(document.createElement('div'))
    await nextTick()

    expect(wrapper.find('.backdrop--show').exists()).toBe(false);
  });  
});

