import React from 'react';

export default function Navbar() {
  return (
    <nav className="w-full border-b bg-background px-4 py-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="text-xl font-bold">Magic Bricks</div>
        <div className="flex gap-4">
          <span className="cursor-pointer hover:underline">Home</span>
          <span className="cursor-pointer hover:underline">Search</span>
          <span className="cursor-pointer hover:underline">Wishlist</span>
          <span className="cursor-pointer hover:underline">Compare</span>
        </div>
      </div>
    </nav>
  );
}
