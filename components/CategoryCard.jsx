'use client';

import React from 'react';
import Link from 'next/link';
import ImagePreview from './ImagePreview';

export default function CategoryCard({ category }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      prefetch={false}
      className="group block w-full overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:border-gray-400 hover:shadow-sm"
    >
      {/* Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <ImagePreview
          imgUrl={category.imgUrl}
          name={category.name}
          size="full"
          shape="rounded-none"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>

      {/* Name Below Image */}
      <div className="p-6 text-center">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 tracking-tight group-hover:underline">
          {category.name}
        </h2>
      </div>
    </Link>
  );
}