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
  <div class="mt-10 mb-4">
    <h1 class="font-bold text-3xl mb-2 text-center text-black md:text-slate-50">
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
