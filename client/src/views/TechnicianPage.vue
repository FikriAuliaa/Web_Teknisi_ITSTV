<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-16">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">
        Jadwal Teknisi
      </h2>
      <img src="/images/jadwalteknisi.png" alt="jadwal" class="mb-10 mx-auto" />

      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <a
          v-for="technician in technicians"
          :key="technician.id"
          :href="technician.phone"
          target="_blank"
          rel="noopener noreferrer"
          class="bg-gray-50 p-3 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-between text-lg font-semibold text-gray-900 hover:bg-blue-500 hover:text-white cursor-pointer"
        >
          <span>{{ technician.name }}</span>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            alt="WhatsApp"
            class="w-6 h-6"
          />
        </a>
      </div>

      <div class="text-center mt-12 mb-6">
        <router-link
          to="/operator/book-equipment"
          class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all"
        >
          Kembali
        </router-link>
      </div>
    </div>
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap");

body {
  font-family: "Poppins", sans-serif;
}
</style>

<script>
export default {
  data() {
    return {
      technicians: [
        { id: 1, name: "Aiman", phone: "https://wa.me/6287884608241" },
        { id: 2, name: "Fikri", phone: "https://wa.me/6289619212996" },
        { id: 3, name: "Mario", phone: "https://wa.me/6281219712004" },
        { id: 4, name: "Aksal", phone: "https://wa.me/6282140908812" },
        { id: 5, name: "Chenata", phone: "https://wa.me/6281216940118" },
        { id: 6, name: "Ali", phone: "https://wa.me/628121836963" },
        { id: 7, name: "Sandy", phone: "https://wa.me/6285814250900" },
        { id: 8, name: "Tsany", phone: "https://wa.me/6285157014448" },
      ],
    };
  },
};
</script>
