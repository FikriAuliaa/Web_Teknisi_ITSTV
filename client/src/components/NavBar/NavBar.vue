<template>
  <nav class="fixed top-0 w-full bg-white text-blue-900 shadow-md py-2 z-50">
    <div class="container mx-auto flex justify-between items-center">
      <!-- Logo and Title -->
      <div class="flex items-center space-x-4">
        <img src="../../assets/itstv-gemilang.png" alt="Lab Logo" class="md:h-12 md:w-32 h-6 w-16" />
        <h1 class="font-extrabold max-md:text-sm">Selamat Datang Kru Gemilang!</h1>
      </div>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center space-x-6">
        <!-- Aturan Peminjaman -->
        <router-link :to="rulesNavigationTarget" v-if="showRulesButton" class="px-3 py-1 bg-gradient-to-l from-blue-900 to-blue-600 rounded-lg hover:bg-blue-800 transition text-white">
          {{ isOnRulesPage ? (role !== "Guest" ? "Back to Dashboard" : "Kembali") : "Aturan Peminjaman" }}
        </router-link>

        <!-- User Profile -->
        <div v-if="username && role" class="flex items-center space-x-3">
          <img src="../../assets/PROFILE.png" alt="User Profile Logo" class="h-12 w-12 rounded-full border border-gray-200 bg-white p-1" />
          <div class="text-sm">
            <span class="block font-medium capitalize">{{ username }}</span>
            <span class="block text-xs"> as {{ role === "operator" ? "crew" : role }} </span>
          </div>
        </div>

        <!-- Logout Button -->
        <button v-if="username !== 'Guest'" @click="logout" class="px-3 py-1 text-white bg-red-600 rounded-lg hover:bg-red-700 transition">Logout</button>
      </div>

      <!-- Mobile Menu Button -->
      <button @click="toggleMenu" class="md:hidden p-2">
        <svg class="w-8 h-8 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
        </svg>
      </button>
    </div>

    <!-- Mobile Dropdown Menu -->
    <div v-show="menuOpen" class="md:hidden text-blue-900 py-2">
      <router-link :to="rulesNavigationTarget" v-if="showRulesButton" class="block px-4 py-2 hover:bg-blue-800 hover:text-white">
        {{ isOnRulesPage ? (role !== "Guest" ? "Back to Dashboard" : "Kembali") : "Aturan Peminjaman" }}
      </router-link>

      <div v-if="username && role" class="px-4 py-2 border-t border-gray-400">
        <span class="block font-medium capitalize">{{ username }}</span>
        <span class="block text-xs"> as {{ role === "operator" ? "crew" : role }} </span>
      </div>

      <button v-if="username !== 'Guest'" @click="logout" class="block w-full text-left px-4 py-2 bg-red-600 hover:bg-red-700 transition text-white">Logout</button>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  name: "Navbar",
  setup() {
    const username = ref("Guest");
    const role = ref("Guest");
    const route = useRoute();
    const router = useRouter();
    const menuOpen = ref(false);

    // Tentukan apakah saat ini berada di halaman login
    const isOnLoginPage = computed(() => route.path === "/");

    // Tentukan apakah saat ini berada di halaman rules
    const isOnRulesPage = computed(() => route.path === "/rules");

    // Tentukan apakah tombol "Aturan Peminjaman" harus ditampilkan
    const showRulesButton = computed(() => true);

    // Tentukan target navigasi tombol di halaman Rules
    const rulesNavigationTarget = computed(() => {
      if (isOnRulesPage.value) {
        if (role.value === "admin") return "/admin";
        if (role.value === "operator") return "/operator";
        return "/"; // Guest kembali ke home
      }
      return "/rules";
    });

    // Ambil data pengguna dari localStorage
    const updateProfile = () => {
      username.value = localStorage.getItem("username") || "Guest";
      role.value = localStorage.getItem("role") || "Guest";
    };

    onMounted(() => {
      updateProfile();
    });

    watch(route, () => {
      updateProfile(); // Update profil setiap kali rute berubah
    });

    // Fungsi logout
    const logout = () => {
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      localStorage.removeItem("token");
      username.value = "Guest";
      role.value = "Guest";
      router.push("/"); // Kembali ke halaman login
    };

    // Fungsi toggle menu
    const toggleMenu = () => {
      menuOpen.value = !menuOpen.value;
    };

    return {
      username,
      role,
      isOnRulesPage,
      isOnLoginPage,
      showRulesButton,
      rulesNavigationTarget,
      logout,
      menuOpen,
      toggleMenu,
    };
  },
});
</script>

<style scoped>
/* Styling navbar */

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

nav a {
  transition: all 0.3s ease;
}

img {
  object-fit: cover;
}

/* Responsif untuk layar kecil */
@media (max-width: 768px) {
  .container {
    padding: 0 10px;
  }

  nav .container {
    flex-wrap: wrap;
  }
}
</style>
