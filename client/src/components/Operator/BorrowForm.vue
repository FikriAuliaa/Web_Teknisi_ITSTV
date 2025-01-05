<script>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

export default {
  name: "BorrowForm",
  setup() {
    const route = useRoute();
    const router = useRouter();

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
        const response = await axios.get("http://localhost:4000/admin/", {
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
        const response = await axios.get("http://localhost:4000/operator/", {
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
          `http://localhost:4000/borrow/${selectedItem.value._id}`,
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
            v-for="item in availableItemsFiltered"
            :key="item._id"
            :value="item._id"
          >
            {{ item.name }} (Tersedia: {{ item.amount }})
          </option>
          <option
            v-for="item in availableItems.filter(
              (i) => parseInt(i.amount) === 0
            )"
            :key="item._id"
            :value="item._id"
            disabled
            class="text-gray-400"
          >
            {{ item.name }} (Tidak tersedia)
          </option>
        </select>
      </div>

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
          @input="formData.amount = formData.amount.replace(/[^0-9]/g, '')"
        />
        <p v-if="amountError" class="text-red-500 text-xs italic mt-1">
          {{ amountError }}
        </p>
        <p v-if="selectedItem" class="text-gray-600 text-xs mt-1">
          Valid range: 1 - {{ selectedItem.amount }}
        </p>
      </div>

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

      <!-- Update the officer select element to use correct data structure -->
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

      <!-- Add return date field before the submit button -->
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
          @change="formData.return_date = formatTo1PM($event.target.value)"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

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
  </div>
</template>
