<template>
  <div class="min-h-screen flex flex-col">
    <NavBar />
    <!-- Hapus elemen Sidebar -->
    <div :style="{ marginLeft: 0 }" class="content flex-grow p-2">
      <router-view />
    </div>
    <FancyFooter />
  </div>
</template>

<script>
import { ref, watch, onMounted, onUnmounted } from "vue";
import NavBar from "@/components/NavBar/NavBar.vue";
import FancyFooter from "@/components/Footer/Footer.vue";
import { useRouter } from "vue-router";

export default {
  components: { NavBar, FancyFooter },
  setup() {
    const currentRoute = ref("");
    const windowWidth = ref(window.innerWidth);
    const router = useRouter();

    // Hapus logika sidebar
    return { currentRoute };
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
</style>
