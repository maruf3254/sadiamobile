
  import React from "react";
  import { Outlet } from "react-router-dom";
  import Layout from "../../Layout/Layout";

  export default function ShopLayout() {
    return (
      <Layout>
        <Outlet />
      </Layout>
    );
  }
