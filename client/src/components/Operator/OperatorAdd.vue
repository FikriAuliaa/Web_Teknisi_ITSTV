<template>
  <div class="overlay">
    <div class="form md:w-2/4 w-5/6">
      <button @click="onClose" class="close-button">X</button>
      <h1 class="mb-3 text-white text-center md:text-2xl text-xl">
        New Operator Form
      </h1>
      <form class="max-w-md mx-auto" @submit.prevent="submitForm">
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
            >Phone Number</label
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
    submitForm() {
      console.log(this.form);

      axios
        .post("http://localhost:4000/operator", this.form, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          console.log("Form submitted successfully:", response.data);
          alert("Form submitted successfully!");

          this.form = {
            image: "",
            name: "",
            age: null,
            NoTelp: "",
            Email: "",
          };

          if (this.onClose) {
            this.onClose();
          }

          window.location.reload();
        })
        .catch((error) => {
          console.error("Error submitting form:", error);
        });
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
