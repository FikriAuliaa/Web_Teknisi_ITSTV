<template>
  <footer class="bg-gradient-to-l from-blue-900 to-blue-600 text-white py-6 px-4 z-50">
    <div class="item-center grid items-center md:justify-items-center md:gap-10 lg:grid-cols-2">
      <div class="mb-6 md:mb-0 ml-0 md:w-2/3">
        <div class="w-1/2 md:w-2/3">
          <img class="h-12 w-36" src="../../assets/footeritstv.png" />
        </div>
        <div class="flex flex-col gap-1 py-3 text-left font-thin text-sm">
          <p>
            <span class="mr-3">&copy;</span>
            2025 ITS TV
          </p>
          <p>Website by Gemilang ITS TV</p>
        </div>
      </div>
      <div class="mb-6 flex flex-col gap-3 text-left text-sm md:mb-0">
        <div>
          <h3 class="my-2 font-bold">Alamat</h3>
          <p class="font-thin">Gd. Perpustakaan ITS, lt. 6, Keputih, Sukolilo</p>
          <p class="font-thin">Surabaya, Jawa Timur 60117</p>
        </div>
        <div>
          <h3 class="my-2 font-bold">Kontak</h3>
          <p class="font-thin">
            Phone:
            <a href="https://wa.me/6285189351148" target="_blank" rel="noreferrer"> +6285189351148 </a>
          </p>
          <p class="font-thin">
            Email:
            <a href="mailto:kabinetgemilangitstv@gmail.com" class="" target="_blank" rel="noreferrer"> kabinetgemilangitstv@gmail.com </a>
          </p>
        </div>
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
