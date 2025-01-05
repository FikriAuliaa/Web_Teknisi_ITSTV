<script>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

export default {
  name: "DisplayBorrowed",
  setup() {
    const router = useRouter();

    const goHome = () => {
      router.push("/");
    };

    const borrowedItems = ref([]);
    const error = ref("");
    const loading = ref(true);

    const fetchBorrowedItems = async () => {
      loading.value = true;
      try {
        const result = await axios.get("http://localhost:4000/borrow/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (result.data && result.data.data) {
          borrowedItems.value = result.data.data;
        } else {
          error.value = "Data not in expected format.";
        }
      } catch (err) {
        error.value = "Error fetching data. Please try again later.";
      } finally {
        loading.value = false;
      }
    };

    const returnItem = async (borrowId) => {
      try {
        const response = await axios.post(
          `http://localhost:4000/borrow/return/${borrowId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.status === "success") {
          // Update the specific item's is_returned status locally
          const itemIndex = borrowedItems.value.findIndex(
            (item) => item._id === borrowId
          );
          if (itemIndex !== -1) {
            borrowedItems.value[itemIndex].is_returned = true;
          }
        }
      } catch (err) {
        error.value = err.response?.data?.message || "Error returning item";
      }
    };

    // Simplify canBeReturned to only check is_returned
    const canBeReturned = (item) => {
      return !item.is_returned;
    };

    const sortField = ref("item_name");
    const sortDirection = ref("asc");

    const toggleSort = (field) => {
      if (sortField.value === field) {
        sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
      } else {
        sortField.value = field;
        sortDirection.value = "asc";
      }
    };

    const sortedBorrowedItems = computed(() => {
      return [...borrowedItems.value].sort((a, b) => {
        let compareResult = 0;
        switch (sortField.value) {
          case "item_name":
            compareResult = a.item_name.localeCompare(b.item_name);
            break;
          case "amount":
            compareResult = parseInt(a.amount) - parseInt(b.amount);
            break;
          case "borrower_name":
            compareResult = a.borrower_name.localeCompare(b.borrower_name);
            break;
          case "officer_name":
            compareResult = a.officer_name.localeCompare(b.officer_name);
            break;
          case "borrow_date":
            compareResult = new Date(a.borrow_date) - new Date(b.borrow_date);
            break;
          case "return_date":
            compareResult = new Date(a.return_date) - new Date(b.return_date);
            break;
        }
        return sortDirection.value === "asc" ? compareResult : -compareResult;
      });
    });

    onMounted(() => {
      fetchBorrowedItems();
    });

    return {
      borrowedItems,
      error,
      loading,
      returnItem,
      canBeReturned,
      sortField,
      sortDirection,
      toggleSort,
      sortedBorrowedItems,
      goHome,
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
    <div v-if="!loading && borrowedItems.length" class="overflow-x-auto">
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
