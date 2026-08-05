import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";

export default function CMSPage() {
  const { slug } = useParams();

  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPage();
  }, [slug]);

  const fetchPage = async () => {
    try {
      const { data } = await api.get(
        `/cms/page/${slug}`
      );

      setPage(data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Page not found"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="container py-5">
        <h2>Page Not Found</h2>
      </div>
    );
  }

  return (
    <div
      className="container py-5"
      style={{ maxWidth: "900px" }}
    >
      <h1 className="mb-4">{page.title}</h1>

      <div
        style={{
          lineHeight: "1.8",
          fontSize: "17px",
          whiteSpace: "pre-wrap",
        }}
      >
        {page.content}
      </div>
    </div>
  );
}