import siteBackground from "@/assets/brand/site-background.jpg";

export function SiteBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10"
      style={{
        backgroundImage: `url(${siteBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}