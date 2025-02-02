<script>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

export default {
  name: "BorrowForm",
  setup() {
    const router = useRouter();

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "");

    const goHome = () => {
      router.push("/");
    };

    const formData = ref({
      borrower_name: "",
      officer_name: "",
      return_date: "",
      borrow_date: "",
      purpose: "",
      borrowedItems: [], // Array to store borrowed items
    });

    const availableItems = ref([]);
    const availableOfficers = ref([]);
    const selectedCategory = ref("All");
    const error = ref("");
    const success = ref("");
    const showPopup = ref(false);
    const selectedItem = ref(null);

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
            kategori: item.kategori || "Lain-lain",
          }));
        }
      } catch (err) {
        console.error("Error fetching items:", err);
        error.value = "Failed to fetch available items.";
      }
    };

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

    const filteredItemsByCategory = computed(() =>
      selectedCategory.value === "All" ? availableItems.value.filter((item) => parseInt(item.amount) > 0) : availableItems.value.filter((item) => parseInt(item.amount) > 0 && item.kategori === selectedCategory.value)
    );

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

    const addItemToBorrowedList = () => {
      if (!selectedItem.value || !validateAmount.value) {
        error.value = amountError.value || "Pilih item dan jumlah yang valid.";
        return;
      }

      // Add item to the borrowed items list
      formData.value.borrowedItems.push({
        item_id: selectedItem.value._id,
        item_name: selectedItem.value.name,
        amount: 1,
      });

      // Reset selected item and amount
      selectedItem.value = null;
      formData.value.amount = "1";
      success.value = "Item berhasil ditambahkan ke daftar.";
    };

    const submitForm = async () => {
      try {
        error.value = "";
        success.value = "";

        if (formData.value.borrowedItems.length === 0) {
          error.value = "Tambahkan setidaknya satu item ke daftar peminjaman.";
          return;
        }

        const response = await axios.post(`${API_BASE_URL}/borrow`, formData.value, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.status === "success") {
          success.value = "Peminjaman berhasil dilakukan!";
          formData.value = {
            borrower_name: "",
            officer_name: "",
            return_date: "",
            borrow_date: "",
            purpose: "",
            borrowedItems: [],
          };
          showPopup.value = true; // Show the success popup
        }
      } catch (err) {
        console.error("Error submitting form:", err);
        error.value = err.response?.data?.message || "Error submitting form.";
      }
    };

    const handleItemSelect = (itemId) => {
      const item = availableItems.value.find((item) => item._id === itemId);
      if (item && parseInt(item.amount) > 0) {
        selectedItem.value = item;
      } else {
        error.value = "This item is out of stock.";
        selectedItem.value = null;
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
      formData.value.borrow_date = getMinDate();
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
      addItemToBorrowedList,
      showPopup,
    };
  },
};
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <div class="mb-4">
      <button @click="goHome" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Back to Home</button>
    </div>

    <form @submit.prevent="submitForm" class="bg-white shadow-md rounded-lg p-8">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Peminjaman Alat</h2>

      <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded">
        {{ error }}
      </div>

      <div v-if="success" class="mb-4 p-3 bg-green-100 text-green-700 rounded">
        {{ success }}
      </div>

      <!-- Nama Peminjam -->
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="borrower_name"> Nama Peminjam </label>
        <input type="text" id="borrower_name" v-model="formData.borrower_name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
      </div>

      <!-- Nama Teknisi -->
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="officer_name"> Nama Teknisi </label>
        <select id="officer_name" v-model="formData.officer_name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
          <option value="">Pilih Teknisi</option>
          <option v-for="officer in availableOfficers" :key="officer._id" :value="officer.name">
            {{ officer.name }}
          </option>
        </select>
      </div>

      <!-- Keperluan -->
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="purpose"> Keperluan </label>
        <textarea id="purpose" v-model="formData.purpose" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows="3" required></textarea>
      </div>

      <!-- Tanggal Peminjaman -->
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="borrow_date"> Tanggal Peminjaman </label>
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
        <label class="block text-gray-700 text-sm font-bold mb-2" for="return_date"> Tanggal Pengembalian </label>
        <input
          type="datetime-local"
          id="return_date"
          v-model="formData.return_date"
          :min="minDate"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <!-- Dropdown Kategori -->
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="category"> Kategori </label>
        <select id="category" v-model="selectedCategory" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
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
        <label class="block text-gray-700 text-sm font-bold mb-2" for="item"> Nama Alat </label>
        <select id="item" @change="handleItemSelect($event.target.value)" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
          <option value="">Pilih Item</option>
          <option v-for="item in filteredItemsByCategory" :key="item._id" :value="item._id">{{ item.name }} (Tersedia: {{ item.amount }})</option>
        </select>
      </div>

      <div class="mb-4">
        <button @click="addItemToBorrowedList" type="button" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Tambah ke Daftar</button>
      </div>

      <div class="mb-4">
        <h3 class="text-lg font-bold mb-2">Daftar Barang yang Dipinjam</h3>
        <ul>
          <li v-for="(item, index) in formData.borrowedItems" :key="index" class="flex justify-between items-center mb-2">
            <span>{{ item.item_name }} (Jumlah: {{ item.amount }})</span>
            <button @click="formData.borrowedItems.splice(index, 1)" type="button" class="text-red-500 hover:underline">Hapus</button>
          </li>
        </ul>
      </div>

      <div class="flex items-center justify-end">
        <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Submit</button>
      </div>
    </form>

    <!-- Pop-up -->
    <div v-if="showPopup" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded shadow-lg text-center">
        <h3 class="text-xl font-bold mb-4">Peminjaman Berhasil</h3>
        <p class="mb-2">Terima kasih sudah mengisi, jangan lupa konfirmasi ke teknisi.</p>
        <p class="mb-4">
          <router-link to="/teknisi" class="text-blue-500 underline hover:text-blue-700"> Lihat kontak teknisi di sini! </router-link>
        </p>
        <button @click="showPopup = false" class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Tutup</button>
      </div>
    </div>
  </div>
</template>
