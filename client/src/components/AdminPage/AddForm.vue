<template>
  <div class="overlay">
    <div class="form md:w-2/4 w-5/6">
      <button @click="onClose" class="close-button">X</button>
      <h1 class="mb-3 text-white text-center md:text-2xl text-xl">Form Pengisian</h1>

      <form class="max-w-md mx-auto" @submit.prevent="submitForm">
        <!-- Item Name -->
        <div class="mb-5">
          <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Item Name</label>
          <input
            type="text"
            id="name"
            v-model="form.name"
            placeholder="Computer"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>

        <!-- Amount -->
        <div class="mb-5">
          <label for="amount" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Amount</label>
          <input
            type="number"
            id="amount"
            v-model="form.amount"
            placeholder="15"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            min="0"
          />
        </div>

        <!-- Condition -->
        <div class="mb-5">
          <label for="condition" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Condition</label>
          <select
            id="condition"
            v-model="form.condition"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          >
            <option value="" disabled>Select Condition</option>
            <option value="Very Good">Very Good</option>
            <option value="Good">Good</option>
            <option value="Bad">Bad</option>
            <option value="Broken">Broken</option>
          </select>
        </div>

        <!-- Kategori -->
        <div class="mb-5">
          <label for="kategori" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Kategori</label>
          <select
            id="kategori"
            v-model="form.kategori"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          >
            <option value="" disabled>Select Category</option>
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

        <button
          type="submit"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "AddForm",
  props: {
    onClose: {
      type: Function,
      required: false,
    },
  },
  data() {
    return {
      form: {
        pic: "",
        name: "",
        amount: null,
        condition: "",
        kategori: "", // Tambahkan properti kategori
      },
    };
  },
  methods: {
    submitForm() {
      console.log(this.form);

      // Gunakan URL API dari environment variable
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, ""); // Hilangkan trailing slash

      axios
        .post(`${API_BASE_URL}/admin`, this.form, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          console.log("Form submitted successfully:", response.data);

          // Menampilkan alert dengan SweetAlert2
          Swal.fire({
            title: "Success!",
            text: "Anjay dapet alat baru ya!",
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
              popup: 'rounded-xl', // Menambah rounding pada popup
              confirmButton: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-400', // Tombol hijau
            },
          });

          this.form = {
            pic: "",
            name: "",
            amount: null,
            condition: "",
            kategori: "", // Reset kategori
          };

          if (this.onClose) {
            this.onClose();
          }
        })
        .catch((error) => {
          console.error("Error submitting form:", error);

          // Menampilkan alert error dengan SweetAlert2
          Swal.fire({
            title: "Error!",
            text: "Failed to submit form. Please try again!",
            icon: "error",
            confirmButtonText: "OK",
            customClass: {
              popup: 'rounded-xl', // Konsisten dengan desain success
              confirmButton: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400', // Tombol merah untuk error
            },
          });
        });
    },
  },
};
</script>

