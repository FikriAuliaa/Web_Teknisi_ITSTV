<script>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

export default {
  name: "BorrowForm",
  setup() {
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
      borrow_date: "",
    });

    const availableItems = ref([]);
    const availableOfficers = ref([]);
    const selectedCategory = ref("All"); // Tambahkan properti untuk kategori yang dipilih
    const error = ref("");
    const success = ref("");
    const showPopup = ref(false); // Kontrol untuk menampilkan pop-up
    const selectedOfficer = ref({}); // Informasi teknisi yang dipilih

    // Fetch available items
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/admin/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data && response.data.data) {
          availableItems.value = response.data.data.map((item) => ({
            ...item,
            kategori: item.kategori || "Lain-lain", // Tetapkan kategori default jika tidak ada
          }));
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

    // Filter available items by category
    const filteredItemsByCategory = computed(() =>
      selectedCategory.value === "All"
        ? availableItems.value.filter((item) => parseInt(item.amount) > 0)
        : availableItems.value.filter(
            (item) =>
              parseInt(item.amount) > 0 &&
              item.kategori === selectedCategory.value
          )
    );

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

    const validateAmount = computed(() => {
      if (!selectedItem.value || !formData.value.amount) return true;
      const requestedAmount = parseInt(formData.value.amount);
      const availableAmount = parseInt(selectedItem.value.amount);
      return requestedAmount > 0 && requestedAmount <= availableAmount;
    });

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
            borrow_date: "",
          };
          selectedItem.value = null;

          // Tampilkan pop-up dengan informasi teknisi
          const officer = availableOfficers.value.find(
            (officer) => officer.name === formData.value.officer_name
          );
          selectedOfficer.value = officer || {
            name: "Unknown",
            phone: "Unknown",
          };
          showPopup.value = true;
        }
      } catch (err) {
        console.error("Error borrowing item:", err);
        error.value = err.response?.data?.message || "Error borrowing item.";
      }
    };

    const getMinDate = () => {
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      return now.toISOString().slice(0, 16);
    };

    onMounted(() => {
      fetchItems();
      fetchOfficers();
      formData.value.return_date = getMinDate();
      formData.value.borrow_date = getMinDate(); // Set default borrow_date
    });

    return {
      formData,
      submitForm,
      availableItems,
      selectedCategory,
      filteredItemsByCategory,
      handleItemSelect,
      selectedItem,
      error,
      success,
      minDate: getMinDate(),
      availableOfficers,
      validateAmount,
      amountError,
      goHome,
      showPopup,
      selectedOfficer,
    };
  },
};
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <div class="mb-4">
      <button
        @click="goHome"
        class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
      >
        Back to Home
      </button>
    </div>

    <form
      @submit.prevent="submitForm"
      class="bg-white shadow-md rounded-lg p-8"
    >
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Peminjaman Alat</h2>

      <!-- Error Message -->
      <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded">
        {{ error }}
      </div>

      <!-- Success Message -->
      <div v-if="success" class="mb-4 p-3 bg-green-100 text-green-700 rounded">
        {{ success }}
      </div>

      <!-- Dropdown Kategori -->
      <div class="mb-4">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="category"
        >
          Kategori
        </label>
        <select
          id="category"
          v-model="selectedCategory"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
          <option value="All">Semua Kategori</option>
          <option value="Kamera">Kamera</option>
          <option value="Lensa">Lensa</option>
          <option value="Gimbal">Gimbal</option>
          <option value="Lighting">Lighting</option>
          <option value="Tripod">Tripod</option>
          <option value="Baterai dan charger">Baterai dan charger</option>
          <option value="SD card">SD card</option>
          <option value="Alat Live">Alat Live</option>
          <option value="Lain-lain">Lain-lain</option>
        </select>
      </div>

      <!-- Dropdown Item -->
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="item">
          Alat
        </label>
        <select
          id="item"
          @change="handleItemSelect($event.target.value)"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
          :value="selectedItem?._id"
        >
          <option value="">Pilih Item</option>
          <option
            v-for="item in filteredItemsByCategory"
            :key="item._id"
            :value="item._id"
          >
            {{ item.name }} (Tersedia: {{ item.amount }})
          </option>
        </select>
      </div>

      <!-- Jumlah -->
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="amount">
          Jumlah
        </label>
        <input
          type="number"
          id="amount"
          v-model="formData.amount"
          :max="selectedItem?.amount"
          min="1"
          step="1"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          :class="{ 'border-red-500': !validateAmount && formData.amount }"
          required
        />
        <p v-if="amountError" class="text-red-500 text-xs italic mt-1">
          {{ amountError }}
        </p>
        <p v-if="selectedItem" class="text-gray-600 text-xs mt-1">
          Valid range: 1 - {{ selectedItem.amount }}
        </p>
      </div>

      <!-- Nama Peminjam -->
      <div class="mb-4">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="borrower_name"
        >
          Nama Peminjam
        </label>
        <input
          type="text"
          id="borrower_name"
          v-model="formData.borrower_name"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <!-- Nama Teknisi -->
      <div class="mb-6">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="officer_name"
        >
          Nama Teknisi
        </label>
        <select
          id="officer_name"
          v-model="formData.officer_name"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
          <option value="">Pilih Teknisi</option>
          <option
            v-for="officer in availableOfficers"
            :key="officer._id"
            :value="officer.name"
          >
            {{ officer.name }}
          </option>
        </select>
      </div>

      <!-- Tanggal Peminjaman -->
      <div class="mb-4">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="borrow_date"
        >
          Tanggal Peminjaman
        </label>
        <input
          type="datetime-local"
          id="borrow_date"
          v-model="formData.borrow_date"
          :min="minDate"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <!-- Tanggal Pengembalian -->
      <div class="mb-4">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="return_date"
        >
          Tanggal Pengembalian
        </label>
        <input
          type="datetime-local"
          id="return_date"
          v-model="formData.return_date"
          :min="minDate"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <!-- Submit Button -->
      <div class="flex items-center justify-end">
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          :disabled="!validateAmount"
        >
          Pinjam
        </button>
      </div>
    </form>

    <!-- Pop-up -->
    <div
      v-if="showPopup"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded shadow-lg text-center">
        <h3 class="text-xl font-bold mb-4">Peminjaman Berhasil</h3>
        <p class="mb-2">Jangan lupa konfirmasi ke teknisi yang bertugas.</p>
        <p class="mb-4">
          <router-link
            to="/teknisi"
            class="text-blue-500 underline hover:text-blue-700"
          >
            Klik disini untuk melihat daftar teknisi.
          </router-link>
        </p>
        <button
          @click="showPopup = false"
          class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Tutup
        </button>
      </div>
    </div>
  </div>
</template>
