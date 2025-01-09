<script>
import { ref, onMounted } from "vue";
import axios from "axios";

export default {
  name: "BorrowForm",
  setup() {
    // Ambil URL API dari environment variable
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, ""); // Hilangkan trailing slash

    const borrowedItems = ref([]); // Inisialisasi dengan array kosong
    const loading = ref(true); // Status loading
    const error = ref(""); // Status error
    const formData = ref({
      item_name: "",
      amount: "",
      borrower_name: "",
      officer_name: "",
      return_date: "",
    });

    const fetchBorrowedItems = async () => {
      loading.value = true; // Set loading ke true
      try {
        const response = await axios.get(`${API_BASE_URL}/borrow/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data && response.data.data) {
          borrowedItems.value = response.data.data; // Isi data jika berhasil
        } else {
          borrowedItems.value = []; // Pastikan array kosong jika data tidak ada
        }
      } catch (err) {
        console.error("Error fetching borrowed items:", err);
        error.value = "Failed to fetch borrowed items.";
        borrowedItems.value = []; // Tangani error dengan mengisi array kosong
      } finally {
        loading.value = false; // Set loading ke false setelah selesai
      }
    };

    const returnItem = async (itemId) => {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/borrow/return/${itemId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.status === "success") {
          alert("Item returned successfully!");
          fetchBorrowedItems(); // Refresh data setelah item dikembalikan
        }
      } catch (err) {
        console.error("Error returning item:", err);
        alert("Failed to return item. Please try again.");
      }
    };

    onMounted(() => {
      fetchBorrowedItems(); // Panggil fungsi fetch saat komponen dimuat
    });

    return {
      borrowedItems,
      loading,
      error,
      returnItem,
      formData,
    };
  },
};
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <button
        @click="goHome"
        class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
      >
        Back to Home
      </button>
      <h2 class="text-2xl font-bold text-gray-800 dark:text-white">
        Daftar Peminjaman Alat
      </h2>
      <div class="w-24"></div>
      <!-- Spacer for alignment -->
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"
      ></div>
    </div>

    <!-- Error state -->
    <div v-if="error" class="text-red-500 text-center mb-4">
      {{ error }}
    </div>

    <!-- Table -->
    <div
      v-if="!loading && borrowedItems && borrowedItems.length"
      class="overflow-x-auto"
    >
      <table
        class="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden"
      >
        <thead class="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th
              v-for="(label, field) in {
                item_name: 'Alat',
                amount: 'Jumlah',
                borrower_name: 'Peminjam',
                officer_name: 'Teknisi',
                borrow_date: 'Tanggal Peminjaman',
                return_date: 'Tanggal Pengembalian',
              }"
              :key="field"
              @click="toggleSort(field)"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-200 hover:text-gray-900 transition-colors duration-200"
            >
              {{ label }}
              <span v-if="sortField === field" class="ml-1">
                {{ sortDirection === "asc" ? "↑" : "↓" }}
              </span>
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-600">
          <tr
            v-for="item in sortedBorrowedItems"
            :key="item._id"
            class="hover:bg-gray-50 dark:hover:bg-gray-700 group"
          >
            <td
              v-for="field in [
                'item_name',
                'amount',
                'borrower_name',
                'officer_name',
              ]"
              :key="field"
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200"
            >
              {{ item[field] }}
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200"
            >
              {{ new Date(item.borrow_date).toLocaleDateString() }}
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200"
            >
              {{ new Date(item.return_date).toLocaleDateString() }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <button
                v-if="canBeReturned(item)"
                @click="returnItem(item._id)"
                class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Kembalikan
              </button>
              <span v-else class="py-2 px-4 text-gray-500"> Dikembalikan </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty state -->
    <div
      v-if="!loading && !borrowedItems.length"
      class="text-center text-gray-500 dark:text-gray-400"
    >
      Tidak ada barang yang dipinjam.
    </div>
  </div>
</template>
