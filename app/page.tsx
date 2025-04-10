"use client";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import type { Car } from "./types/cars.types";
import { Heart, Search, CarIcon, X } from "lucide-react";
import CarCard from "@/components/CarCard";
import { Toaster } from "react-hot-toast";

export default function Home() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [priceRange, setPriceRange] = useState<string>("");
  const [sort, setSort] = useState<string>("");
  const [fuel, setFuel] = useState<string>("");

  // Set dark theme

  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://www.freetestapi.com/api/v1/cars"
      );
      setCars(response.data);
      const totalPage = Math.ceil(response.data.length / 9);
      setTotalPage(totalPage);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const filteredCars = useMemo(() => {
    const result = cars.filter((car) => {
      const matchesSearch =
        car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.model.toLowerCase().includes(searchQuery.toLowerCase());
      let matchesPrice = true;
      if (priceRange) {
        if (priceRange === "50001+") {
          matchesPrice = car.price >= 50001;
        } else {
          const [min, max] = priceRange.split("-").map(Number);
          matchesPrice = car.price >= min && car.price <= max;
        }
      }
      let matchesFuel = true;
      if (fuel && fuel !== "all") matchesFuel = car.fuelType === fuel;
      return matchesSearch && matchesPrice && matchesFuel;
    });
    if (sort === "low-high") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "high-low") {
      result.sort((a, b) => b.price - a.price);
    }
    return result;
  }, [cars, searchQuery, priceRange, fuel, sort]);

  const resetFilters = () => {
    setSearchQuery("");
    setPriceRange("");
    setFuel("");
    setSort("");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 ">
        <div className="w-14 h-14 p-2 border-2 border-blue-400 rounded-full m-6 text-blue-400 flex items-center justify-center">
          <CarIcon className="w-8 h-8" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 transition-colors duration-300">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#374151",
            color: "#f3f4f6",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          },
        }}
      />
      {/* Header with fixed navigation */}
      <header className="sticky top-0 z-10 bg-gray-800 shadow-md transition-colors duration-300">
        <div className="container mx-auto px-4 py-4 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-500 p-2 rounded-lg">
              <CarIcon className="h-6 w-6 text-white" />
            </div>
            <Link href={"/"}>
              <h1 className="text-2xl font-bold text-blue-400">CarFindr</h1>
            </Link>{" "}
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/wishlist">
              <button className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg">
                <Heart className="h-4 w-4" />
                <span>Wishlist</span>
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <div className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white py-16 transition-colors duration-300">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-md">
            Find Your Dream Car
          </h2>
          {/* Main search bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by make or model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-4 pr-12 rounded-lg bg-gray-800 dark:border-gray-700 dark:text-white text-gray-800 shadow-lg"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-12 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 hover:text-gray-300"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Filters Section */}
      <div
        className={`container mx-auto px-4 py-6 bg-gray-800 rounded-xl shadow-lg -mt-6 mb-8 transition-all duration-300 transform opacity-100 translate-y-0`}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          {/* Price Range Dropdown */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Price Range
            </label>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 bg-gray-700 text-white appearance-none bg-no-repeat bg-right pr-10"
            >
              <option value="">All Prices</option>
              <option value="0-10000">$0 - $10,000</option>
              <option value="10001-15000">$10,001 - $15,000</option>
              <option value="15001-20000">$15,001 - $20,000</option>
              <option value="20001-25000">$20,001 - $25,000</option>
              <option value="25001-30000">$25,001 - $30,000</option>
              <option value="30001-40000">$30,001 - $40,000</option>
              <option value="40001-50000">$40,001 - $50,000</option>
              <option value="50001+">$50,001+</option>
            </select>
          </div>
          {/* Fuel Type Dropdown */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Fuel Type
            </label>
            <select
              value={fuel}
              onChange={(e) => setFuel(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-white appearance-none bg-no-repeat bg-right pr-10"
            >
              <option value="all">All Fuel Types</option>
              <option value="Gasoline">Gasoline</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
            </select>
          </div>
          {/* Sort Dropdown */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Sort By
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-white appearance-none bg-no-repeat bg-right pr-10"
            >
              <option value="">Default</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>
          {/* Reset button */}
          <button
            onClick={resetFilters}
            className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 shadow-sm hover:shadow h-[42px] flex items-center justify-center gap-2"
          >
            <X className="h-4 w-4" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>
      {/* Results summary */}
      <div className="container mx-auto px-4 mb-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">
            {filteredCars.length} {filteredCars.length === 1 ? "car" : "cars"}{" "}
            found
          </h3>
        </div>
      </div>
      {/* Car Listings */}
      <div className="container mx-auto px-4 pb-16">
        {filteredCars.length > 0 ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCars.slice((page - 1) * 9, page * 9).map((car) => (
                <Link
                  key={car.id}
                  href={`/car/${car.id}`}
                  className="block h-full"
                >
                  <CarCard car={car} />
                </Link>
              ))}
            </div>
            {/* Pagination */}
            {totalPage > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                {Array.from({ length: totalPage }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 ${
                      i + 1 === page
                        ? "bg-blue-500 text-white shadow-md"
                        : "bg-gray-700 text-white hover:bg-gray-600 hover:shadow"
                    } `}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center bg-gray-800 rounded-xl shadow-lg p-10 max-w-md mx-auto transform transition-all duration-300">
            <div className="text-gray-500 mb-6">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">No cars found</h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your search criteria or filters to find more cars.
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
