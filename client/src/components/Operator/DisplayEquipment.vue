<script>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

export default {
  name: "BorrowForm",
  setup() {
    const route = useRoute();

    const formData = ref({
      item_name: route.query.name || "",
      amount: "1",
      borrower_name: "",
      officer_name: "",
      return_date: "",
      borrow_date: "",
      purpose: "",
    });

    const minDate = ref("");

    const getMinDate = () => {
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      return now.toISOString().slice(0, 16);
    };

    onMounted(() => {
      formData.value.borrow_date = getMinDate();
      formData.value.return_date = getMinDate();
      minDate.value = getMinDate();
    });

    const submitForm = () => {
      console.log("Form submitted:", formData.value);
    };

    return {
      formData,
      submitForm,
      minDate,
    };
  },
};
</script>

<template>
  <form @submit.prevent="submitForm">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Peminjaman Alat</h2>
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2"
        >Nama Alat</label
      >
      <input
        type="text"
        v-model="formData.item_name"
        class="border rounded w-full p-2"
        readonly
      />
    </div>
    <!-- Input lainnya -->
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2">Jumlah</label>
      <input
        type="number"
        v-model="formData.amount"
        min="1"
        max="10"
        class="border rounded w-full p-2"
      />
    </div>
    <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">
      Submit
    </button>
  </form>
</template>
