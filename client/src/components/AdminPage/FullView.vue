<script>
import { ref, onMounted, onUnmounted, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

export default {
  name: "FullView",
  setup() {
    const Items = ref([]);
    const selectedCategory = ref("All"); // Tambahkan properti untuk kategori yang dipilih
    const loadingStates = ref({});
    const dropdownStates = ref({});
    let intervalId = null;
    const router = useRouter();

    // Ambil URL API dari environment variable
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, ""); // Hilangkan trailing slash

    const formatDate = (apiTimestamp) => {
      const date = new Date(apiTimestamp);
      const day = date.getUTCDate();
      const month = date.toLocaleString("en-US", {
        month: "long",
        timeZone: "UTC",
      });
      const year = date.getUTCFullYear();
      const hours = String(date.getUTCHours()).padStart(2, "0");
      const minutes = String(date.getUTCMinutes()).padStart(2, "0");
      return `${day} ${month} ${year} at ${hours}:${minutes}`;
    };

    const fetchData = async () => {
      try {
        const result = await axios.get(`${API_BASE_URL}/admin`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (result.data && result.data.data) {
          Items.value = result.data.data.map((item) => {
            if (!(item._id in loadingStates.value))
              loadingStates.value[item._id] = true;
            if (!(item._id in dropdownStates.value))
              dropdownStates.value[item._id] = false;

            // Tetapkan kategori default jika tidak ada
            const kategori = item.kategori || "Lain-lain";

            return {
              ...item,
              kategori,
              created_at: formatDate(item.created_at),
            };
          });
        } else {
          console.error("Data not in expected format");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const toggleDropdown = (id) => {
      dropdownStates.value[id] = !dropdownStates.value[id];
    };

    const deleteItem = async (id) => {
      try {
        await axios.delete(`${API_BASE_URL}/admin/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        Items.value = Items.value.filter((item) => item._id !== id);
        alert("The Item Successfully Deleted");
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    };

    const navigateToEditPage = (id) => {
      router.push(`/admin/edit-item/${id}`);
    };

    const filteredItems = computed(() => {
      if (selectedCategory.value === "All") {
        return Items.value;
      }
      return Items.value.filter(
        (item) => item.kategori === selectedCategory.value
      );
    });

    onMounted(() => {
      fetchData();
      intervalId = setInterval(fetchData, 3000);
    });

    onUnmounted(() => {
      if (intervalId) clearInterval(intervalId);
    });

    return {
      Items,
      loadingStates,
      dropdownStates,
      toggleDropdown,
      deleteItem,
      navigateToEditPage,
      selectedCategory, // Tambahkan ke return untuk digunakan di template
      filteredItems, // Tambahkan ke return untuk digunakan di template
    };
  },
};
</script>

<template>
  <div>
    <!-- Dropdown Filter Kategori -->
    <div class="mb-5">
      <label
        for="filter-category"
        class="block mb-2 text-sm font-medium text-gray-900"
        >Filter by Category</label
      >
      <select
        id="filter-category"
        v-model="selectedCategory"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      >
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

    <!-- Item List -->
    <div class="md:columns-3 columns-1 gap-4 mt-6">
      <div
        v-for="item in filteredItems"
        :key="item._id"
        class="relative rounded-lg shadow mb-5 bg-grey-500 hover:border-current transition-all hover:bg-gray-300 break-inside-avoid"
      >
        <div class="absolute top-3 right-3 z-10">
          <button
            @click="toggleDropdown(item._id)"
            class="bg-gray-700 text-white rounded-full p-2 hover:bg-gray-600 focus:outline-none"
          >
            <i class="pi pi-ellipsis-h"></i>
          </button>
          <div
            v-if="dropdownStates[item._id]"
            class="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg"
          >
            <button
              @click="navigateToEditPage(item._id)"
              class="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-700 hover:text-white rounded-lg transition-all delay-150"
            >
              Edit
            </button>
            <button
              @click="deleteItem(item._id)"
              class="transition-all delay-150 block w-full px-4 py-2 text-left bg-transparent hover:bg-red-600 text-rose-600 hover:text-white rounded-lg"
            >
              Remove
            </button>
          </div>
        </div>

        <div class="p-5">
          <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">
            {{ item.name }}
          </h5>
          <p class="text-xl text-gray-700">Amount: {{ item.amount }}</p>
          <p class="text-xl text-gray-700">Condition: {{ item.condition }}</p>
          <p class="text-xl text-gray-700">Category: {{ item.kategori }}</p>
          <p class="text-xl text-gray-700">
            Registered At: {{ item.created_at }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
