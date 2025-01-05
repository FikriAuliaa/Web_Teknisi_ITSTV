<template>
  <footer class="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-6">
    <div class="container mx-auto px-4">
      <!-- Logo Section -->
      <div class="text-center mb-4">
        <h1 class="text-2xl font-bold">ITS TV</h1>
        <p class="text-sm">Kabinet Gemilang</p>
      </div>

      <!-- Copyright Section -->
      <div class="mt-6 border-t border-white/20 pt-4 text-center">
        <p class="text-xs text-gray-400">
          &copy; 2024 Institut Teknologi Sepuluh Nopember. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "FancyFooter",
};
</script>

<style scoped>
footer {
  font-family: "Poppins", sans-serif;
}

footer a {
  transition: color 0.3s ease;
}

footer a:hover {
  color: #ffd700;
}

footer i {
  font-size: 1.2rem;
}
</style>
