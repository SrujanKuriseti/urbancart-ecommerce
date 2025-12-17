import React, { useState, useEffect } from "react";
import { catalogAPI, orderAPI, customerAPI } from "../services/api";
import { formatPrice, formatDate } from "../utils/helpers";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({
    item_id: "",
    name: "",
    price: "",
    description: "",
    image_url: "",
    category: "",
    brand: "",
    quantity: "",
  });
  const [editingCustomer, setEditingCustomer] = useState(null); // {id, first_name,...}
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      pending: "#f59e0b",
      processing: "#3b82f6",
      shipped: "#8b5cf6",
      delivered: "#10b981",
      cancelled: "#ef4444",
    };
    return colors[status?.toLowerCase()] || "#6b7280";
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [ordersRes, productsRes, customersRes] = await Promise.all([
        orderAPI.getAllOrders(),
        catalogAPI.getAllItems(),
        customerAPI.getAllCustomers(),
      ]);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
      setCustomers(customersRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateInventory = async (itemId) => {
    const newQuantity = prompt("Enter new quantity:");
    if (newQuantity !== null) {
      try {
        await catalogAPI.updateInventory(itemId, parseInt(newQuantity, 10));
        alert("Inventory updated!");
        fetchAllData();
      } catch (error) {
        alert("Failed to update inventory");
      }
    }
  };

  const handleExportOrdersPdf = () => {
    console.log("Export Orders PDF clicked");
    if (!orders || orders.length === 0) {
      alert("No orders to export.");
      return;
    }
    const doc = new jsPDF();
    doc.text("UrbanCart - Sales Report", 14, 16);
    autoTable(doc, {
      startY: 22,
      head: [["Order #", "Customer", "Email", "Total", "Status", "Date"]],
      body: orders.map((o) => [
        o.order_number,
        `${o.first_name} ${o.last_name}`,
        o.email,
        Number(o.total_amount || 0).toFixed(2),
        o.status,
        new Date(o.order_date).toLocaleDateString(),
      ]),
    });
    doc.save("sales-report.pdf");
  };

  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newProduct,
        price: parseFloat(newProduct.price || 0),
        quantity: parseInt(newProduct.quantity || 0, 10),
      };
      await catalogAPI.createItem(payload);
      alert("Product created!");
      setNewProduct({
        item_id: "",
        name: "",
        price: "",
        description: "",
        image_url: "",
        category: "",
        brand: "",
        quantity: 0,
      });
      await fetchAllData();
    } catch (error) {
      alert(error.response?.data?.error || "Failed to create product");
    }
  };

  const openCustomerModal = (customer) => {
    setEditingCustomer({
      id: customer.id,
      first_name: customer.first_name || "",
      last_name: customer.last_name || "",
      email: customer.email || "",
      is_active:
        typeof customer.is_active === "boolean" ? customer.is_active : true,
    });
    setIsCustomerModalOpen(true);
  };

  const closeCustomerModal = () => {
    setIsCustomerModalOpen(false);
    setEditingCustomer(null);
  };

  const handleCustomerFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingCustomer((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveCustomer = async (e) => {
    e.preventDefault();
    if (!editingCustomer) return;
    try {
      const payload = {
        first_name: editingCustomer.first_name,
        last_name: editingCustomer.last_name,
        email: editingCustomer.email,
        is_active: editingCustomer.is_active,
      };
      await customerAPI.updateCustomer(editingCustomer.id, payload);
      alert("Customer updated successfully");
      closeCustomerModal();
      await fetchAllData();
    } catch (error) {
      alert(error.response?.data?.error || "Failed to update customer details");
    }
  };

  const handleDeactivateCustomer = async (customerId) => {
    if (
      !window.confirm(
        "Are you sure you want to deactivate this customer account?"
      )
    ) {
      return;
    }
    try {
      await customerAPI.deactivateCustomer(customerId);
      alert("Customer deactivated");
      await fetchAllData();
    } catch (error) {
      alert(error.response?.data?.error || "Failed to deactivate customer");
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <p style={styles.subtitle}>Manage your store efficiently</p>
      </div>

      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div style={styles.statsGrid}>
            <div
              style={{
                ...styles.statCard,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              <div style={styles.statIcon}>📦</div>
              <div style={styles.statContent}>
                <h3 style={styles.statNumber}>{products.length}</h3>
                <p style={styles.statLabel}>Total Products</p>
              </div>
            </div>

            <div
              style={{
                ...styles.statCard,
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              }}
            >
              <div style={styles.statIcon}>🛍️</div>
              <div style={styles.statContent}>
                <h3 style={styles.statNumber}>{orders.length}</h3>
                <p style={styles.statLabel}>Total Orders</p>
              </div>
            </div>

            <div
              style={{
                ...styles.statCard,
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              }}
            >
              <div style={styles.statIcon}>👥</div>
              <div style={styles.statContent}>
                <h3 style={styles.statNumber}>{customers.length}</h3>
                <p style={styles.statLabel}>Total Customers</p>
              </div>
            </div>

            <div
              style={{
                ...styles.statCard,
                background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
              }}
            >
              <div style={styles.statIcon}>💰</div>
              <div style={styles.statContent}>
                <h3 style={styles.statNumber}>
                  $
                  {orders
                    .reduce(
                      (sum, order) => sum + parseFloat(order.total_amount || 0),
                      0
                    )
                    .toFixed(2)}
                </h3>
                <p style={styles.statLabel}>Total Revenue</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={styles.tabs}>
            <button
              onClick={() => setActiveTab("products")}
              style={{
                ...styles.tab,
                ...(activeTab === "products" ? styles.activeTab : {}),
              }}
            >
              📦 Products
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              style={{
                ...styles.tab,
                ...(activeTab === "orders" ? styles.activeTab : {}),
              }}
            >
              🛍️ Orders
            </button>
            <button
              onClick={() => setActiveTab("customers")}
              style={{
                ...styles.tab,
                ...(activeTab === "customers" ? styles.activeTab : {}),
              }}
            >
              👥 Customers
            </button>
          </div>

          {isCustomerModalOpen && editingCustomer && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(15,23,42,0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
              }}
            >
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "1.75rem",
                  width: "420px",
                  boxShadow: "0 20px 45px rgba(15,23,42,0.3)",
                }}
              >
                <h3
                  style={{
                    margin: "0 0 1rem 0",
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "#0f172a",
                  }}
                >
                  Edit Customer
                </h3>
                <form
                  onSubmit={handleSaveCustomer}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "0.75rem",
                    }}
                  >
                    <input
                      style={styles.input}
                      name="first_name"
                      value={editingCustomer.first_name}
                      onChange={handleCustomerFieldChange}
                      placeholder="First name"
                      required
                    />
                    <input
                      style={styles.input}
                      name="last_name"
                      value={editingCustomer.last_name}
                      onChange={handleCustomerFieldChange}
                      placeholder="Last name"
                      required
                    />
                  </div>
                  <input
                    style={styles.input}
                    name="email"
                    type="email"
                    value={editingCustomer.email}
                    onChange={handleCustomerFieldChange}
                    placeholder="Email"
                    required
                  />
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "0.9rem",
                      color: "#0f172a",
                      marginTop: "0.25rem",
                    }}
                  >
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={editingCustomer.is_active}
                      onChange={handleCustomerFieldChange}
                    />
                    Active customer
                  </label>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "0.5rem",
                      marginTop: "1rem",
                    }}
                  >
                    <button
                      type="button"
                      onClick={closeCustomerModal}
                      style={{
                        ...styles.actionBtn,
                        background: "#e5e7eb",
                        color: "#111827",
                      }}
                    >
                      Cancel
                    </button>
                    <button type="submit" style={styles.actionBtn}>
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Tab Content */}
          <div style={styles.tabContent}>
            {activeTab === "products" && (
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  All Products ({products.length})
                </h2>

                {/* Add Product Form */}
                <div style={styles.addFormCard}>
                  <h3 style={styles.addFormTitle}>Add New Product</h3>
                  <form onSubmit={handleCreateProduct} style={styles.addForm}>
                    <div style={styles.addFormRow}>
                      <input
                        style={styles.input}
                        name="item_id"
                        placeholder="Item ID (e.g., TECH011)"
                        value={newProduct.item_id}
                        onChange={handleNewProductChange}
                        required
                      />
                      <input
                        style={styles.input}
                        name="name"
                        placeholder="Product name"
                        value={newProduct.name}
                        onChange={handleNewProductChange}
                        required
                      />
                    </div>

                    <div style={styles.addFormRow}>
                      <input
                        style={styles.input}
                        type="number"
                        step="0.01"
                        name="price"
                        placeholder="Price"
                        value={newProduct.price}
                        onChange={handleNewProductChange}
                        required
                      />
                      <input
                        style={styles.input}
                        type="number"
                        min="0"
                        name="quantity"
                        placeholder="Initial stock"
                        value={newProduct.quantity}
                        onChange={handleNewProductChange}
                      />
                    </div>

                    <div style={styles.addFormRow}>
                      <input
                        style={styles.input}
                        name="category"
                        placeholder="Category (e.g., Phones)"
                        value={newProduct.category}
                        onChange={handleNewProductChange}
                      />
                      <input
                        style={styles.input}
                        name="brand"
                        placeholder="Brand (e.g., Apple)"
                        value={newProduct.brand}
                        onChange={handleNewProductChange}
                      />
                    </div>

                    <input
                      style={styles.input}
                      name="image_url"
                      placeholder="Image URL"
                      value={newProduct.image_url}
                      onChange={handleNewProductChange}
                      required
                    />

                    <textarea
                      style={{
                        ...styles.input,
                        height: "80px",
                        resize: "vertical",
                      }}
                      name="description"
                      placeholder="Product description"
                      value={newProduct.description}
                      onChange={handleNewProductChange}
                    />

                    <button type="submit" style={styles.actionBtn}>
                      Add Product
                    </button>
                  </form>
                </div>

                {products.length === 0 ? (
                  <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>📦</div>
                    <h3 style={styles.emptyTitle}>No Products Yet</h3>
                    <p style={styles.emptyText}>
                      Start adding products to your inventory
                    </p>
                  </div>
                ) : (
                  <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                      <thead>
                        <tr style={styles.tableHeader}>
                          <th style={styles.th}>ID</th>
                          <th style={styles.th}>Name</th>
                          <th style={styles.th}>Category</th>
                          <th style={styles.th}>Brand</th>
                          <th style={styles.th}>Price</th>
                          <th style={styles.th}>Stock</th>
                          <th style={styles.th}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product, index) => (
                          <tr
                            key={product.id}
                            style={{
                              ...styles.tableRow,
                              background: index % 2 === 0 ? "#fff" : "#f8fafc",
                            }}
                          >
                            <td style={styles.td}>{product.item_id}</td>
                            <td style={styles.td}>
                              <strong>{product.name}</strong>
                            </td>
                            <td style={styles.td}>{product.category}</td>
                            <td style={styles.td}>{product.brand}</td>
                            <td style={styles.td}>
                              <strong>{formatPrice(product.price)}</strong>
                            </td>
                            <td style={styles.td}>
                              <span
                                style={{
                                  ...styles.stockBadge,
                                  background:
                                    product.quantity > 50
                                      ? "#dcfce7"
                                      : product.quantity > 20
                                      ? "#fef9c3"
                                      : "#fee2e2",
                                  color:
                                    product.quantity > 50
                                      ? "#16a34a"
                                      : product.quantity > 20
                                      ? "#ca8a04"
                                      : "#dc2626",
                                }}
                              >
                                {product.quantity}
                              </span>
                            </td>
                            <td style={styles.td}>
                              <button
                                onClick={() =>
                                  handleUpdateInventory(product.item_id)
                                }
                                style={styles.actionBtn}
                              >
                                Update Stock
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === "orders" && (
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  All Orders ({orders.length})
                </h2>

                <button
                  style={{ ...styles.actionBtn, marginBottom: "1rem" }}
                  onClick={handleExportOrdersPdf}
                >
                  Export Orders PDF
                </button>

                {orders.length === 0 ? (
                  <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>🛍️</div>
                    <h3 style={styles.emptyTitle}>No Orders Yet</h3>
                    <p style={styles.emptyText}>
                      Orders will appear here when customers make purchases
                    </p>
                  </div>
                ) : (
                  <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                      <thead>
                        <tr style={styles.tableHeader}>
                          <th style={styles.th}>Order #</th>
                          <th style={styles.th}>Customer</th>
                          <th style={styles.th}>Email</th>
                          <th style={styles.th}>Total</th>
                          <th style={styles.th}>Status</th>
                          <th style={styles.th}>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order, index) => (
                          <tr
                            key={order.id}
                            style={{
                              ...styles.tableRow,
                              background: index % 2 === 0 ? "#fff" : "#f8fafc",
                            }}
                          >
                            <td style={styles.td}>
                              <code style={styles.orderId}>
                                {order.order_number?.substring(0, 20)}...
                              </code>
                            </td>
                            <td style={styles.td}>
                              <strong>
                                {order.first_name} {order.last_name}
                              </strong>
                            </td>
                            <td style={styles.td}>{order.email}</td>
                            <td style={styles.td}>
                              <strong>{formatPrice(order.total_amount)}</strong>
                            </td>
                            <td style={styles.td}>
                              <span
                                style={{
                                  ...styles.statusBadge,
                                  background:
                                    getStatusColor(order.status) + "22",
                                  color: getStatusColor(order.status),
                                  border: `1.5px solid ${getStatusColor(
                                    order.status
                                  )}44`,
                                }}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td style={styles.td}>
                              {formatDate(order.order_date)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === "customers" && (
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  All Customers ({customers.length})
                </h2>

                {customers.length === 0 ? (
                  <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>👥</div>
                    <h3 style={styles.emptyTitle}>No Customers Yet</h3>
                    <p style={styles.emptyText}>
                      Customer accounts will appear here
                    </p>
                  </div>
                ) : (
                  <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                      <thead>
                        <tr style={styles.tableHeader}>
                          <th style={styles.th}>ID</th>
                          <th style={styles.th}>Name</th>
                          <th style={styles.th}>Email</th>
                          <th style={styles.th}>Joined</th>
                          <th style={styles.th}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customers.map((customer, index) => (
                          <tr
                            key={customer.id}
                            style={{
                              ...styles.tableRow,
                              background: index % 2 === 0 ? "#fff" : "#f8fafc",
                            }}
                          >
                            <td style={styles.td}>{customer.id}</td>
                            <td style={styles.td}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                }}
                              >
                                <div style={styles.avatar}>
                                  {customer.first_name?.[0]}
                                  {customer.last_name?.[0]}
                                </div>
                                <div>
                                  <strong>
                                    {customer.first_name} {customer.last_name}
                                  </strong>
                                  {customer.is_active === false && (
                                    <div
                                      style={{
                                        fontSize: "0.75rem",
                                        color: "#ef4444",
                                        marginTop: 2,
                                      }}
                                    >
                                      Inactive
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td style={styles.td}>{customer.email}</td>
                            <td style={styles.td}>
                              {formatDate(customer.user_created)}
                            </td>
                            <td style={styles.td}>
                              <button
                                style={{
                                  ...styles.actionBtn,
                                  marginRight: "0.5rem",
                                }}
                                onClick={() => openCustomerModal(customer)}
                              >
                                View / Edit
                              </button>
                              <button
                                style={{
                                  ...styles.actionBtn,
                                  background:
                                    "linear-gradient(135deg, #f97373 0%, #ef4444 100%)",
                                }}
                                onClick={() =>
                                  handleDeactivateCustomer(customer.id)
                                }
                              >
                                Deactivate
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "2rem",
    background: "#f8fafc",
    minHeight: "100vh",
  },
  header: {
    marginBottom: "2rem",
    textAlign: "center",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "700",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "0.5rem",
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "#64748b",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "4px solid #e2e8f0",
    borderTop: "4px solid  #667eea",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    marginTop: "1rem",
    fontSize: "1.1rem",
    color: "#64748b",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
    marginBottom: "2.5rem",
  },
  statCard: {
    padding: "1.5rem",
    borderRadius: "16px",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s",
    cursor: "default",
  },
  statIcon: {
    fontSize: "3rem",
  },
  statContent: {
    flex: 1,
  },
  statNumber: {
    fontSize: "2rem",
    fontWeight: "700",
    margin: "0 0 0.25rem 0",
  },
  statLabel: {
    fontSize: "0.95rem",
    opacity: 0.9,
    margin: 0,
  },
  tabs: {
    display: "flex",
    gap: "1rem",
    marginBottom: "2rem",
    background: "#fff",
    padding: "1rem",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  },
  tab: {
    flex: 1,
    padding: "12px 24px",
    border: "none",
    background: "transparent",
    color: "#64748b",
    fontSize: "1rem",
    fontWeight: "600",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  activeTab: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
  },
  tabContent: {
    background: "#fff",
    borderRadius: "16px",
    padding: "2rem",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)",
  },
  section: {
    width: "100%",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "1.5rem",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
  },
  tableHeader: {
    background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
  },
  th: {
    padding: "16px",
    textAlign: "left",
    fontWeight: "700",
    color: "#334155",
    fontSize: "0.95rem",
    borderBottom: "2px solid #e2e8f0",
  },
  tableRow: {
    transition: "background 0.2s",
    cursor: "default",
  },
  td: {
    padding: "16px",
    fontSize: "0.95rem",
    color: "#475569",
    borderBottom: "1px solid #f1f5f9",
  },
  stockBadge: {
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "0.9rem",
    fontWeight: "600",
    display: "inline-block",
  },
  statusBadge: {
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "0.85rem",
    fontWeight: "600",
    textTransform: "capitalize",
    display: "inline-block",
  },
  orderId: {
    background: "#f1f5f9",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "0.85rem",
    fontFamily: "monospace",
  },
  actionBtn: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    fontSize: "0.9rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "transform 0.2s",
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "0.9rem",
  },
  emptyState: {
    textAlign: "center",
    padding: "4rem 2rem",
  },
  emptyIcon: {
    fontSize: "4rem",
    marginBottom: "1rem",
  },
  emptyTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "0.5rem",
  },
  emptyText: {
    fontSize: "1rem",
    color: "#64748b",
  },
  addFormCard: {
    marginBottom: "1.5rem",
    padding: "1.5rem",
    borderRadius: "12px",
    background: "#f8fafc",
    boxShadow: "0 1px 4px rgba(15, 23, 42, 0.06)",
  },
  addFormTitle: {
    margin: "0 0 1rem 0",
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#0f172a",
  },
  addForm: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  addFormRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0.75rem",
  },
  input: {
    width: "100%",
    padding: "0.6rem 0.75rem",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "0.95rem",
    boxSizing: "border-box",
  },
};

// Add spinner animation
const styleSheet = document.styleSheets[0];
const keyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
try {
  styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
} catch (e) {
  // Ignore if already exists
}

export default AdminDashboard;
