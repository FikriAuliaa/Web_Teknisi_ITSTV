<script>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

export default {
  name: "DisplayBorrowed",
  setup() {
    const router = useRouter();

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "");

    const goHome = () => {
      router.push("/");
    };

    const borrowedItems = ref([]);
    const error = ref("");
    const loading = ref(true);

    const fetchBorrowedItems = async () => {
      loading.value = true;
      try {
        const result = await axios.get(`${API_BASE_URL}/borrow/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("Borrowed Items:", result.data); // Debug log
        if (result.data && result.data.data) {
          borrowedItems.value = result.data.data;
        } else {
          error.value = "Data not in expected format.";
        }
      } catch (err) {
        console.error("Error fetching borrowed items:", err); // Debug log
        error.value = "Error fetching data. Please try again later.";
      } finally {
        loading.value = false;
      }
    };

    const returnItem = async (borrowId) => {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/borrow/return/${borrowId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.status === "success") {
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

    const canBeReturned = (item) => {
      return !item.is_returned;
    };

    const sortField = ref("borrow_date");
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
            compareResult = (a.items?.[0]?.item_name || "").localeCompare(
              b.items?.[0]?.item_name || ""
            );
            break;
          case "amount":
            compareResult =
              (parseInt(a.items?.[0]?.amount) || 0) -
              (parseInt(b.items?.[0]?.amount) || 0);
            break;
          case "borrower_name":
            compareResult = (a.borrower_name || "").localeCompare(
              b.borrower_name || ""
            );
            break;
          case "officer_name":
            compareResult = (a.officer_name || "").localeCompare(
              b.officer_name || ""
            );
            break;
          case "purpose":
            compareResult = (a.purpose || "").localeCompare(b.purpose || "");
            break;
          case "borrow_date":
            compareResult =
              new Date(a.borrow_date || 0) - new Date(b.borrow_date || 0);
            break;
          case "return_date":
            compareResult =
              new Date(a.return_date || 0) - new Date(b.return_date || 0);
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
   <div class="container mx-auto px-4 py-8 relative mt-16 md:mt-20">
    <div class="absolute top-4 left-4 md:relative md:top-0 md:left-0 justif">
      <button @click="goHome" class="bg-gradient-to-l from-blue-900 to-blue-600 hover:to-blue-500 text-white font-bold py-2 px-4 rounded-lg text-sm md:text-base w-full md:w-auto">Kembali</button>
    </div>
    <!-- Page Title (Dengan Jarak dari Tombol) -->
    <h1 class="text-xl lg:text-3xl font-bold text-gray-800 text-center w-full mx-auto mt-12 md:mt-6 mb-3">Daftar Alat Dipinjam</h1>
    <p class="italic text-gray-400 text-sm mx-auto text-center md:w-1/2">"yang cewe nunggu ditembak, yang cowo takut ditolak, yang salah orang jual nasi goreng, nasi udah matang malah digoreng"</p>
    <p class="italic text-gray-400 text-sm mx-auto text-center">-Depot Taria</p>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center mt-8">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"
      ></div>
    </div>

    <!-- Error Message -->
    <div
      v-if="error"
      class="text-red-500 text-center mb-4 text-sm sm:text-base"
    >
      {{ error }}
    </div>

    <!-- Responsive Table Wrapper -->
    <div v-if="!loading && borrowedItems.length" class="overflow-x-auto mt-6 border rounded-lg shadow-lg">
      <table
        class="min-w-max w-full bg-white border-collapse border border-gray-300"
      >
        <thead class="bg-blue-800 text-white">
          <tr class="text-sm sm:text-base">
            <th
              class="px-6 py-3 border border-gray-300 text-center"
            >
              Nama Alat
              <button @click="toggleSort('item_name')" class="ml-2">
                <img src="../../assets/filter.svg" class="w-5 inline" alt="filter icon" />
              </button>
            </th>
            <th class="px-6 py-3 border border-gray-300 text-center">
              Peminjam
              <button @click="toggleSort('borrower_name')" class="ml-2">
                <img src="../../assets/filter.svg" class="w-5 inline" alt="filter icon" />
              </button>
            </th>
            <th class="px-6 py-3 border border-gray-300 text-center">
              Teknisi
              <button @click="toggleSort('officer_name')" class="ml-2">
                <img src="../../assets/filter.svg" class="w-5 inline" alt="filter icon" />
              </button>
            </th>
            <th
              class="px-3 py-2 sm:px-6 sm:py-3 text-center border border-gray-300"
            >
              Keperluan
            </th>
            <th class="px-6 py-3 border border-gray-300 text-center">
              Tanggal Peminjaman
              <button @click="toggleSort('borrow_date')" class="ml-2">
                <img src="../../assets/filter.svg" class="w-5 inline" alt="filter icon" />
              </button>
            </th>
            <th class="px-6 py-3 border border-gray-300 text-center">
              Tanggal Pengembalian
              <button @click="toggleSort('return_date')" class="ml-2">
                <img src="../../assets/filter.svg" class="w-5 inline" alt="filter icon" />
              </button>
            </th>
            <th
              class="px-3 py-2 sm:px-6 sm:py-3 text-center border border-gray-300"
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="item in sortedBorrowedItems"
            :key="item._id"
            class="hover:bg-gray-50"
          >
            <td
              class="px-3 py-2 sm:px-6 sm:py-4 text-center border border-gray-300 text-sm sm:text-base"
            >
              <div v-if="item.items && item.items.length">
                <div
                  v-for="borrowedItem in item.items"
                  :key="borrowedItem.item_id"
                >
                  {{ borrowedItem.item_name }} (Jumlah:
                  {{ borrowedItem.amount }})
                </div>
              </div>
              <div v-else>No items</div>
            </td>
            <td
              class="px-3 py-2 sm:px-6 sm:py-4 text-center border border-gray-300 text-sm sm:text-base"
            >
              {{ item.borrower_name }}
            </td>
            <td
              class="px-3 py-2 sm:px-6 sm:py-4 text-center border border-gray-300 text-sm sm:text-base"
            >
              {{ item.officer_name }}
            </td>
            <td
              class="px-3 py-2 sm:px-6 sm:py-4 text-center border border-gray-300 text-sm sm:text-base"
            >
              {{ item.purpose }}
            </td>
            <td
              class="px-3 py-2 sm:px-6 sm:py-4 text-center border border-gray-300 text-sm sm:text-base"
            >
              {{ new Date(item.borrow_date).toLocaleDateString() }}
            </td>
            <td
              class="px-3 py-2 sm:px-6 sm:py-4 text-center border border-gray-300 text-sm sm:text-base"
            >
              {{ new Date(item.return_date).toLocaleDateString() }}
            </td>
            <td
              class="px-3 py-2 sm:px-6 sm:py-4 text-center border border-gray-300 text-sm sm:text-base"
            >
              <span
                v-if="canBeReturned(item)"
                class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm md:text-base"
                >Not Return</span
              >
              <span v-else class="text-gray-500">Returned</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div
      v-if="!loading && !borrowedItems.length"
      class="text-center text-gray-500"
    >
      No items are currently borrowed.
    </div>
  </div>
</template>

<style scoped>
th, td {
  white-space: nowrap;
}
table {
  width: 100%;
  text-align: center;
}
</style>
