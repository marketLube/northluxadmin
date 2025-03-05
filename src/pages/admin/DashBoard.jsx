import React, { useEffect, useState } from "react";
import PageHeader from "../../components/Admin/PageHeader";
import Cards from "../../components/Admin/dashboard/Cards";
import Logo from "../../components/Logo";
import TopProductCards from "../../components/Admin/dashboard/TopProductCards";
import { adminDashdoard } from "../../sevices/adminApis";
import LoadingSpinner from "../../components/spinner/LoadingSpinner";

function DashBoard() {
  const [cardsData, setCardsData] = useState([]);
  const [topProudcts, setTopProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const res = await adminDashdoard();
      setCardsData(res.data.summary);
      setTopProducts(res.data.topProducts);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <LoadingSpinner
        fullScreen
        color="primary"
        text="Loading dashboard data..."
      />
    );
  }

  const AnalysisData = [
    { data: "New Orders", color: "#00BA9D", count: "11" },
    { data: "Total Deliveries", color: "#FF5470", count: "5289" },
    { data: "Total Revenue", color: "#035ECF", count: "₹1,52,310" },
  ];
  return (
    <div className="space-y-5 px-1 md:px-5">
      <PageHeader content="Dash Board" />

      {/* quick analysis */}
      <div className="flex flex-col lg:flex-row items-center justify-evenly  py-3 bg-white">
        <div>
          <img src="/images/logo.png" alt="logo image" className="w-[20rem]" />
        </div>
        <div>
          <p className="text-lg font-bold">September 2024</p>
          <div className="flex-col flex lg:flex-row items-center  justify-center gap-9 w-full mt-3">
            {cardsData &&
              cardsData.map((card, index) => (
                <Cards
                  key={index}
                  data={card.data}
                  color={card.color}
                  count={card.count}
                />
              ))}
          </div>
        </div>
      </div>

      {/* top products */}
      <div>
        <p>Your top 4 products</p>
        <div className="flex flex-col lg:flex-row gap-2">
          {topProudcts &&
            topProudcts.map((product, index) => (
              <div key={index} className="w-1/4">
                <TopProductCards item={product} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
