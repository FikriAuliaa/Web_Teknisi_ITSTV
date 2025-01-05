<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

export default {
  name: "OperatorView",
  setup() {
    const operators = ref([]);
    const error = ref("");
    const loading = ref(true);
    const router = useRouter();

    const fetchData = async () => {
      loading.value = true;
      try {
        const result = await axios.get("http://localhost:4000/operator", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (result.data && result.data.data) {
          operators.value = result.data.data;
        } else {
          error.value = "Data not in expected format.";
        }
      } catch (err) {
        error.value = "Error fetching data. Please try again later.";
      } finally {
        loading.value = false;
      }
    };

    const deleteOperator = async (id) => {
      try {
        await axios.delete(`http://localhost:4000/operator/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        alert("Operator deleted successfully!");
        operators.value = operators.value.filter(
          (operator) => operator._id !== id
        );
        fetchData();
      } catch (err) {
        error.value = "Error deleting operator. Please try again later.";
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
        <p class="mt-2 text-gray-500">Loading operators...</p>
      </div>
    </div>

    <div v-if="error" class="text-red-500 text-center">
      {{ error }}
    </div>

    <div
      v-if="!loading && operators.length"
      class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <div
        v-for="operator in operators"
        :key="operator._id"
        class="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col h-full"
      >
        <div class="flex flex-col items-center pb-10 mt-6">
          <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">
            {{ operator.name }}
          </h5>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ operator.Email }}
          </span>

          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ operator.NoTelp }}
          </p>
          <div class="flex mt-4 md:mt-6">
            <a
              href="#"
              @click.prevent="navigateToEditPage(operator._id)"
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >Edit</a
            >
            <a
              href="#"
              @click.prevent="deleteOperator(operator._id)"
              class="py-2 px-4 ms-2 text-sm font-medium text-white focus:outline-none bg-red-600 rounded-lg border border-red-700 hover:bg-red-700 hover:text-white focus:z-10 focus:ring-4 focus:ring-red-200"
              >Remove</a
            >
          </div>
        </div>
      </div>
    </div>

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
