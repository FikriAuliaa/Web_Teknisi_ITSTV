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
    <div v-if="loading" class="text-center">
      <p>Loading data, please wait...</p>
    </div>

    <div v-if="error" class="text-red-500 text-center mb-4">
      {{ error }}
    </div>

    <div v-if="!loading && borrowedItems.length" class="overflow-x-auto">
      <table
        class="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden"
      >
        <thead class="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium">Item Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium">Amount</th>
            <th class="px-6 py-3 text-left text-xs font-medium">
              Borrower Name
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium">
              Officer Name
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-600">
          <tr
            v-for="item in borrowedItems"
            :key="item._id"
            class="hover:bg-gray-50 dark:hover:bg-gray-700 group"
          >
            <td class="px-6 py-4 whitespace-nowrap">{{ item.item_name }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ item.amount }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              {{ item.borrower_name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">{{ item.officer_name }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button
                @click="returnItem(item._id)"
                class="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Return
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!loading && !borrowedItems.length" class="text-center">
      No borrowed items available.
    </div>
  </div>
</template>
