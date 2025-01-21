<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-4">Invoice</h1>

    <!-- Error state -->
    <div v-if="error" class="text-red-500 text-center mb-4">
      {{ error }}
    </div>

    <!-- Loading state -->
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
              {{ transaction.borrow_date }}
            </td>
            <td class="border px-4 py-2 text-center">
              {{ transaction.return_date }}
            </td>
            <td class="border px-4 py-2 text-center">
              {{ transaction.borrower_name }}
            </td>
            <td class="border px-4 py-2 text-center">
              {{ transaction.officer_name }}
            </td>
            <td class="border px-4 py-2 text-center">
              <button
                @click="exportRowToPDF(transaction)"
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Download PDF
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty state -->
    <div
      v-if="!loading && !Borrow.length"
      class="text-center text-gray-500 dark:text-gray-400"
    >
      Tidak ada data peminjaman yang tersedia.
    </div>
  </div>
</template>

<script>
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default {
  name: "SummaryPage",
  data() {
    return {
      Borrow: [],
      error: "",
      loading: true,
    };
  },
  methods: {
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
        if (response.data && response.data.data) {
          this.Borrow = response.data.data;
        } else {
          this.error = "Data not in expected format.";
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        this.error = "Error fetching data. Please try again later.";
      } finally {
        this.loading = false;
      }
    },
    exportRowToPDF(transaction) {
      const doc = new jsPDF();
      doc.text("Invoice", 14, 10);

      // Detail Informasi
      doc.text(`Peminjam: ${transaction.borrower_name}`, 14, 20);
      doc.text(`Teknisi: ${transaction.officer_name}`, 14, 30);
      doc.text(`Tanggal Peminjaman: ${transaction.borrow_date}`, 14, 40);
      doc.text(`Tanggal Pengembalian: ${transaction.return_date}`, 14, 50);

      // Tabel Data Alat
      const tableColumn = ["Nama Alat", "Jumlah"];
      const tableRows = transaction.items.map((item) => [
        item.item_name,
        item.amount,
      ]);

      doc.autoTable({
        startY: 60,
        head: [tableColumn],
        body: tableRows,
      });

      // Unduh PDF
      doc.save(`Invoice_${transaction.borrower_name}.pdf`);
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  text-align: left;
  padding: 8px;
}
th {
  background-color: #f2f2f2;
}
</style>
