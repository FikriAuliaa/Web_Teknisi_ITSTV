<script>
import SidebarLink from "./SidebarLink.vue";
import { ref } from "vue";
import "primeicons/primeicons.css";

export default {
  components: { SidebarLink },
  setup() {
    const isOpen = ref(false);
    const toggleSidebar = () => {
      isOpen.value = !isOpen.value;
    };
    return { isOpen, toggleSidebar };
  },
};
</script>

<template>
  <div class="fixed h-max w-max cursor-pointer">
    <div class="h-screen w-screen duration-500">
      <div
        class="absolute z-40 h-screen w-screen border border-gray-500 bg-blue-900 p-6 text-gray-200 duration-500 md:w-1/2 lg:w-44"
      >
        <div
          class="min-w-xl z-40 overflow-y-auto overflow-x-hidden text-left text-lg mt-20"
        >
          <SidebarLink to="/admin" icon="pi pi-home">Alat</SidebarLink>
          <SidebarLink to="/admin/all-operator" icon="pi pi-users"
            >Teknisi</SidebarLink
          >
          <SidebarLink to="/admin/summary" icon="pi pi-list-check"
            >Invoice</SidebarLink
          >
        </div>
      </div>
    </div>
  </div>
  <div class="fixed z-[100] h-screen w-max cursor-pointer lg:hidden block">
    <div
      :class="[
        'absolute z-[100] flex flex-col gap-5 rounded-r-lg font-light text-blue-800 duration-500',
        isOpen
          ? 'top-6 ml-6 place-items-center px-2 text-blue-800 md:pt-3'
          : 'top-1/4 bg-gradient-to-l from-blue-900 to-blue-600 pb-4 shadow-xl backdrop-blur-sm md:px-3 md:pb-6 md:pt-3',
      ]"
      @click="toggleSidebar"
    >
      <div>
        <i class="pi pi-bars text-white text-2xl ml-3"></i>
      </div>
      <p class="rotate-90 text-white">{{ isOpen ? "" : "Menu" }}</p>
    </div>

    <div
      :class="['h-screen duration-500', isOpen ? 'h-screen w-screen' : 'w-0']"
    >
      <div
        :class="[
          'absolute top-0 z-40 h-screen w-screen border border-gray-500 bg-opacity-60 bg-gradient-to-l from-blue-900 to-blue-600-to-r  p-10 text-gray-200 duration-500 md:w-1/2 lg:w-1/3',
          isOpen ? 'translate-x-0' : '-translate-x-full md:-translate-x-48',
        ]"
      >
        <div class="z-50 mt-12 py-5 md:mt-24">
          <input
            type="text"
            class="p-2 w-full rounded bg-gray-900 text-blue-800"
            placeholder="Search..."
          />
        </div>
        <div
          class="min-w-xl z-40 h-4/6 overflow-y-auto overflow-x-hidden text-left text-lg"
        >
          <SidebarLink to="/admin" icon="pi pi-home">Alat</SidebarLink>
          <SidebarLink to="/admin/all-operator" icon="pi pi-users"
            >Teknisi</SidebarLink
          >
          <SidebarLink to="/admin/summary" icon="pi pi-list-check"
            >Invoice</SidebarLink
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:root {
  --sidebar-bg-color: #213555;
  --sidebar-item-hover: #3c3d37;
  --sidebar-item-active: #697565;
}
</style>
