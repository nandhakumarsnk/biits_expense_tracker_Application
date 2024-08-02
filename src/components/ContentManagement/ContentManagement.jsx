"use client";
import React, { Suspense, useState } from "react";
import Item_Category from "./Item_Category";
import Sub_Category from "./Sub_Category";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import "./contentmanagement.css";

const ContentManagement = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const initialTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(initialTab || "itemCategory");

  const handleTabChange = (tab) => {
    const updatedPath = `${pathname}?tab=${tab}`;
    router.replace(updatedPath, { shallow: true });
    setActiveTab(tab);
  };
  return (
    <>
      <div className="row">
        <div className="contentManage-container">
          <>
            <p className="d-inline-flex gap-1 buttons-row mt-3 mb-4">
              <button
                className={`btn content-grey-btn ${
                  activeTab === "itemCategory" ? "activeContentTab" : ""
                }`}
                onClick={() => handleTabChange("itemCategory")}
              >
                Item Category
              </button>
              <button
                className={`btn content-grey-btn ${
                  activeTab === "itemSubCategory" ? "activeContentTab" : ""
                }`}
                onClick={() => handleTabChange("itemSubCategory")}
              >
                Item SubCategory
              </button>
            </p>
           
              {activeTab === "itemCategory" && <Item_Category />}
              {activeTab === "itemSubCategory" && <Sub_Category />}
            
          </>
        </div>
      </div>
    </>
  );
};

export default ContentManagement;
