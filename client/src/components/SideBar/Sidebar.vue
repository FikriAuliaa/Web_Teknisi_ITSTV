<script>
import SidebarLink from "./SidebarLink.vue";
import { collapsed, toggleSidebar, sidebarWidth } from "./state";
import "primeicons/primeicons.css";

export default {
  props: {},
  components: { SidebarLink },
  setup() {
    return { collapsed, toggleSidebar, sidebarWidth };
  },
};
</script>

<template>
  <div class="sidebar" :style="{ width: sidebarWidth }">
    <SidebarLink to="/admin" icon="pi pi-home">Alat</SidebarLink>
    <SidebarLink to="/admin/all-operator" icon="pi pi-users"
      >Teknisi</SidebarLink
    >
    <SidebarLink to="/admin/summary" icon="pi pi-list-check"
      >Invoice</SidebarLink
    >

    <span
      class="collapse-icon"
      :class="{ 'rotate-180': collapsed }"
      @click="toggleSidebar"
    >
      <i class="pi pi-chevron-left" />
    </span>
  </div>
</template>

<style>
:root {
  --sidebar-bg-color: #213555;
  --sidebar-item-hover: #3c3d37;
  --sidebar-item-active: #697565;
}
</style>

<style scoped>
.sidebar {
  color: white;
  background-color: var(--sidebar-bg-color);

  float: left;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  bottom: 0;
  padding: 0.5em;
  margin-top: 5rem;

  transition: 0.3s ease;

  display: flex;
  flex-direction: column;
}

.sidebar h1 {
  height: 2rem;
}

.collapse-icon {
  position: absolute;
  padding: 0.75em;
  bottom: 0;
  transition: 0.2s linear;
}

.rotate-180 {
  transform: rotate(180deg);
  transition: 0.2s linear;
}
</style>
