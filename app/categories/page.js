import { publicApi } from '@/lib/api';
import Header from '@/components/Header';
import CategoryCard from '@/components/CategoryCard';

export const metadata = {
  title: 'Explore Categories',
  description:
    'Browse startup news, business insights, funding updates and market trends across categories on ConnektX.',
};

export const revalidate = 60;

async function getCategories() {
  try {
    const response = await publicApi.getCategories();
    return response.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900">
            Explore Categories
          </h1>

          <p className="mt-4 text-lg text-gray-500 leading-relaxed">
            Discover curated startup news, funding announcements,
            business insights and market updates — organized by topic.
          </p>
        </div>

        {/* Empty State */}
        {categories.length === 0 ? (
          <div className="text-center py-20 border border-gray-200 rounded-2xl">
            <p className="text-gray-500">
              No categories available right now.
            </p>
          </div>
        ) : (
          <>
            {/* Category Count */}
            <div className="text-center mb-12">
              <p className="text-sm text-gray-400 uppercase tracking-wide">
                {categories.length}{' '}
                {categories.length === 1 ? 'Category' : 'Categories'}
              </p>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}