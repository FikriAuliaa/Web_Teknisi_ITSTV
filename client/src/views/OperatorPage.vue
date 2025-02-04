<script>
import OperatorView from "@/components/Operator/OperatorView.vue";
import OperatorAdd from "@/components/Operator/OperatorAdd.vue";

export default {
  name: "OperatorPage",
  components: {
    OperatorView,
    OperatorAdd,
  },
  data() {
    return {
      formActive: false,
    };
  },
  methods: {
    toggleForm() {
      this.formActive = !this.formActive;
    },
    closeForm() {
      this.formActive = false;
    },
  },
};
</script>

<template>
  <div class="mt-20 mb-4 max-w-7xl mx-auto">
    <!-- Kembali Button -->
    <div class="mb-6">
      <router-link
        to="/admin/home"
        class="bg-gradient-to-l from-blue-900 to-blue-600 hover:to-blue-500 text-white px-4 py-2 rounded-lg "
      >
        Kembali
      </router-link>
    </div>
    <h1 class="font-bold text-3xl mb-2 text-center text-black">
      Daftar Teknisi
    </h1>
    <OperatorView />

    <button
      class="tombol hover:bg-green-700 transition-all"
      @click="toggleForm"
    >
      +
    </button>
    <OperatorAdd v-if="formActive" @close="closeForm" />
  </div>
</template>

<style>
.tombol {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #4caf50;
  color: white;
  text-align: center;
  font-size: 30px;
}
</style>
