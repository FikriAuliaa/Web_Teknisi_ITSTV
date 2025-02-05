<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "EditOperator",
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const operator = ref(null);
    const form = ref({
      name: "",
      noTelp: "",
      email: "",
    });

    // Ambil URL API dari environment variable
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, ""); // Hilangkan trailing slash

    const fetchOperator = async () => {
      try {
        const result = await axios.get(`${API_BASE_URL}/operator/${props.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        operator.value = result.data;
        form.value = {
          name: operator.value.name || "",
          noTelp: operator.value.noTelp || "",
          email: operator.value.email || "",
        };
      } 
      catch (error) 
      {
        console.error("Error fetching operator:", error);
        //Ku comment alertnya karena dia bug
        // Swal.fire({
        //   icon: "error",
        //   title: "Gagal Memuat Data",
        //   text: "Tidak dapat memuat data operator. Silakan coba lagi.",
        //   // customClass: 
        //   // {
        //   //     popup: 'rounded-xl', // Menambah rounding pada popup
        //   //   },
        // });
      }
    };

    const submitForm = async () => {
      const updatedOperator = { ...form.value };

      try {
        await axios.patch(
          `${API_BASE_URL}/operator/${props.id}`,
          updatedOperator,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Teknisi berhasil diperbarui!",
          customClass: {
              popup: 'rounded-xl', // Menambah rounding pada popup
              confirmButton: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-400', // Tombol hijau
            },
        });
      } catch (error) {
        console.error("Error updating Operator:", error);
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Tidak dapat memperbarui operator. Silakan coba lagi.",
          customClass: {
              popup: 'rounded-xl', // Menambah rounding pada popup
            },
        });
      }
    };

    onMounted(() => {
      fetchOperator();
    });

    return {
      operator,
      form,
      submitForm,
    };
  },
};
</script>

<template>
  <div class="overlay">
    <div class="form md:w-2/4 w-5/6">
      <button @click="$router.push('/admin/all-operator')" class="close-button">
        X
      </button>
      <h1 class="mb-3 text-white text-center md:text-2xl text-xl">
        Edit Teknisi
      </h1>

      <form @submit.prevent="submitForm">
        <div class="mb-5">
          <label
            for="name"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Nama Teknisi</label
          >
          <input
            type="text"
            id="name"
            v-model="form.name"
            placeholder="Jonathan Doe"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            required
          />
        </div>

        <div class="mb-5">
          <label
            for="noTelp"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >No. HP</label
          >
          <input
            type="text"
            id="noTelp"
            v-model="form.noTelp"
            placeholder="+1-123-456-7890"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            required
          />
        </div>

        <div class="mb-5">
          <label
            for="email"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Email</label
          >
          <input
            type="email"
            id="email"
            v-model="form.email"
            placeholder="example@example.com"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            required
          />
        </div>

        <button
          type="submit"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Save Changes
        </button>
      </form>
    </div>
  </div>
</template>

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
