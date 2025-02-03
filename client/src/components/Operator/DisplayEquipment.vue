<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const equipments = ref([]);
const selectedCategory = ref("All"); // Properti untuk kategori yang dipilih
const error = ref("");
const loading = ref(true);
const showPopup = ref(false); // Properti untuk menampilkan pop-up
const router = useRouter();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "");

// Fungsi untuk mengambil data peralatan
const fetchEquipments = async () => {
  loading.value = true;
  try {
    const result = await axios.get(`${API_BASE_URL}/admin/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (result.data && result.data.data) {
      equipments.value = result.data.data.map((item) => ({
        ...item,
        kategori: item.kategori && item.kategori.trim() !== "" ? item.kategori : "Lain-lain", // Gunakan item.kategori
        image: `/images/${item.name.replace(/\s+/g, "_")}.jpg`, // Path ke gambar di public/images
      }));
    }
  } catch (err) {
    error.value = "Error fetching equipment data.";
  } finally {
    loading.value = false;
  }
};

// Filter peralatan berdasarkan kategori
const filteredEquipments = computed(() => {
  if (selectedCategory.value === "All") {
    return equipments.value;
  }
  return equipments.value.filter((item) => item.kategori === selectedCategory.value); // Filter berdasarkan item.kategori
});

// Fungsi untuk mengarahkan ke halaman peminjaman dengan data item
const handleBorrow = (item) => {
  if (item.amount <= 0) {
    // Tampilkan pop-up jika jumlah barang kurang dari atau sama dengan 0
    showPopup.value = true;
    return;
  }

  router.push({
    path: "/operator/book-equipment",
    query: {
      id: item._id,
      name: item.name,
      amount: item.amount,
    },
  });
};

// Tutup pop-up
const closePopup = () => {
  showPopup.value = false;
};

onMounted(fetchEquipments);
</script>

<template>
  <div class="p-4 mt-16 max-w-7xl mx-auto">
    <!-- Tombol Kembali -->
    <button class="mb-4 text-white px-4 py-2 rounded-lg bg-gradient-to-l from-blue-900 to-blue-600 hover:to-blue-500" @click="router.back()">Kembali</button>
    <p class="italic text-gray-400 text-sm mx-auto text-center">"Tidurnya larut malam, bangunnya pagi buta, klo bukan anggota Power Rangers mana bisa."</p>
    <p class="italic text-gray-400 text-sm mx-auto text-center">-Power Rangers Merah</p>
    <!-- Filter Kategori -->
    <div class="mb-4">
      <label for="filter-category" class="block text-gray-500 mb-2">Pilih kategori</label>
      <select id="filter-category" v-model="selectedCategory" class="border rounded px-4 py-2 w-full">
        <option value="All">All</option>
        <option value="Kamera">Kamera</option>
        <option value="Lensa">Lensa</option>
        <option value="Gimbal">Gimbal</option>
        <option value="Audio">Audio</option>
        <option value="Lighting">Lighting</option>
        <option value="Tripod">Tripod</option>
        <option value="Baterai dan charger">Baterai dan charger</option>
        <option value="SD card">SD card</option>
        <option value="Alat Live">Alat Live</option>
        <option value="Lain-lain">Lain-lain</option>
      </select>
    </div>

    <!-- Konten -->
    <div v-if="loading" class="flex justify-center items-center mt-6">
      <div class="text-center">
        <svg class="animate-spin h-10 w-10 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0112-7.32V4a10 10 0 00-10 10h2z"></path>
        </svg>
      </div>
    </div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div v-for="item in filteredEquipments" :key="item._id" class="bg-white shadow-md rounded-lg p-4 flex flex-col">
        <img :src="item.image" alt="Equipment Image" class="rounded-lg w-full h-48 object-contain mb-4" />
        <h2 class="text-lg font-bold">{{ item.name }}</h2>
        <p>Jumlah: {{ item.amount }}</p>
        <p>Kondisi: {{ item.condition }}</p>
        <p>Kategori: {{ item.kategori }}</p>
        <!-- Tombol Pinjam -->
        <button @click="handleBorrow(item)" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" :disabled="item.amount <= 0">Pinjam</button>
      </div>
    </div>

    <!-- Pop-Up -->
    <div v-if="showPopup" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded shadow-lg text-center">
        <h3 class="text-xl font-bold mb-4">Barang Sedang Dipinjam</h3>
        <p class="text-gray-700">Barang sedang dipinjam oleh orang lain.</p>
        <button @click="closePopup" class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Tutup</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styling for the card view */
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  transition: box-shadow 0.3s ease;
}
.card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
