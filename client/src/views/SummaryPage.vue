<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-4">Invoice</h1>

    <!-- Error State -->
    <div v-if="error" class="text-red-500 text-center mb-4">
      {{ error }}
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center text-lg">
      Loading data, please wait...
    </div>

    <!-- Table -->
    <div v-if="!loading && Borrow.length" class="overflow-x-auto">
      <table class="min-w-full bg-white border-collapse border border-gray-300">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-6 py-3 text-center border border-gray-300">No</th>
            <th class="px-6 py-3 text-center border border-gray-300">
              Nama Alat
            </th>
            <th class="px-6 py-3 text-center border border-gray-300">Jumlah</th>
            <th class="px-6 py-3 text-center border border-gray-300">
              Tanggal Peminjaman
            </th>
            <th class="px-6 py-3 text-center border border-gray-300">
              Tanggal Pengembalian
            </th>
            <th class="px-6 py-3 text-center border border-gray-300">
              Peminjam
            </th>
            <th class="px-6 py-3 text-center border border-gray-300">
              Teknisi
            </th>
            <th class="px-6 py-3 text-center border border-gray-300">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(transaction, index) in Borrow" :key="transaction._id">
            <td class="border px-4 py-2 text-center">{{ index + 1 }}</td>
            <td class="border px-4 py-2 text-center">
              <div v-for="item in transaction.items" :key="item.item_id">
                {{ item.item_name }}
              </div>
            </td>
            <td class="border px-4 py-2 text-center">
              <div v-for="item in transaction.items" :key="item.item_id">
                {{ item.amount }}
              </div>
            </td>
            <td class="border px-4 py-2 text-center">
              {{ formatDate(transaction.borrow_date) }}
            </td>
            <td class="border px-4 py-2 text-center">
              {{ formatDate(transaction.return_date) }}
            </td>

            <td class="border px-4 py-2 text-center">
              {{ transaction.borrower_name }}
            </td>
            <td class="border px-4 py-2 text-center">
              {{ transaction.officer_name }}
            </td>
            <td class="border px-4 py-2 text-center">
              <button
                @click="exportToPDF(transaction)"
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Download PDF
              </button>
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

    <!-- Hidden Invoice Template -->
    <div id="invoice-template" v-if="selectedTransaction" class="hidden">
      <div style="display: flex; align-items: center; margin: 1rem">
        <img src="../assets/logo.png" alt="logo" class="w-52" />
      </div>
      <div class="text-center text-3xl font-bold">Borrowing Item</div>
      <div class="text-center text-3xl font-bold mb-3">Invoice</div>
      <div class="text-left text-md m-10">
        <table class="text-left">
          <tbody>
            <tr>
              <td class="py-2">Borrower Name:</td>
              <td class="px-6 py-2">{{ selectedTransaction.borrower_name }}</td>
            </tr>
            <tr>
              <td class="py-2">Operator:</td>
              <td class="px-6 py-2">{{ selectedTransaction.officer_name }}</td>
            </tr>
            <tr>
              <td class="py-2">Borrow Date:</td>
              <td class="px-6 py-2">{{ selectedTransaction.borrow_date }}</td>
            </tr>
            <tr>
              <td class="py-2">Return Date:</td>
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
              <th class="border px-4 py-2">Item Name</th>
              <th class="border px-4 py-2">Amount</th>
            </tr>
          </thead>
          <tbody style="border: 1px solid black">
            <tr v-for="item in selectedTransaction.items" :key="item.item_id">
              <td class="border px-4 py-2">{{ item.item_name }}</td>
              <td class="border px-4 py-2">{{ item.amount }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="text-left text-md m-10">
        <p>
          Thank you for using our borrowing service. Below are the details of
          the items you have borrowed. Please ensure to return the items by the
          specified return date to avoid any late fees. If you have any
          questions or need further assistance, feel free to contact our support
          team.
        </p>
        <p>We hope you have a great experience with our service!</p>
      </div>

      <div class="text-end text-md mt-20 mr-6 mb-4">
        <p>Signature</p>
        <p>Admin</p>
        <p>Lab KCKS</p>
        <p>Surabaya, Indonesia</p>
        <div class="flex justify-end mt-4">
          <img src="../assets/signature.png" alt="signature" class="w-32" />
        </div>
        <p>(Agus Setiawan)</p>
        <p>Invoice generated on {{ new Date().toLocaleDateString() }}</p>
      </div>
    </div>
  </div>
</template>

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
    };
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return "N/A"; // Handle null or undefined dates
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
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
          borrow_date: this.formatDate(transaction.borrow_date),
          return_date: this.formatDate(transaction.return_date),
        }));
      } catch (error) {
        this.error = "Failed to fetch data. Please try again later.";
      } finally {
        this.loading = false;
      }
    },

    exportToPDF(transaction) {
      this.selectedTransaction = transaction;

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
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped>
.hidden {
  display: none;
}
</style>
