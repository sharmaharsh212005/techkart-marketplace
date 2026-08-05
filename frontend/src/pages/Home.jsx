import Hero from "../components/Hero";
import Brands from "../components/Brands";
import Categories from "../components/Categories";

import FeaturedProducts from "../components/home/FeaturedProducts";
import TrendingProducts from "../components/home/TrendingProducts";
import OfferBanner from "../components/home/OfferBanner";
import TopVendors from "../components/home/TopVendors";
import WhyChooseUs from "../components/home/WhyChooseUs";
import Testimonials from "../components/home/Testimonials";
import Newsletter from "../components/home/Newsletter";
import FAQ from "../components/home/FAQ";

export default function Home() {
  return (
    <main>

      <Hero />

      <section style={{ marginTop: "40px" }}>
        <Brands />
      </section>

      <section style={{ marginTop: "30px" }}>
        <Categories />
      </section>

      <FeaturedProducts />

      <TrendingProducts />

      <OfferBanner />

      <TopVendors />

      <WhyChooseUs />

      <Testimonials />

      <Newsletter />

      <FAQ />

      <section
        className="container"
        style={{
          textAlign: "center",
          padding: "80px 20px",
        }}
      >
        <h2
          style={{
            color: "#ffffff",
            marginBottom: "20px",
            fontSize: "2.3rem",
            fontWeight: "700",
          }}
        >
          Welcome to TechKart
        </h2>

        <p
          style={{
            maxWidth: "850px",
            margin: "0 auto",
            color: "#a9b7cf",
            fontSize: "18px",
            lineHeight: "1.9",
          }}
        >
          TechKart is your one-stop destination for premium electronics,
          laptops, smartphones, gaming accessories, smart wearables,
          home appliances, and audio devices. Shop from trusted vendors,
          discover top brands, enjoy secure payments, fast delivery,
          and experience a seamless multi-vendor marketplace built for
          modern online shopping.
        </p>
      </section>

    </main>
  );
}