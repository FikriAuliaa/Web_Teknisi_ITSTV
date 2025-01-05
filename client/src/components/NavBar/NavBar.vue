<template>
  <nav class="fixed top-0 w-full bg-[#213555] text-white shadow-md py-2 z-50">
    <div class="container mx-auto flex justify-between items-center">
      <!-- Logo and Title -->
      <div class="flex items-center space-x-4">
        <img src="../../assets/ITSTV.png" alt="Lab Logo" class="h-10 w-30" />
        <h1 class="text-lg font-bold">
          FORM PEMINJAMAN ALAT - TEKNISI GEMILANG
        </h1>
      </div>

      <!-- Navigation and User Info -->
      <div class="flex items-center space-x-6">
        <!-- Aturan Peminjaman -->
        <router-link
          :to="rulesNavigationTarget"
          v-if="showRulesButton"
          class="px-3 py-1 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
        >
          {{
            isOnRulesPage
              ? role !== "Guest"
                ? "Back to Dashboard"
                : "Back to Home"
              : "Aturan Peminjaman"
          }}
        </router-link>

        <!-- User Profile -->
        <div v-if="username && role" class="flex items-center space-x-3">
          <img
            src="../../assets/PROFILE.png"
            alt="User Profile Logo"
            class="h-12 w-12 rounded-full border border-gray-200 bg-white p-1"
          />
          <div class="text-sm">
            <span class="block font-medium capitalize">{{ username }}</span>
            <span class="block text-gray-300 text-xs">
              as {{ role === "operator" ? "crew" : role }}
            </span>
          </div>
        </div>

        <!-- Logout Button -->
        <button
          v-if="username !== 'Guest'"
          @click="logout"
          class="px-3 py-1 bg-red-600 rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
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

    // Tentukan apakah saat ini berada di halaman login
    const isOnLoginPage = computed(() => route.path === "/");

    // Tentukan apakah saat ini berada di halaman rules
    const isOnRulesPage = computed(() => route.path === "/rules");

    // Tentukan apakah tombol "Aturan Peminjaman" harus ditampilkan
    const showRulesButton = computed(() => {
      return true;
    });

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

    return {
      username,
      role,
      isOnRulesPage,
      isOnLoginPage,
      showRulesButton,
      rulesNavigationTarget,
      logout,
    };
  },
});
</script>

<style scoped>
/* Styling navbar */
nav {
  font-family: "Poppins", sans-serif;
}

.container {
  max-width: 1200px; /* Membatasi lebar maksimum */
  margin: 0 auto; /* Memusatkan elemen */
  padding: 0 20px; /* Menambahkan padding di kiri dan kanan */
}

nav a {
  transition: all 0.3s ease;
}

nav a:hover {
  text-decoration: underline;
}

img {
  object-fit: cover;
}

/* Responsif untuk layar kecil */
@media (max-width: 768px) {
  .container {
    padding: 0 10px; /* Kurangi padding pada layar kecil */
  }

  nav .container {
    flex-wrap: wrap;
  }
}
</style>
