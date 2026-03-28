export default function ProfileBanner({ bannerImage }) {
  return (
    <div className="h-48 md:h-64 w-full bg-gradient-to-r from-blue-900/20 via-indigo-900/20 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      {bannerImage && (
        <img src={bannerImage} className="w-full h-full object-cover" alt="Banner" />
      )}
    </div>
  );
}
