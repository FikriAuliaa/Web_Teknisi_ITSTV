<script>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

export default {
  name: "BorrowForm",
  setup() {
    const route = useRoute();
    const router = useRouter();

    // Ambil URL API dari environment variable
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, ""); // Hilangkan trailing slash

    const goHome = () => {
      router.push("/");
    };

    const formData = ref({
      item_name: "",
      amount: "",
      borrower_name: "",
      officer_name: "",
      return_date: "",
    });

    const availableItems = ref([]);
    const availableOfficers = ref([]);
    const error = ref("");
    const success = ref("");

    // Fetch available items
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/admin/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data && response.data.data) {
          availableItems.value = response.data.data;
        }
      } catch (err) {
        console.error("Error fetching items:", err);
        error.value = "Failed to fetch available items.";
      }
    };

    // Fetch available officers
    const fetchOfficers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/operator/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data && response.data.data) {
          availableOfficers.value = response.data.data;
        }
      } catch (err) {
        console.error("Error fetching officers:", err);
        error.value = "Failed to fetch available officers.";
      }
    };

    // Filter available items
    const availableItemsFiltered = computed(() =>
      availableItems.value.filter((item) => parseInt(item.amount) > 0)
    );

    // Handle item selection
    const selectedItem = ref(null);
    const handleItemSelect = (itemId) => {
      const item = availableItems.value.find((item) => item._id === itemId);
      if (item && parseInt(item.amount) > 0) {
        selectedItem.value = item;
        formData.value.item_name = item.name;
      } else {
        error.value = "This item is out of stock.";
        selectedItem.value = null;
        formData.value.item_name = "";
      }
    };

    // Validate amount
    const validateAmount = computed(() => {
      if (!selectedItem.value || !formData.value.amount) return true;
      const requestedAmount = parseInt(formData.value.amount);
      const availableAmount = parseInt(selectedItem.value.amount);
      return requestedAmount > 0 && requestedAmount <= availableAmount;
    });

    // Error message for amount
    const amountError = computed(() => {
      if (!selectedItem.value || !formData.value.amount) return "";
      const requestedAmount = parseInt(formData.value.amount);
      const availableAmount = parseInt(selectedItem.value.amount);

      if (requestedAmount <= 0) {
        return "Amount must be greater than 0.";
      }
      if (requestedAmount > availableAmount) {
        return `Cannot borrow more than available stock (${availableAmount}).`;
      }
      return "";
    });

    const submitForm = async () => {
      try {
        error.value = "";
        success.value = "";

        if (!selectedItem.value) {
          error.value = "Please select an item.";
          return;
        }

        if (!validateAmount.value) {
          error.value = amountError.value;
          return;
        }

        const response = await axios.post(
          `${API_BASE_URL}/borrow/${selectedItem.value._id}`,
          formData.value,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.status === "success") {
          success.value = "Item borrowed successfully!";
          formData.value = {
            item_name: "",
            amount: "",
            borrower_name: "",
            officer_name: "",
            return_date: "",
          };
          selectedItem.value = null;
        }
      } catch (err) {
        console.error("Error borrowing item:", err);
        error.value = err.response?.data?.message || "Error borrowing item.";
      }
    };

    const getMinDate = () => {
      const now = new Date();
      now.setHours(13, 0, 0, 0);
      if (new Date().getHours() >= 13) {
        now.setDate(now.getDate() + 1);
      }
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      return now.toISOString().slice(0, 16);
    };

    const formatTo1PM = (dateString) => {
      const date = new Date(dateString);
      date.setHours(13, 0, 0, 0);
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      return date.toISOString().slice(0, 16);
    };

    onMounted(() => {
      fetchItems();
      fetchOfficers();
      formData.value.return_date = getMinDate();
    });

    return {
      formData,
      submitForm,
      availableItems,
      handleItemSelect,
      selectedItem,
      error,
      success,
      minDate: getMinDate(),
      availableOfficers,
      formatTo1PM,
      availableItemsFiltered,
      validateAmount,
      amountError,
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
