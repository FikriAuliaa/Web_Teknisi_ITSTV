import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "@/views/LoginPage.vue";
import AdminPage from "@/views/AdminPage.vue";
import EditItem from "@/components/AdminPage/EditItem.vue";
import AdminOperatorPage from "@/views/OperatorPage.vue";
import SummaryPage from "@/views/SummaryPage.vue";
import OperatorEdit from "@/components/Operator/OperatorEdit.vue";
import BorrowForm from "@/components/Operator/BorrowForm.vue";
import DisplayBorrowed from "@/components/Operator/DisplayBorrowed.vue";
import DisplayEquipment from "@/components/Operator/DisplayEquipment.vue";
import Rules from "@/views/Rules.vue";
import HomePageOperator from "@/views/HomePageOperator.vue";
import OperatorPage from "@/views/OperatorPage.vue";
import TechnicianPage from "@/views/TechnicianPage.vue"; // Tambahkan import untuk komponen TechnicianPage
import HomePageAdmin from "@/views/HomePageAdmin.vue"; // Import HomePageAdmin

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: LoginPage,
      meta: { requiresAuth: false },
    },
    {
      path: "/admin",
      name: "admin",
      component: AdminPage,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/admin/edit-item/:id",
      name: "edit-item",
      component: EditItem,
      props: true,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/admin/all-operator",
      name: "all-operator",
      component: AdminOperatorPage,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/admin/editoperator/:id",
      name: "edit-admin",
      component: OperatorEdit,
      props: true,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/Operator/OperatorEdit",
      name: "edit-operator",
      component: OperatorEdit,
      props: true,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/HomePageOperator",
      name: "HomePageOperator",
      component: HomePageOperator,
      meta: { requiresAuth: true, requiresOperator: true },
    },
    {
      path: "/operator/book-equipment",
      name: "book-equipment",
      component: BorrowForm,
      meta: { requiresAuth: true, requiresOperator: true },
    },
    {
      path: "/admin/summary",
      name: "summary",
      component: SummaryPage,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/operator/borrowed-items",
      name: "borrowed-items",
      component: DisplayBorrowed,
      meta: { requiresAuth: true, requiresOperator: true },
    },
    {
      path: "/operator/all-equipment",
      name: "all-equipment",
      component: DisplayEquipment,
      meta: { requiresAuth: true, requiresOperator: true },
    },
    {
      path: "/rules",
      name: "rules",
      component: Rules,
      meta: { requiresAuth: false },
    },
    {
      path: "/teknisi",
      name: "teknisi",
      component: TechnicianPage,
      meta: { requiresAuth: false },
    },
    {
      path: "/admin/home", // Rute untuk HomePageAdmin
      name: "HomePageAdmin",
      component: HomePageAdmin,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!to.name) {
    next("/");
    return;
  }

  if (to.meta.requiresAuth && !token) {
    next("/");
    return;
  }

  if (to.meta.requiresAdmin && role !== "admin") {
    next("/");
    return;
  }

  if (to.meta.requiresOperator && role !== "operator") {
    next("/");
    return;
  }

  if (to.path === "/" && token) {
    if (role === "admin") {
      next("/admin/home"); // Arahkan admin ke HomePageAdmin
    } else if (role === "operator") {
      next("/HomePageOperator");
    }
    return;
  }

  next();
});

export default router;
