<template>
  <div class="min-h-screen flex flex-col">
    <NavBar />
    <Sidebar v-if="isSidebarVisible" class="sidebar" />
    <div :style="{ marginLeft: isSidebarVisible ? sidebarWidth : '0' }" class="content flex-grow p-2 md:mt-12 mt-24">
      <router-view />
    </div>
    <FancyFooter />
  </div>
</template>

<script>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import Sidebar from '@/components/SideBar/Sidebar.vue';
import NavBar from '@/components/NavBar/NavBar.vue';
import FancyFooter from '@/components/Footer/Footer.vue';
import { sidebarWidth } from '@/components/SideBar/state';
import { useRouter } from 'vue-router';

export default {
  components: { Sidebar, NavBar, FancyFooter },
  setup() {
    const isSidebarVisible = ref(true);
    const currentRoute = ref('');
    const windowWidth = ref(window.innerWidth);
    const router = useRouter();

    const updateSidebarVisibility = () => {
      isSidebarVisible.value = windowWidth.value >= 769 && currentRoute.value.startsWith('/admin');
    };

    watch(
      () => router.currentRoute.value.path,
      (newRoute) => {
        currentRoute.value = newRoute;
        updateSidebarVisibility();
      },
      { immediate: true }
    );

    const onResize = () => {
      windowWidth.value = window.innerWidth;
      updateSidebarVisibility();
    };

    onMounted(() => {
      window.addEventListener('resize', onResize);
      updateSidebarVisibility();
    });

    onUnmounted(() => {
      window.removeEventListener('resize', onResize);
    });

    return { sidebarWidth, isSidebarVisible, currentRoute };
  },
};
</script>

<style>
body {
  margin: 0;
  min-height: 100vh;
}

.content {
  transition: margin-left 0.3s ease;
}

@media (max-width: 769px) {
  .sidebar {
    display: none;
  }
}
</style>
