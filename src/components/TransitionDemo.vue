<template>
  <div id="demo">
    <button data-test="show-button" @click="show">Show</button>
    <button data-test="close-button" @click="close">Close</button>
    <div class="backdrop"
      :class="{ 'backdrop--show': backdropState.showBackdrop, 'backdrop--transition': backdropState.useTransition }"
      :style="backdropState.styles" @click="close"></div>
    <transition :name="transitionName" @after-enter="afterTransitionEnter" @after-leave="afterTransitionLeave">
      <div v-if="showSlide" class="container" ref="containerRef">
        <div class="header" ref="headerRef">
          HEADER (Drag to Resize)
        </div>
        <div class="container-body" :class="{ 'container-body--scrollable': containerBodyScrollable }">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, eius.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, eius.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, eius.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, eius.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, eius.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, eius.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, eius.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, eius.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, eius.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, eius.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, eius.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, eius.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, eius.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, eius.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, eius.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, eius.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, eius.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, eius.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, eius.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, eius.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, eius.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, eius.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, eius.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, eius.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, eius.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, eius.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, eius.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, eius.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, eius.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, eius.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, eius.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, eius.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, eius.
          END
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, type Ref, reactive, onBeforeUnmount } from 'vue';

export default defineComponent({
  setup() {
    const transitionName: Ref<string> = ref('slide-up');
    const showSlide: Ref<boolean> = ref(false);
    const containerBodyScrollable: Ref<boolean> = ref(false)

    const containerRef: Ref<null | HTMLDivElement> = ref(null);
    const headerRef: Ref<null | HTMLDivElement> = ref(null);

    const MAX_HEIGHT = window.innerHeight - 85
    const INITIAL_HEIGHT = 400
    const HEADER = "header"

    const backdropState: {
      showBackdrop: boolean;
      useTransition: boolean;
      styles: Record<string, string>;
    } = reactive({
      showBackdrop: false,
      useTransition: false,
      styles: {}
    });

    const touchState = reactive({
      startY: 0,
      startHeight: 0,
    });

    const runBackdrop = (show: boolean = false, transition: boolean, forHeight?: number) => {
      backdropState.showBackdrop = show
      backdropState.useTransition = transition

      if (!show) {
        backdropState.styles = {}
        return
      }

      const opacity = calcBackdropOpacity(forHeight)
      backdropState.styles.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
    }

    const show = () => {
      if (showSlide.value) { return }

      showSlide.value = true
      runBackdrop(true, true, INITIAL_HEIGHT)
    };

    const close = () => {
      showSlide.value = false
      containerBodyScrollable.value = false
      runBackdrop(true, true, 0)
    }

    const afterTransitionEnter = (el: Element) => {
      registerEventListeners()
    };

    const afterTransitionLeave = (el: Element) => {
      runBackdrop(false, false)
      unregisterEventListeners()
    };

    const onTouchStart = (event: TouchEvent) => {
      if ((event.currentTarget as HTMLElement).className === HEADER) {
        event.stopPropagation()
      }

      touchState.startY = event.touches[0].clientY;
      touchState.startHeight = containerRef.value?.clientHeight || 0;
    };

    const onTouchMove = (event: TouchEvent) => {
      const currentTargetClass = (event.currentTarget as HTMLElement).className

      if (currentTargetClass === HEADER) {
        event.stopPropagation()
      } else {
        return
      }

      const deltaY = event.touches[0].clientY - touchState.startY;
      const newHeight = touchState.startHeight - deltaY;

      if (newHeight <= MAX_HEIGHT) {
        containerRef.value!.style.height = newHeight + 'px';
        runBackdrop(true, false)
      }
    };

    const onTouchEnd = (event: TouchEvent) => {
      if ((event.currentTarget as HTMLElement).className === HEADER) {
        event.stopPropagation()
      }

      const deltaY = touchState.startY - event.changedTouches[0].clientY;
      if (deltaY > 50) {
        containerRef.value!.style.height = MAX_HEIGHT + 'px';
        runBackdrop(true, true)
        containerBodyScrollable.value = true
      }
    };

    const calcBackdropOpacity = (height: number = containerRef.value?.clientHeight || 0): number => {
      const heightsRatio = height / MAX_HEIGHT;
      const opacity = 0.85 * heightsRatio
      return opacity
    }

    const registerEventListeners = () => {
      unregisterEventListeners()
      ;[containerRef.value, headerRef.value].forEach(el => {
        el?.addEventListener('touchstart', onTouchStart);
        el?.addEventListener('touchmove', onTouchMove);
        el?.addEventListener('touchend', onTouchEnd);
      })
    };

    const unregisterEventListeners = () => {
      [containerRef.value, headerRef.value].forEach(el => {
        el?.removeEventListener('touchstart', onTouchStart);
        el?.removeEventListener('touchmove', onTouchMove);
        el?.removeEventListener('touchend', onTouchEnd);
      })
    };

    onBeforeUnmount(() => {
      unregisterEventListeners()
    })

    return {
      transitionName,
      afterTransitionEnter, afterTransitionLeave,
      showSlide, backdropState,
      show, close,
      containerRef,
      headerRef,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      containerBodyScrollable
    };
  },
});
</script>

<style scoped>
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
}

#demo {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
}

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  background-color: rgba(0, 0, 0, 0);
  z-index: -1;
}

.backdrop--show {
  width: 100%;
  height: 100%;
}

.backdrop--transition {
  transition: background-color .3s ease-in-out
}

.container {
  position: fixed;
  width: 100%;
  height: 400px;
  background-color: skyblue;
  color: darkblue;
  bottom: 0;
  left: 0;
  max-height: calc(100% - 85px);
}

.header {
  height: 80px;
  background-color: darkblue;
  color: skyblue;
}

.container-body {
  height: calc(100% - 80px);
}

.container-body--scrollable {
  overflow-y: auto;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform .3s ease-in-out;
}

.slide-up-enter-active {
  transform: translateY(100%);
}

.slide-up-enter-to {
  transform: translateY(0%);
}

.slide-up-leave-active {
  transform: translateY(0%);
}

.slide-up-leave-to {
  transform: translateY(100%);
}
</style>


