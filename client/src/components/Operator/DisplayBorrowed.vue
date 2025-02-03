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

    // Pagination
    const currentPage = ref(1);
    const itemsPerPage = ref(10);

    const fetchBorrowedItems = async () => {
      loading.value = true;
      try {
        const result = await axios.get(`${API_BASE_URL}/borrow/`, {
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
        console.error("Error fetching borrowed items:", err);
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

    // Pagination logic
    const totalPages = computed(() => {
      return Math.ceil(borrowedItems.value.length / itemsPerPage.value);
    });

    const paginatedItems = computed(() => {
      const startIndex = (currentPage.value - 1) * itemsPerPage.value;
      const endIndex = startIndex + itemsPerPage.value;
      return sortedBorrowedItems.value.slice(startIndex, endIndex);
    });

    const changePage = (pageNumber) => {
      if (pageNumber >= 1 && pageNumber <= totalPages.value) {
        currentPage.value = pageNumber;
      }
    };

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
      paginatedItems,
      totalPages,
      currentPage,
      changePage,
      goHome,
    };
  },
};
</script>

<template>
  <div class="container mx-auto px-4 py-8 relative mt-16 md:mt-20">
    <div class="absolute top-4 left-4 md:relative md:top-0 md:left-0">
      <button
        @click="goHome"
        class="bg-gradient-to-l from-blue-900 to-blue-600 hover:to-blue-500 text-white font-bold py-2 px-4 rounded-lg text-sm md:text-base w-full md:w-auto"
      >
        Kembali
      </button>
    </div>

    <h1
      class="text-xl lg:text-3xl font-bold text-gray-800 text-center w-full mx-auto mt-12 md:mt-6 mb-3"
    >
      Daftar Alat Dipinjam
    </h1>
    <p class="italic text-gray-400 text-sm mx-auto text-center md:w-1/2">
      "yang cewe nunggu ditembak, yang cowo takut ditolak, yang salah orang jual
      nasi goreng, nasi udah matang malah digoreng"
    </p>
    <p class="italic text-gray-400 text-sm mx-auto text-center">-Depot Taria</p>

    <div v-if="loading" class="flex justify-center items-center mt-6">
      <div class="text-center">
        <svg
          class="animate-spin h-10 w-10 text-blue-600 mx-auto"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 0112-7.32V4a10 10 0 00-10 10h2z"
          ></path>
        </svg>
      </div>
    </div>

    <div
      v-if="error"
      class="text-red-500 text-center mb-4 text-sm sm:text-base"
    >
      {{ error }}
    </div>

    <div
      v-if="!loading && borrowedItems.length"
      class="overflow-x-auto mt-6 rounded-xl border-gray-300 border-collapse border"
    >
      <table class="min-w-max w-full bg-white rounded-xl">
        <thead class="bg-blue-800 text-white">
          <tr class="text-sm sm:text-base">
            <th
              v-for="(label, field) in {
                item_name: 'Item Name',
                borrower_name: 'Borrower',
                officer_name: 'Officer',
                purpose: 'Purpose',
                borrow_date: 'Borrow Date',
                return_date: 'Return Date',
              }"
              :key="field"
              @click="toggleSort(field)"
              class="cursor-pointer px-3 py-2 sm:px-6 sm:py-3 text-center border border-gray-300"
            >
              {{ label }}
              <span v-if="sortField === field" class="ml-1">
                {{ sortDirection === "asc" ? "↑" : "↓" }}
              </span>
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
            v-for="item in paginatedItems"
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
              {{
                item.return_date
                  ? new Date(item.return_date).toLocaleDateString()
                  : "Not Returned"
              }}
            </td>
            <td
              class="px-3 py-2 sm:px-6 sm:py-4 text-center border border-gray-300 text-sm sm:text-base"
            >
              <button
                v-if="canBeReturned(item)"
                @click="returnItem(item._id)"
                class="bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-500 focus:outline-none"
              >
                Return
              </button>
              <span v-else class="text-green-600">Returned</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="mt-6 text-center text-gray-500">
      No borrowed items found.
    </div>

    <!-- Pagination Controls -->
    <div class="flex justify-center items-center mt-4">
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage <= 1"
        class="px-4 py-2 text-white bg-blue-600 hover:bg-blue-500 rounded disabled:opacity-50"
      >
        Previous
      </button>
      <span class="mx-4">{{ currentPage }} / {{ totalPages }}</span>
      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage >= totalPages"
        class="px-4 py-2 text-white bg-blue-600 hover:bg-blue-500 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</template>
