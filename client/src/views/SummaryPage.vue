<script>
import { ref, onMounted, nextTick } from "vue";
import axios from "axios";
import html2pdf from "html2pdf.js";

export default {
  name: "SummaryPage",
  setup() {
    const Borrow = ref([]);
    const error = ref("");
    const loading = ref(true);
    const selectedRow = ref(null);
    const invoiceData = ref({});
    const sortKey = ref("");
    const sortOrder = ref(1);

    // Ambil URL API dari environment variable
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, ""); // Hilangkan trailing slash

    const formatDate = (dateString) => {
      if (!dateString) return "Not Yet Returned";
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const fetchData = async () => {
      loading.value = true;
      try {
        const result = await axios.get(`${API_BASE_URL}/borrow`);
        if (result.data && result.data.data) {
          Borrow.value = result.data.data.map((borrow) => ({
            ...borrow,
            borrow_date: formatDate(borrow.borrow_date),
            return_date: formatDate(borrow.return_date),
          }));
        } else {
          error.value = "Data not in expected format.";
        }
      } catch (err) {
        error.value = "Error fetching data. Please try again later.";
      } finally {
        loading.value = false;
      }
    };

    const exportToPDF = async () => {
      try {
        if (!selectedRow.value) {
          alert("No row selected. Please select a record.");
          return;
        }

        const response = await axios.get(
          `${API_BASE_URL}/borrow/${selectedRow.value}`
        );
        const data = response.data.data;

        invoiceData.value = {
          borrower_name: data.borrower_name,
          officer_name: data.officer_name,
          borrow_date: formatDate(data.borrow_date),
          return_date: formatDate(data.return_date),
          item_name: data.item_name,
          amount: data.amount,
        };

        await nextTick();

        const element = document.querySelector("#invoice-template");
        if (!element) {
          alert("Invoice template not found. Please check your template.");
          return;
        }

        element.style.display = "block";

        await html2pdf()
          .from(element)
          .set({
            margin: 1,
            filename: `Invoice-${data.borrower_name}.pdf`,
            html2canvas: { scale: 2 },
            jsPDF: { orientation: "portrait" },
          })
          .save();

        element.style.display = "none";
      } catch (error) {
        alert("Failed to generate PDF. Please try again.");
      }
    };

    const sortBy = (key) => {
      if (sortKey.value === key) {
        sortOrder.value = -sortOrder.value;
      } else {
        sortKey.value = key;
        sortOrder.value = 1;
      }
      Borrow.value.sort((a, b) => {
        if (a[key] < b[key]) return -sortOrder.value;
        if (a[key] > b[key]) return sortOrder.value;
        return 0;
      });
    };

    onMounted(() => {
      fetchData();
    });

    return {
      Borrow,
      error,
      loading,
      exportToPDF,
      selectedRow,
      invoiceData,
      sortBy,
    };
  },
};
</script>

<template>
  <div class="mt-10">
    <h1 class="font-bold text-3xl mb-4 text-center text-white">Invoice</h1>

    <div v-if="error" class="text-red-500 text-center mb-4">
      {{ error }}
    </div>

    <div v-if="loading" class="text-center text-lg">
      Loading data, please wait...
    </div>

    <div class="text-right mb-4">
      <button
        v-if="selectedRow"
        @click="exportToPDF"
        class="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-700 transition duration-200"
      >
        Download PDF
      </button>
    </div>

    <table
      class="table-fixed border border-black border-separate bg-white w-full text-center rounded-xl p-4 md:text-xl text-sm"
    >
      <thead>
        <tr>
          <th @click="sortBy('index')" class="hover:cursor-pointer">No</th>
          <th @click="sortBy('item_name')" class="hover:cursor-pointer">
            Nama Alat
          </th>
          <th @click="sortBy('amount')" class="hover:cursor-pointer">Jumlah</th>
          <th @click="sortBy('borrow_date')" class="hover:cursor-pointer">
            Tanggal Peminjaman
          </th>
          <th @click="sortBy('return_date')" class="hover:cursor-pointer">
            Tanggal Pengembalian
          </th>
          <th @click="sortBy('borrower_name')" class="hover:cursor-pointer">
            Peminjam
          </th>
          <th @click="sortBy('officer_name')" class="hover:cursor-pointer">
            Teknisi
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(borrowed, index) in Borrow"
          :key="borrowed._id"
          @click="selectedRow = borrowed._id"
          :class="{ 'bg-gray-300': selectedRow === borrowed._id }"
          class="hover:bg-gray-200 cursor-pointer"
        >
          <td>{{ index + 1 }}</td>
          <td>{{ borrowed.item_name }}</td>
          <td>{{ borrowed.amount }}</td>
          <td>{{ borrowed.borrow_date }}</td>
          <td>{{ borrowed.return_date }}</td>
          <td>{{ borrowed.borrower_name }}</td>
          <td>{{ borrowed.officer_name }}</td>
        </tr>
      </tbody>
    </table>

    <div id="invoice-template" ref="invoice" style="display: none">
      <div style="display: flex; align-items: center; margin: 1rem">
        <img src="../assets/logo.png" alt="logo" class="w-52" />
      </div>
      <div class="text-center text-3xl font-bold">Invoice</div>
      <div class="text-center text-3xl font-bold mb-3">Peminjaman Alat</div>
      <div class="text-left text-md m-10">
        <table class="text-left">
          <tbody>
            <tr>
              <td class="py-2">Peminjam:</td>
              <td class="px-6 py-2">{{ invoiceData.borrower_name }}</td>
            </tr>
            <tr>
              <td class="py-2">Teknisi:</td>
              <td class="px-6 py-2">{{ invoiceData.officer_name }}</td>
            </tr>
          </tbody>
        </table>

        <table
          class="table-auto w-full text-left border-collapse mt-8"
          style="border: 1px solid black"
        >
          <thead style="border: 1px solid black">
            <tr>
              <th class="border px-4 py-2">Nama Alat</th>
              <th class="border px-4 py-2">Jumlah</th>
              <th class="border px-4 py-2">Tanggal Peminjaman</th>
              <th class="border px-4 py-2">Tanggal Pengembalian</th>
            </tr>
          </thead>
          <tbody style="border: 1px solid black">
            <tr>
              <td class="border px-4 py-2">{{ invoiceData.item_name }}</td>
              <td class="border px-4 py-2">{{ invoiceData.amount }}</td>
              <td class="border px-4 py-2">{{ invoiceData.borrow_date }}</td>
              <td class="border px-4 py-2">{{ invoiceData.return_date }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- <div class="text-left text-md m-10">
        <p>Thank you for using our borrowing service. Below are the details of the items you have borrowed. Please ensure to return the items by the specified return date to avoid any late fees. If you have any questions or need further assistance, feel free to contact our support team.</p>
        <p>We hope you have a great experience with our service!</p>
      </div> -->

      <div class="text-end text-md mt-20 mr-6 mb-4">
        <p>Kepala Divisi Teknisi</p>
        <p>Surabaya, Indonesia</p>
        <div class="flex justify-end mt-4">
          <img src="../assets/signature.png" alt="signature" class="w-32" />
        </div>
        <p>(Aiman Ahmad Oetarto)</p>
        <p>Invoice dibuat pada tanggal {{ new Date().toLocaleDateString() }}</p>
      </div>
    </div>
  </div>
  <div class="text-center text-lg mb-4 mt-4 text-gray-300">
    Pilih baris untuk dicetak
  </div>
</template>
