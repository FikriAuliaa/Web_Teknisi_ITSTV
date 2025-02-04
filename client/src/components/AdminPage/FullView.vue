<script>
import { ref, onMounted, onUnmounted, computed } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";

export default {
  name: "FullView",
  setup() {
    const Items = ref([]);
    const selectedCategory = ref("All"); // Properti untuk kategori yang dipilih
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
      const confirmResult = await Swal.fire({
        title: "Yakin ta?",
        text: "Kamu mau ngehapus alatnya? Ini nnti gabisa di CTRL+Z loh!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, hapus!",
        customClass: {
              popup: 'rounded-xl', // Menambah rounding pada popup
            },
      });

      if (confirmResult.isConfirmed) {
        try {
          await axios.delete(`${API_BASE_URL}/admin/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          Items.value = Items.value.filter((item) => item._id !== id);
          Swal.fire({
            title: "Done bang dihapus!",
            text: "Semoga dapet alat baru dari ukape ya.",
            icon: "success",
            customClass: {
              popup: 'rounded-xl', // Menambah rounding pada popup
              confirmButton: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-400', // Tombol hijau
            },
          });
        } catch (error) {
          console.error("Error deleting item:", error);
          Swal.fire({
            title: "Error!",
            text: "Failed to delete the item. Please try again.",
            icon: "error",
            confirmButtonColor: "#d33",
          });
        }
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
      selectedCategory, // Properti kategori
      filteredItems, // Properti filter
    };
  },
};
</script>

<template>
  <div v-if="loading" class="flex justify-center items-center">
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
      <p class="mt-2 text-gray-500 italic">
        Satu Tekad, Satu Tujuan ITS TV Eureka!
      </p>
    </div>
  </div>
  <div class="max-w-7xl mx-auto">
    <div class="mb-6">
      <router-link
        to="/admin/home"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Kembali
      </router-link>
    </div>
    <div class="mb-5">
      <label
        for="filter-category"
        class="block mb-2 text-sm font-medium text-gray-500"
        >Pilih Kategori</label
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

    <div class="md:columns-4 columns-1 gap-4 mt-6 text-sm">
      <div
        v-for="item in filteredItems"
        :key="item._id"
        class="relative rounded-lg shadow mb-5 bg-grey-500 hover:border-current transition-all hover:bg-gray-200 break-inside-avoid"
      >
        <div class="absolute top-3 right-3 z-10">
          <button
            @click="toggleDropdown(item._id)"
            class="text-blue-900 rounded-full p-2 focus:outline-none"
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
          <p class="text-gray-700">Jumlah: {{ item.amount }}</p>
          <p class="text-gray-700">Kondisi: {{ item.condition }}</p>
          <p class="text-gray-700">Kategori: {{ item.kategori }}</p>
          <p class="text-gray-700">Alat masuk: {{ item.created_at }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
