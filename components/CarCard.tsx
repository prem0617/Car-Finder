"use client";

import { type FormEvent, useEffect, useState } from "react";
import type { Car } from "@/app/types/cars.types";
import toast from "react-hot-toast";
import { Heart, Star, Fuel, Settings } from "lucide-react";
import Image from "next/image";

const CarCard = ({
  car,
  onRemove,
}: {
  car: Car;
  onRemove?: (id: number) => void;
}) => {
  const [wishlistData, setWishlistData] = useState<Car[]>([]);
  const [isCardAddedToWishlist, setIsCarAddedToWishlist] =
    useState<boolean>(false);
  const [isHovered, setIsHovered] = useState(false);

  // Load wishlist from localStorage
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

  // Check if car is already in wishlist
  useEffect(() => {
    const alreadyInWishlist = wishlistData.some((item) => item.id === car.id);
    setIsCarAddedToWishlist(alreadyInWishlist);
  }, [wishlistData, car.id]);

  const toggleWishlist = (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const stored = localStorage.getItem("wishlist");
    let updated: Car[] = [];
    try {
      const parsed = stored ? JSON.parse(stored) : [];

      if (!isCardAddedToWishlist) {
        updated = [...parsed, car];
        localStorage.setItem("wishlist", JSON.stringify(updated));
        toast.success("Car added to wishlist");
      } else {
        updated = parsed.filter((item: Car) => item.id !== car.id);
        localStorage.setItem("wishlist", JSON.stringify(updated));
        toast.success("Car removed from wishlist");

        if (onRemove) {
          onRemove(car.id);
        }
      }

      setWishlistData(updated);
      setIsCarAddedToWishlist(!isCardAddedToWishlist);
    } catch (error) {
      console.error("Error handling wishlist", error);
      toast.error("Something went wrong!");
    }
  };

  // Function to determine fuel icon color
  const getFuelColor = (fuelType: string) => {
    switch (fuelType) {
      case "Electric":
        return "text-green-500";
      case "Diesel":
        return "text-amber-600";
      default:
        return "text-blue-500";
    }
  };

  // Generate random rating (for demo purposes)
  const rating = (4 + Math.random()).toFixed(1);

  return (
    <div
      className="bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full relative group border border-transparent hover:border-gray-700"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-52 bg-gray-700 overflow-hidden">
        <Image
          height={500}
          width={500}
          src={car.image || `/placeholder.svg?height=320&width=400`}
          alt={`${car.make} ${car.model}`}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />

        <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-lg shadow-md font-semibold">
          ${car.price.toLocaleString()}
        </div>

        <button
          onClick={toggleWishlist}
          className={`absolute top-3 right-3 p-2.5 rounded-full ${
            isCardAddedToWishlist
              ? "bg-red-500 text-white"
              : "bg-gray-800 text-gray-300"
          } shadow-md hover:scale-110 transition-all duration-200`}
          aria-label={
            isCardAddedToWishlist ? "Remove from wishlist" : "Add to wishlist"
          }
        >
          <Heart
            className={`h-5 w-5 ${isCardAddedToWishlist ? "fill-current" : ""}`}
          />
        </button>

        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm font-medium">
          {car.year}
        </div>
      </div>

      {/* Car Info */}
      <div className="p-5">
        <div className="mb-3">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors duration-200">
              {car.make} {car.model}
            </h3>
            <div className="flex items-center text-amber-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="ml-1 text-sm font-medium">{rating}</span>
            </div>
          </div>

          {/* Car features */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="flex items-center">
              <Fuel
                className={`h-4 w-4 ${getFuelColor(car.fuelType)} mr-1.5`}
              />
              <p className="text-sm text-gray-400">{car.fuelType}</p>
            </div>
            <div className="flex items-center">
              <Settings className="h-4 w-4 text-gray-400 mr-1.5" />
              <p className="text-sm text-gray-400">{car.transmission}</p>
            </div>

            <div className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: car.color.toLowerCase() }}
              ></div>
              <p className="text-sm text-gray-400">{car.color}</p>
            </div>
          </div>
        </div>

        {/* View details button - visible on hover */}
        <div
          className={`mt-4 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium text-sm">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
