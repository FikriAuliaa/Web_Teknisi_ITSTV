<template>
  <div class="bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 mt-20">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl md:text-4xl font-bold text-center text-gray-900 mb-12">Dashboard Peminjaman Alat</h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Borrow Equipment Card -->
        <router-link to="/operator/book-equipment" class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
          <div class="p-6 text-center">
            <div class="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-gray-900 mb-2">Pinjam Alat</h2>
            <p class="text-gray-600">Membuat permintaan peminjaman alat kantor</p>
          </div>
        </router-link>

        <!-- List Borrowed Equipment Card -->
        <router-link to="/operator/borrowed-items" class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
          <div class="p-6 text-center">
            <div class="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-gray-900 mb-2">List alat yang dipinjam</h2>
            <p class="text-gray-600">Melihat alat apa yang sedang dipinjam</p>
          </div>
        </router-link>

        <!-- List Item Card -->
        <router-link to="/operator/all-equipment" class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
          <div class="p-6 text-center">
            <div class="h-12 w-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-gray-900 mb-2">List Alat</h2>
            <p class="text-gray-600">Melihat semua alat yang tersedia</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
  <p class="italic text-gray-400 text-sm mx-auto text-center w-1/3">"Ya Allah, jika hari ini aku merasa kecewa, sadarkan aku bahwa rencana-Mu lebih indah daripada harapanku."</p>
  <p class="italic text-gray-400 text-sm mx-auto text-center">-</p>
</template>

<script>
export default {
  name: "HomePageOperator",
};
</script>
