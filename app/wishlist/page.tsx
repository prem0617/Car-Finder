"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Car } from "../types/cars.types";
import { Heart, ChevronLeft, Search } from "lucide-react";
import CarCard from "@/components/CarCard";

const WishlistPage = () => {
  const [wishlistData, setWishlistData] = useState<Car[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [priceRange, setPriceRange] = useState<string>("");
  const [fuel, setFuel] = useState<string>("");
  const [sort, setSort] = useState<string>("");

  useEffect(() => {
    const stored = localStorage.getItem("wishlist");
    try {
      const parsed = stored ? JSON.parse(stored) : [];
      setWishlistData(Array.isArray(parsed) ? parsed : []);
    } catch (e) {
      console.error("Invalid wishlist data in localStorage", e);
      setWishlistData([]);
    }
  }, []);

  const removeFromWishList = (id: number) => {
    const updated = wishlistData.filter((car) => car.id !== id);
    setWishlistData(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  // Filter cars based on search query, price range, and fuel type
  const filteredCars = React.useMemo(() => {
    const result = wishlistData.filter((car) => {
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
      if (fuel) matchesFuel = car.fuelType === fuel;

      return matchesSearch && matchesPrice && matchesFuel;
    });

    if (sort === "low-high") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "high-low") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [wishlistData, searchQuery, priceRange, fuel, sort]);

  const resetFilters = () => {
    setSearchQuery("");
    setPriceRange("");
    setFuel("");
    setSort("");
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300  bg-gray-900 text-white`}
    >
      {/* Header with fixed navigation */}
      <header className="sticky top-0 z-10 bg-gray-800 shadow-md transition-colors duration-300">
        <div className="container mx-auto h-20 px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center mr-6 text-blue-400 hover:text-blue-300 transition-colors">
                <ChevronLeft className="h-5 w-5" />
                <span className="ml-1 font-medium">Back</span>
              </div>
            </Link>
            <Link href={"/"}>
              <h1 className="text-2xl font-bold text-blue-400">CarFindr</h1>
            </Link>{" "}
          </div>
        </div>
      </header>

      {/* Hero section */}
      <div className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white py-16 transition-colors duration-300">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-md">
            Your Wishlist
          </h2>

          {/* Main search bar */}
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search your wishlist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3 pr-12 rounded-lg bg-gray-800 border-gray-700 text-white "
            />
            <Search className="absolute right-4 top-3 h-5 w-5 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Filters Section */}

      <div className="container mx-auto px-4 py-6 bg-gray-800 rounded-lg shadow-md -mt-6 mb-8 transition-all duration-300">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          {/* Price Range Dropdown */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Price Range
            </label>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white"
            >
              <option value="">All Prices</option>
              <option value="0-10000">0 to 10,000</option>
              <option value="10001-15000">10,001 to 15,000</option>
              <option value="15001-20000">15,001 to 20,000</option>
              <option value="20001-25000">20,001 to 25,000</option>
              <option value="25001-30000">25,001 to 30,000</option>
              <option value="30001-40000">30,001 to 40,000</option>
              <option value="40001-50000">40,001 to 50,000</option>
              <option value="50001+">50,001 and above</option>
            </select>
          </div>

          {/* Fuel Type Dropdown */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Fuel Type
            </label>
            <select
              value={fuel}
              onChange={(e) => setFuel(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white"
            >
              <option value="">All Fuel Types</option>
              <option value="Gasoline">Gasoline</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Sort By
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white"
            >
              <option value="">Default</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>

          {/* Reset button */}
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Results summary */}
      <div className="container mx-auto px-4 mb-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-white">
            {filteredCars.length} {filteredCars.length === 1 ? "car" : "cars"}{" "}
            in your wishlist
          </h3>
        </div>
      </div>

      {/* Wishlist Content */}
      <div className="container mx-auto px-4 pb-16">
        {filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map((car) => (
              <Link key={car.id} href={`/car/${car.id}`}>
                <CarCard car={car} onRemove={removeFromWishList} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center bg-gray-800 rounded-lg shadow-md p-10 max-w-md mx-auto">
            <div className="text-gray-500 mb-4">
              <Heart className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-white">
              Your wishlist is empty
            </h3>
            <p className="text-gray-400 mb-6">
              Start exploring our listings and add cars to your wishlist.
            </p>
            <Link href="/">
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-lg">
                Browse Cars
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
