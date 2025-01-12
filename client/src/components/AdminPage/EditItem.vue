<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import router from "@/router";

export default {
  name: "EditItem",
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const item = ref(null);
    const form = ref({
      name: "",
      amount: "",
      condition: "",
      kategori: "", // Tambahkan properti kategori
    });

    // Ambil URL API dari environment variable
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, ""); // Hilangkan trailing slash

    const fetchItem = async () => {
      try {
        const result = await axios.get(`${API_BASE_URL}/admin/${props.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        item.value = result.data;

        // Tetapkan default kategori ke "Lain-lain" jika tidak ada kategori
        form.value = {
          ...item.value,
          kategori: item.value.kategori || "Lain-lain",
        };
      } catch (error) {
        console.error("Error fetching item:", error);
      }
    };

    const submitForm = async () => {
      const updatedItem = {};

      if (form.value.name !== item.value.name) {
        updatedItem.name = form.value.name;
      }
      if (form.value.amount !== item.value.amount) {
        updatedItem.amount = form.value.amount;
      }
      if (form.value.condition !== item.value.condition) {
        updatedItem.condition = form.value.condition;
      }
      if (form.value.kategori !== item.value.kategori) {
        updatedItem.kategori = form.value.kategori;
      }

      if (Object.keys(updatedItem).length === 0) {
        alert("No changes made.");
        return;
      }

      try {
        await axios.patch(`${API_BASE_URL}/admin/${props.id}`, updatedItem, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        alert("Item updated successfully!");
        router.push("/admin");
      } catch (error) {
        console.error("Error updating item:", error);
        alert("Failed to update item. Please try again.");
      }
    };

    onMounted(() => {
      fetchItem();
    });

    return {
      form,
      submitForm,
    };
  },
};
</script>

<template>
  <div class="overlay">
    <div class="form md:w-2/4 w-5/6">
      <button @click="$router.push('/admin')" class="close-button">X</button>
      <h1 class="mb-3 text-white text-center md:text-2xl text-xl">Edit Item</h1>

      <form @submit.prevent="submitForm">
        <div class="mb-5">
          <label
            for="name"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Item Name</label
          >
          <input
            type="text"
            id="name"
            v-model="form.name"
            placeholder="Computer"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          />
        </div>

        <div class="mb-5">
          <label
            for="amount"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Amount</label
          >
          <input
            type="number"
            id="amount"
            v-model="form.amount"
            placeholder="15"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            min="0"
          />
        </div>

        <div class="mb-5">
          <label
            for="condition"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Condition</label
          >
          <select
            id="condition"
            v-model="form.condition"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          >
            <option value="" disabled>Select Condition</option>
            <option value="Very Good">Very Good</option>
            <option value="Good">Good</option>
            <option value="Bad">Bad</option>
            <option value="Broken">Broken</option>
          </select>
        </div>

        <div class="mb-5">
          <label
            for="kategori"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Kategori</label
          >
          <select
            id="kategori"
            v-model="form.kategori"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
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
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Save Changes
        </button>
      </form>
    </div>
  </div>
</template>
