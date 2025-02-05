<template>
  <div class="overlay">
    <div class="form md:w-2/4 w-5/6">
      <button @click="onClose" class="close-button">X</button>
      <h1 class="mb-3 text-white text-center md:text-2xl text-xl">
        Tambah Teknisi
      </h1>
      <form class="max-w-md mx-auto" @submit.prevent="submitForm">
        <div class="mb-5">
          <label
            for="name"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Nama</label
          >
          <input
            type="text"
            id="name"
            v-model="form.name"
            placeholder="Jonathan Doe"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
        <div class="mb-5">
          <label
            for="Email"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Email</label
          >
          <input
            type="text"
            id="Email"
            v-model="form.Email"
            placeholder="example@example.com"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
        <div class="mb-5">
          <label
            for="NoTelp"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >No. HP</label
          >
          <input
            type="text"
            id="NoTelp"
            v-model="form.NoTelp"
            placeholder="+1-123-456-7890"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
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
  name: "OperatorAdd",
  props: {
    onClose: {
      type: Function,
      required: false,
    },
  },
  data() {
    return {
      form: {
        name: "",
        NoTelp: "",
        Email: "",
      },
    };
  },
  methods: {
    async submitForm() {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "");

      try {
        const response = await axios.post(`${API_BASE_URL}/operator`, this.form, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // Tampilkan alert sukses
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Anjay ada teknisi baru!",
          // confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
          customClass: {
              popup: 'rounded-xl', // Menambah rounding pada popup
              confirmButton: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-400', // Tombol hijau
            },
        }).then(() => {
          this.form = {
            name: "",
            NoTelp: "",
            Email: "",
          };

          if (this.onClose) {
            this.onClose();
          }

          window.location.reload();
        });
      } catch (error) {
        // Tampilkan alert error
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Error submitting form. Mohon cek kembali!",
          confirmButtonColor: "#d33",
          confirmButtonText: "Coba Lagi",
          customClass: {
              popup: 'rounded-xl', // Menambah rounding pada popup
            },
        });

        console.error("Error submitting form:", error);
      }
    },
  },
};
</script>

<style>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 998;
}
.form {
  position: relative;
  padding: 3rem;
  background-color: rgb(31 41 55);
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  z-index: 999;
}
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}
</style>
