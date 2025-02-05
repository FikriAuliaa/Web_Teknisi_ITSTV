<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import Swal from "sweetalert2"; // Import SweetAlert2

export default {
  name: "OperatorView",
  setup() {
    const operators = ref([]);
    const error = ref("");
    const loading = ref(true);
    const router = useRouter();

    // Ambil URL API dari environment variable
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, ""); // Hilangkan trailing slash

    const fetchData = async () => {
      loading.value = true;
      try {
        const result = await axios.get(`${API_BASE_URL}/operator`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (result.data && result.data.data) {
          operators.value = result.data.data;
        } else {
          error.value = "Data format is incorrect.";
        }
      } catch (err) {
        error.value = "Failed to fetch data. Please try again later.";
        console.error("Error fetching data:", err);
      } finally {
        loading.value = false;
      }
    };

    const deleteOperator = async (id) => {
      try {
        const confirmResult = await Swal.fire({
          title: "Yakin ta?",
          text: "Teknisinya jadi ilang dong!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Ya, apus!",
          cancelButtonText: "Gak jadi",
          customClass: {
            popup: "rounded-xl",
            confirmButton: "bg-green-500 text-white hover:bg-green-600 focus:ring-green-400",
            cancelButton: "bg-gray-300 text-black hover:bg-gray-400 focus:ring-gray-200",
          },
        });

        if (confirmResult.isConfirmed) {
          await axios.delete(`${API_BASE_URL}/operator/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          Swal.fire({
            title: "Dah dihapus bang!",
            text: "Semoga nnti dapet teknisi baru.",
            icon: "success",
            customClass: {
              popup: "rounded-xl",
              confirmButton: "bg-green-500 text-white hover:bg-green-600 focus:ring-green-400",
            },
          });

          // Perbarui daftar operator tanpa memanggil ulang fetchData
          operators.value = operators.value.filter((operator) => operator._id !== id);
        }
      } catch (err) {
        console.error("Error deleting operator:", err);
        Swal.fire({
          title: "Error!",
          text: "Error deleting operator. Please try again later.",
          icon: "error",
          customClass: {
            popup: "rounded-xl",
            confirmButton: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400",
          },
        });
      }
    };

    const navigateToEditPage = (id) => {
      router.push(`/admin/editoperator/${id}`);
    };

    onMounted(() => {
      fetchData();
    });

    return {
      operators,
      error,
      loading,
      deleteOperator,
      navigateToEditPage,
    };
  },
};
</script>

<template>
  <div class="mt-6">
    <!-- Loading Spinner -->
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
        <p class="mt-2 text-gray-500 italic">Satu Tekad, Satu Tujuan ITS TV Eureka!</p>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="text-red-500 text-center">
      {{ error }}
    </div>

    <!-- Operators List -->
    <div
      v-if="!loading && operators.length"
      class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <div
        v-for="operator in operators"
        :key="operator._id"
        class="bg-white border border-gray-200 rounded-lg shadow flex flex-col h-full"
      >
        <div class="flex flex-col items-center pb-10 mt-6">
          <h5 class="mb-1 text-xl font-medium text-gray-900">
            {{ operator.name }}
          </h5>
          <span class="text-sm text-gray-500">
            {{ operator.Email }}
          </span>
          <p class="text-sm text-gray-500">
            {{ operator.NoTelp }}
          </p>
          <div class="flex mt-4 md:mt-6">
            <a
              href="#"
              @click.prevent="navigateToEditPage(operator._id)"
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
            >
              Edit
            </a>
            <a
              href="#"
              @click.prevent="deleteOperator(operator._id)"
              class="py-2 px-4 ms-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300"
            >
              Remove
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- No Operators Message -->
    <p v-if="!loading && !operators.length" class="text-gray-500 text-center">
      No operators available.
    </p>
  </div>
</template>

<style>
.grid {
  row-gap: 1.5rem;
}
</style>
