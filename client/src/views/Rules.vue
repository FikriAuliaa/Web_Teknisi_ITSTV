<template>
  <div class="min-h-screen flex items-start justify-center pt-20">
    <div class="max-w-sm md:max-w-3xl bg-white bg-opacity-80 backdrop-blur-md rounded-lg shadow-lg p-4 md:p-8 transform transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl glow-effect">
      <h1 class="text-3xl text-gray-800 mb-6">Aturan & Alur Peminjaman</h1>
      <p class="text-gray-700">
        <b>Alur Peminjaman:</b><br />
        1. Pengguna login terlebih dahulu.<br />
        2. Pilih alat yang ingin dipinjam.<br />
        3. Tentukan waktu peminjaman.<br />
        4. Tunggu konfirmasi dari admin.<br />
        5. Ambil alat dan pastikan untuk mengembalikan sesuai waktu yang ditentukan.
      </p>
      <!-- <div class="mt-6">
        <router-link v-if="isGuest" to="/" class="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition transform hover:scale-105"> Back to Home </router-link>
      </div> -->
    </div>
  </div>
</template>

<script>
import { computed, ref, onMounted } from "vue";

export default {
  name: "RulesPage",
  setup() {
    const username = ref("");
    const role = ref("");

    // Ambil informasi pengguna dari localStorage
    onMounted(() => {
      username.value = localStorage.getItem("username") || "";
      role.value = localStorage.getItem("role") || "";
    });

    // Tentukan apakah user adalah guest
    const isGuest = computed(() => !username.value && !role.value);

    return {
      isGuest,
    };
  },
};
</script>

<style scoped>
.bg-opacity-80 {
  background-color: rgba(255, 255, 255, 0.85); /* Transparansi pada box */
}

.backdrop-blur-md {
  backdrop-filter: blur(10px); /* Efek blur pada latar belakang box */
}

.shadow-lg {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2); /* Bayangan lembut */
}

.hover\:shadow-2xl:hover {
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3); /* Efek bayangan saat hover */
}

.transition-all {
  transition: all 0.4s ease-in-out; /* Animasi smooth untuk transformasi */
}

.hover\:-translate-y-3:hover {
  transform: translateY(-12px); /* Efek naik saat hover */
}

.text-gray-700 {
  line-height: 1.8; /* Meningkatkan keterbacaan */
}

.hover\:scale-105:hover {
  transform: scale(1.05); /* Efek pembesaran tombol saat hover */
}

.text-center {
  font-family: "Georgia", serif; /* Konsistensi font */
}

/* Efek cahaya di sekitar box */
.glow-effect {
  box-shadow: 0 0 15px rgba(0, 123, 255, 0.3), 0 0 25px rgba(0, 123, 255, 0.2);
}

.glow-effect:hover {
  box-shadow: 0 0 20px rgba(0, 123, 255, 0.5), 0 0 30px rgba(0, 123, 255, 0.4);
}
</style>
