"use client";

import { Car } from "@/app/types/cars.types";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ChevronLeft, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Page = () => {
  const { id } = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  const [isCardAddedToWishlist, setIsCarAddedToWishlist] =
    useState<boolean>(false);

  const [wishlistData, setWishlistData] = useState<Car[]>([]);

  const fetchCar = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://www.freetestapi.com/api/v1/cars/${id}`
      );
      setCar(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCar();

    const stored = localStorage.getItem("wishlist");
    try {
      const parsed = stored ? JSON.parse(stored) : [];
      setWishlistData(Array.isArray(parsed) ? parsed : []);
    } catch (e) {
      console.error("Invalid wishlist data in localStorage", e);
      setWishlistData([]);
    }
  }, [id]);

  useEffect(() => {
    const isCarisAlreadyExits = wishlistData.some(
      (car) => car.id === Number(id)
    );
    setIsCarAddedToWishlist(isCarisAlreadyExits);
  }, [wishlistData, id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500"></div>
      </div>
    );

  if (!car)
    return (
      <div className="text-center text-gray-400 mt-8 bg-gray-950 min-h-screen flex items-center justify-center">
        <div className="bg-gray-950 p-8 rounded-lg shadow-xl border border-gray-800">
          <p className="text-xl">Car not found.</p>
          <Link href="/">
            <button className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    );

  const addToWishlist = () => {
    if (!isCardAddedToWishlist) {
      const updated = [...wishlistData, car];
      setWishlistData(updated);
      localStorage.setItem("wishlist", JSON.stringify(updated));
      toast.success("Car is added to Wishlist");
    } else {
      toast.error("Car is already there in Wishlist");
    }
  };

  const removeFromWishList = () => {
    if (isCardAddedToWishlist) {
      const updated = wishlistData.filter((car) => car.id !== Number(id));
      setWishlistData(updated);
      localStorage.setItem("wishlist", JSON.stringify(updated));
      toast.success("Car is removed from Wishlist");
    } else {
      toast.error("Car is not there in Wishlist");
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Navigation Header */}
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

      {/* Main Content Container */}
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            {car.make} {car.model}
          </h1>
          <p className="text-gray-400 mt-2">Year: {car.year}</p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto bg-gray-950 rounded-lg shadow-xl overflow-hidden border border-gray-800">
          {/* Image Section */}
          <div className="h-96 overflow-hidden relative">
            <Image
              src={car.image}
              height={500}
              width={500}
              alt={`${car.make} ${car.model}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-indigo-600 text-white px-3 py-1 rounded-lg shadow-md font-semibold">
              ${car.price.toLocaleString()}
            </div>
          </div>

          {/* Details Section */}
          <div className="p-6">
            {/* Key Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-indigo-400 mb-3">
                  Specifications
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex justify-between">
                    <span className="text-gray-400">Engine:</span>
                    <span>{car.engine}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Fuel Type:</span>
                    <span>{car.fuelType}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Horsepower:</span>
                    <span>{car.horsepower} HP</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Mileage:</span>
                    <span>{car.mileage.toLocaleString()} km</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Transmission:</span>
                    <span>{car.transmission}</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-indigo-400 mb-3">
                  Additional Details
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center">
                    <span className="text-gray-400 w-24">Color:</span>
                    <div className="flex items-center">
                      <div
                        className="w-4 h-4 rounded-full mr-2"
                        style={{ backgroundColor: car.color.toLowerCase() }}
                      ></div>
                      <span>{car.color}</span>
                    </div>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Owners:</span>
                    <span>{car.owners}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Price:</span>
                    <span className="font-medium">
                      ${car.price.toLocaleString()}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Features Section */}
            <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-semibold text-indigo-400 mb-3">
                Features
              </h3>
              <div className="flex flex-wrap gap-2">
                {car.features.map((feature, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full bg-gray-700 text-gray-300 text-sm"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-semibold text-indigo-400 mb-3">
                Description
              </h3>
              <p className="text-gray-300 leading-relaxed">
                This {car.make} {car.model} is a {car.year} model with{" "}
                {car.horsepower} horsepower and a {car.fuelType} engine. It has
                been driven for {car.mileage.toLocaleString()} kilometers and
                comes with{" "}
                {car.features.length > 0
                  ? car.features.join(", ")
                  : "no additional features"}
                . Perfect for those looking for a reliable and stylish vehicle.
              </p>
            </div>

            {/* Add to Wishlist Button */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={
                  isCardAddedToWishlist ? removeFromWishList : addToWishlist
                }
                className={`px-6 py-3 rounded-md text-white font-semibold transition duration-300 flex items-center gap-2 ${
                  isCardAddedToWishlist
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                <Heart
                  className={isCardAddedToWishlist ? "fill-current" : ""}
                  size={20}
                />
                {isCardAddedToWishlist
                  ? "Remove from Wishlist"
                  : "Add to Wishlist"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
