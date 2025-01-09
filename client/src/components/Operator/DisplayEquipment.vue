<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const equipments = ref([]);
const error = ref("");
const loading = ref(true);
const router = useRouter();

// Ambil URL API dari environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, ""); // Hilangkan trailing slash
const sortField = ref("name");
const sortDirection = ref("asc");

const toggleSort = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortDirection.value = "asc";
  }
};

const sortedEquipments = computed(() => {
  return [...equipments.value].sort((a, b) => {
    let compareResult = 0;
    switch (sortField.value) {
      case "name":
        compareResult = a.name.localeCompare(b.name);
        break;
      case "amount":
        compareResult = parseInt(a.amount) - parseInt(b.amount);
        break;
      case "condition":
        compareResult = a.condition.localeCompare(b.condition);
        break;
    }
    return sortDirection.value === "asc" ? compareResult : -compareResult;
  });
});

const fetchEquipments = async () => {
  loading.value = true;
  try {
    const result = await axios.get(`${API_BASE_URL}/admin/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (result.data && result.data.data) {
      equipments.value = result.data.data;
    } else {
      error.value = "Data not in expected format.";
    }
  } catch (err) {
    error.value = "Error fetching data. Please try again later.";
  } finally {
    loading.value = false;
  }
};

const handleBorrow = (item) => {
  router.push({
    name: "book-equipment",
    query: {
      itemId: item._id,
      itemName: item.name,
      itemAmount: item.amount,
    },
  });
};

const goHome = () => {
  router.push("/");
};

onMounted(() => {
  fetchEquipments();
});
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
        Alat Tersedia
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
    <div v-if="!loading && equipments.length" class="overflow-x-auto">
      <table
        class="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden"
      >
        <thead class="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th
              @click="toggleSort('name')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-200 hover:text-gray-900 transition-colors duration-200"
            >
              Alat
              <span v-if="sortField === 'name'" class="ml-1">
                {{ sortDirection === "asc" ? "↑" : "↓" }}
              </span>
            </th>
            <th
              @click="toggleSort('amount')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-200 hover:text-gray-900 transition-colors duration-200"
            >
              Jumlah Tersedia
              <span v-if="sortField === 'amount'" class="ml-1">
                {{ sortDirection === "asc" ? "↑" : "↓" }}
              </span>
            </th>
            <th
              @click="toggleSort('condition')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-200 hover:text-gray-900 transition-colors duration-200"
            >
              Kondisi
              <span v-if="sortField === 'condition'" class="ml-1">
                {{ sortDirection === "asc" ? "↑" : "↓" }}
              </span>
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-600">
          <tr
            v-for="item in sortedEquipments"
            :key="item._id"
            class="hover:bg-gray-50 dark:hover:bg-gray-700 group"
          >
            <td
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200"
            >
              {{ item.name }}
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200"
            >
              {{ item.amount }}
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200"
            >
              {{ item.condition }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <button
                @click="handleBorrow(item)"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                :disabled="item.amount <= 0"
              >
                Pinjam
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty state -->
    <div
      v-if="!loading && !equipments.length"
      class="text-center text-gray-500 dark:text-gray-400"
    >
      Tidak ada barang tersedia.
    </div>
  </div>
</template>
