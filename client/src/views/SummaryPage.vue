<script>
import axios from "axios";
import html2pdf from "html2pdf.js";

export default {
  name: "SummaryPage",
  data() {
    return {
      Borrow: [],
      selectedTransaction: null,
      error: "",
      loading: true,

      // Pagination
      currentPage: 1,
      itemsPerPage: 10,

      // Sorting
      sortField: "borrow_date",
      sortDirection: "asc",
    };
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return "N/A"; // Handle null or undefined dates
      try {
        const date = new Date(dateString);
        if (isNaN(date)) throw new Error("Invalid date format");
        return date.toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "UTC", // Adjust based on your time zone needs
        });
      } catch (error) {
        console.error("Error formatting date:", error);
        return "Invalid Date";
      }
    },

    async fetchData() {
      this.loading = true;
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}borrow`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        this.Borrow = response.data.data.map((transaction) => ({
          ...transaction,
          borrow_date: transaction.borrow_date,
          return_date: transaction.return_date,
        }));
      } catch (error) {
        this.error = "Failed to fetch data. Please try again later.";
      } finally {
        this.loading = false;
      }
    },

    // Sorting function
    toggleSort(field) {
      if (this.sortField === field) {
        this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
      } else {
        this.sortField = field;
        this.sortDirection = "asc";
      }
    },

    // Sort borrowed items based on the selected field and direction
    sortedBorrowedItems() {
      return [...this.Borrow].sort((a, b) => {
        let compareResult = 0;
        switch (this.sortField) {
          case "item_name":
            compareResult = (a.items?.[0]?.item_name || "").localeCompare(
              b.items?.[0]?.item_name || ""
            );
            break;
          case "borrower_name":
            compareResult = (a.borrower_name || "").localeCompare(
              b.borrower_name || ""
            );
            break;
          case "officer_name":
            compareResult = (a.officer_name || "").localeCompare(
              b.officer_name || ""
            );
            break;
          case "borrow_date":
            compareResult =
              new Date(a.borrow_date || 0) - new Date(b.borrow_date || 0);
            break;
          case "return_date":
            compareResult =
              new Date(a.return_date || 0) - new Date(b.return_date || 0);
            break;
        }
        return this.sortDirection === "asc" ? compareResult : -compareResult;
      });
    },

    // Pagination
    paginatedItems() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.sortedBorrowedItems().slice(startIndex, endIndex);
    },

    totalPages() {
      return Math.ceil(this.Borrow.length / this.itemsPerPage);
    },

    changePage(pageNumber) {
      if (pageNumber >= 1 && pageNumber <= this.totalPages()) {
        this.currentPage = pageNumber;
      }
    },

    exportToPDF(transaction) {
      this.selectedTransaction = {
        ...transaction,
        borrow_date: this.formatDate(transaction.borrow_date),
        return_date: this.formatDate(transaction.return_date),
      };

      this.$nextTick(() => {
        const element = document.getElementById("invoice-template");
        if (element) {
          element.classList.remove("hidden"); // Menampilkan template invoice

          setTimeout(() => {
            const options = {
              margin: 1,
              filename: `Invoice_${transaction.borrower_name}.pdf`,
              html2canvas: { scale: 2 },
              jsPDF: { orientation: "portrait" },
            };

            // Generate PDF
            html2pdf()
              .from(element)
              .set(options)
              .save()
              .finally(() => {
                element.classList.add("hidden"); // Menyembunyikan kembali setelah download
              });
          }, 500);
        } else {
          console.error("Invoice template element not found.");
        }
      });
    },
    async returnItem(borrowId) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}borrow/return/${borrowId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        this.fetchData(); // Refresh data after return
      } catch (error) {
        this.error =
          error.response?.data?.message || "Error confirming return.";
      }
    },

    canBeReturned(transaction) {
      return !transaction.is_returned;
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<template>
  <div class="container mx-auto px-4 py-8 mt-20">
    <!-- Kembali Button -->
    <div class="mb-6">
      <router-link
        to="/admin/home"
        class=" text-white px-4 py-2 rounded-lg bg-gradient-to-l from-blue-900 to-blue-600 hover:to-blue-500"
      >
        Kembali
      </router-link>
    </div>
    <h1 class="font-bold text-3xl mb-6 text-center text-black">Invoice</h1>

    <!-- Error State -->
    <div v-if="error" class="text-red-500 text-center mb-4">
      {{ error }}
    </div>

    <!-- Loading State -->
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
        <p class="mt-2 text-gray-500 italic">
          Satu Tekad, Satu Tujuan ITS TV Eureka!
        </p>
      </div>
    </div>
    

    <!-- Table -->
    <div v-if="!loading && Borrow.length" class="overflow-x-auto border rounded-lg shadow-lg">
      <table class="table-auto min-w-full border-collapse bg-white">
        <thead class="bg-blue-800 text-white">
          <tr>
            <th class="px-6 py-3 border border-gray-300 text-center">
              Tanggal Peminjaman
              <button @click="toggleSort('borrow_date')" class="ml-2">
                <img src="../assets/filter.svg" class="w-5 inline" alt="filter icon" />
              </button>
            </th>
            <th class="px-6 py-3 border border-gray-300 text-center">
              Nama Alat
              <button @click="toggleSort('item_name')" class="ml-2">
                <img src="../assets/filter.svg" class="w-5 inline" alt="filter icon" />
              </button>
            </th>
            <th class="px-6 py-3 border border-gray-300 text-center">
              Peminjam
              <button @click="toggleSort('borrower_name')" class="ml-2">
                <img src="../assets/filter.svg" class="w-5 inline" alt="filter icon" />
              </button>
            </th>
            <th class="px-6 py-3 border border-gray-300 text-center">
              Teknisi
              <button @click="toggleSort('officer_name')" class="ml-2">
                <img src="../assets/filter.svg" class="w-5 inline" alt="filter icon" />
              </button>
            </th>
            <th class="px-6 py-3 border border-gray-300 text-center">
              Tanggal Pengembalian
              <button @click="toggleSort('return_date')" class="ml-2">
                <img src="../assets/filter.svg" class="w-5 inline" alt="filter icon" />
              </button>
            </th>
            <th class="px-6 py-3 border border-gray-300 text-center">
              Aksi
              <!-- <button @click="toggleSort('action')" class="ml-2">
                <img src="../assets/filter.svg" class="w-5 inline" alt="filter icon" />
              </button> -->
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(transaction, index) in paginatedItems()"
            :key="transaction._id"
          >
            <td class="border px-4 py-2 text-center">
              {{ formatDate(transaction.borrow_date) }}
            </td>
            <td class="border px-4 py-2 text-center">
              <div v-for="item in transaction.items" :key="item.item_id">
                {{ item.item_name }}
              </div>
            </td>
            <td class="border px-4 py-2 text-center">
              {{ transaction.borrower_name }}
            </td>
            <td class="border px-4 py-2 text-center">
              {{ transaction.officer_name }}
            </td>
            <td class="border px-4 py-2 text-center">
              {{ formatDate(transaction.return_date) }}
            </td>
            <td class="border px-4 py-2 text-center">
              <button
                @click="exportToPDF(transaction)"
                class="bg-blue-500 text-white px-2 py-2 rounded-lg hover:bg-blue-700 mb-2 mr-2"
              >
                Download
              </button>
              <button
                v-if="canBeReturned(transaction)"
                @click="returnItem(transaction._id)"
                class="bg-green-500 hover:bg-green-700 text-white py-2 px-5 rounded-lg text-sm mb-2"
              >
                Return
              </button>
              <span v-else class="text-gray-500 italic text-sm p-2"
                >Returned</span
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div
      v-if="!loading && !Borrow.length"
      class="text-center text-gray-500 dark:text-gray-400"
    >
      Tidak ada data peminjaman yang tersedia.
    </div>

    <!-- Pagination Controls -->
    <div class="flex justify-center items-center mt-4">
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage <= 1"
        class="px-4 py-2 text-white bg-blue-600 hover:bg-blue-500 rounded disabled:opacity-50"
      >
        Previous
      </button>
      <span class="mx-4">{{ currentPage }} / {{ totalPages() }}</span>
      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage >= totalPages()"
        class="px-4 py-2 text-white bg-blue-600 hover:bg-blue-500 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
  <!-- Hidden Invoice Template -->
  <div id="invoice-template" v-if="selectedTransaction" class="hidden">
    <div style="display: flex; align-items: center; margin: 1rem">
      <img src="../assets/logo.png" alt="logo" class="w-52" />
    </div>
    <div class="text-center text-3xl font-bold">Invoice</div>
    <div class="text-center text-3xl font-bold mb-3">Peminjaman Barang</div>
    <div class="text-left text-md m-10">
      <table class="text-left">
        <tbody>
          <tr>
            <td class="py-2">Peminjam:</td>
            <td class="px-6 py-2">{{ selectedTransaction.borrower_name }}</td>
          </tr>
          <tr>
            <td class="py-2">Teknisi:</td>
            <td class="px-6 py-2">{{ selectedTransaction.officer_name }}</td>
          </tr>
          <tr>
            <td class="py-2">Tanggal Peminjaman:</td>
            <td class="px-6 py-2">{{ selectedTransaction.borrow_date }}</td>
          </tr>
          <tr>
            <td class="py-2">Tanggal Pengembalian:</td>
            <td class="px-6 py-2">{{ selectedTransaction.return_date }}</td>
          </tr>
        </tbody>
      </table>

      <table
        class="table-auto w-full text-left border-collapse mt-8"
        style="border: 1px solid black"
      >
        <thead style="border: 1px solid black">
          <tr>
            <th class="border px-4 py-2">Nama Barang</th>
          </tr>
        </thead>
        <tbody style="border: 1px solid black">
          <tr v-for="item in selectedTransaction.items" :key="item.item_id">
            <td class="border px-4 py-2">{{ item.item_name }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="text-end text-md mt-20 mr-6 mb-4">
      <p>Kepala Divisi Teknisi</p>
      <p>Surabaya, Indonesia</p>
      <div class="flex justify-end mt-4">
        <img src="../assets/signature.png" alt="signature" class="w-32" />
      </div>
      <p>(Aiman Ahmad O.)</p>
      <p>Invoice dibuat pada {{ new Date().toLocaleDateString() }}</p>
    </div>
  </div>
</template>

<style scoped>
th, td {
  white-space: nowrap;
}
table {
  width: 100%;
  text-align: center;
}
</style>
