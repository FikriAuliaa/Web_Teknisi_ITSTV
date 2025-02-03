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
        element.classList.remove("hidden");

        setTimeout(() => {
          const options = {
            margin: 1,
            filename: `Invoice_${transaction.borrower_name}.pdf`,
            html2canvas: { scale: 2 },
            jsPDF: { orientation: "portrait" },
          };

          html2pdf()
            .from(element)
            .set(options)
            .save()
            .finally(() => {
              element.classList.add("hidden");
            });
        }, 500);
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
    <h1 class="font-bold text-3xl mb-2 text-center text-black">Invoice</h1>
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
    <!-- Kembali Button -->
    <div class="mb-6">
      <router-link
        to="/admin/home"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Kembali
      </router-link>
    </div>

    <!-- Table -->
    <div
      v-if="!loading && Borrow.length"
      class="overflow-x-auto border-collapse border border-gray-300 rounded-xl"
    >
      <table class="min-w-full bg-white">
        <thead class="bg-blue-800 text-white">
          <tr>
            <th
              class="px-6 py-3 text-center border border-gray-300 cursor-pointer"
              @click="toggleSort('borrow_date')"
            >
              Tanggal Peminjaman
            </th>
            <th
              class="px-6 py-3 text-center border border-gray-300 cursor-pointer"
              @click="toggleSort('item_name')"
            >
              Nama Alat
            </th>
            <th
              class="px-6 py-3 text-center border border-gray-300 cursor-pointer"
              @click="toggleSort('borrower_name')"
            >
              Peminjam
            </th>
            <th
              class="px-6 py-3 text-center border border-gray-300 cursor-pointer"
              @click="toggleSort('return_date')"
            >
              Tanggal Pengembalian
            </th>
            <th class="px-6 py-3 text-center border border-gray-300">Aksi</th>
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
              {{ formatDate(transaction.return_date) }}
            </td>
            <td class="border px-4 py-2 text-center">
              <button
                @click="exportToPDF(transaction)"
                class="bg-blue-500 text-white px-2 py-2 rounded-lg hover:bg-blue-700 mb-2"
              >
                Download
              </button>
              <button
                v-if="canBeReturned(transaction)"
                @click="returnItem(transaction._id)"
                class="bg-green-500 hover:bg-green-700 text-white py-2 px-5 rounded-lg text-sm"
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
</template>
