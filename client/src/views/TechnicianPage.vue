<template>
  <div class="min-h-screen flex items-center justify-center">
    <div
      class="w-full max-w-lg bg-white bg-opacity-80 backdrop-blur-md rounded-lg shadow-lg p-6 mx-auto transform transition-all duration-500 hover:shadow-2xl glow-effect"
    >
      <ul class="space-y-4">
        <li
          v-for="technician in technicians"
          :key="technician.id"
          class="flex items-center justify-between bg-gray-100 p-3 rounded-md shadow-sm hover:shadow-md transition"
        >
          <span class="text-gray-800 text-lg font-medium">{{
            technician.name
          }}</span>
          <a
            :href="technician.phone"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-500 underline hover:text-blue-700"
          >
            WhatsApp
          </a>
        </li>
      </ul>
      <div class="text-center mt-6">
        <router-link
          to="/operator/book-equipment"
          class="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition transform hover:scale-105"
        >
          Kembali
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TechnicianPage",
  data() {
    return {
      technicians: [
        { id: 1, name: "Aiman", phone: "https://wa.me/6287884608241" },
        { id: 2, name: "Fikri", phone: "https://wa.me/6282140908812" },
        { id: 3, name: "Mario", phone: "https://wa.me/6281219712004" },
        { id: 4, name: "Aksal", phone: "https://wa.me/6282140908812" },
      ],
    };
  },
};
</script>

<style scoped>
body {
  font-family: "Georgia", serif; /* Font formal dan elegan */
}

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

/* List Item Style */
.bg-gray-100 {
  background-color: #f7f7f7;
}

.hover\:shadow-md:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.space-y-4 > :not(:last-child) {
  margin-bottom: 1rem;
}

.max-w-lg {
  max-width: 32rem; /* Mengatur lebar maksimum container utama */
}

.flex {
  justify-content: space-between;
  align-items: center;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}
</style>
