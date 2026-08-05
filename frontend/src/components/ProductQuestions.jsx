import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

import "../styles/productQuestions.css";

export default function ProductQuestions({
  productId,
}) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState("");

  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(
      localStorage.getItem("user")
    );
  } catch {
    user = null;
  }

  useEffect(() => {
    if (productId) {
      fetchQuestions();
    }
  }, [productId]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(
        `/questions/products/${productId}/questions`
      );

      setQuestions(
        Array.isArray(data?.data)
          ? data.data
          : []
      );
    } catch (error) {
      console.error(error);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const submitQuestion = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error(
        "Please login first."
      );
      return;
    }

    if (!question.trim()) {
      toast.error(
        "Please enter your question."
      );
      return;
    }

    try {
      await api.post(
        `/questions/products/${productId}/questions`,
        {
          question,
        }
      );

      toast.success(
        "Question submitted successfully."
      );

      setQuestion("");

      fetchQuestions();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to submit question."
      );
    }
  };

  const deleteQuestion = async (id) => {
    if (
      !window.confirm(
        "Delete this question?"
      )
    )
      return;

    try {
      await api.delete(
        `/questions/${id}`
      );

      toast.success(
        "Question deleted."
      );

      fetchQuestions();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to delete question."
      );
    }
  };

  if (loading) {
    return (
      <div className="questions-loading">
        Loading Questions...
      </div>
    );
  }

  return (
    <div
      style={{
        marginTop: "60px",
      }}
    >
      <div
        style={{
          marginBottom: "35px",
        }}
      >
        <h2
          style={{
            color: "#fff",
            marginBottom: "10px",
          }}
        >
          Questions & Answers
        </h2>

        <p
          style={{
            color: "#94a3b8",
          }}
        >
          Ask product related questions and
          receive answers directly from the
          seller.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "22px",
        }}
      >
        {questions.length === 0 ? (

          <div
            className="admin-card"
            style={{
              padding: "40px",
              textAlign: "center",
              color: "#94a3b8"
            }}
          >
            No questions have been asked yet.
            <br />
            Be the first one to ask about this
            product.
          </div>

        ) : (

          questions.map((item) => (

            <div
              key={item._id}
              className="admin-card"
              style={{
                padding: "24px",
                borderRadius: "18px"
              }}
            >

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "18px"
                }}
              >

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px"
                  }}
                >

                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      background: "#2563eb",
                      color: "#fff",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontWeight: 700,
                      fontSize: "18px"
                    }}
                  >
                    {(item.customer?.name || "C")
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>

                    <div
                      style={{
                        color: "#fff",
                        fontWeight: 600
                      }}
                    >
                      {item.customer?.name ||
                        "Customer"}
                    </div>

                    <small
                      style={{
                        color: "#94a3b8"
                      }}
                    >
                      {item.createdAt
                        ? new Date(
                            item.createdAt
                          ).toLocaleDateString()
                        : ""}
                    </small>

                  </div>

                </div>

                {token &&
                  (user?.role === "admin" ||
                    user?._id ===
                      item.customer?._id) && (

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteQuestion(item._id)
                      }
                    >
                      Delete
                    </button>

                  )}

              </div>

              <div
                style={{
                  background: "#111827",
                  border:
                    "1px solid rgba(255,255,255,.08)",
                  borderRadius: "14px",
                  padding: "18px",
                  color: "#fff",
                  lineHeight: "1.7"
                }}
              >

                <div
                  style={{
                    color: "#60a5fa",
                    fontWeight: 700,
                    marginBottom: "12px"
                  }}
                >
                  Customer Question
                </div>

                {item.question}

              </div>
              {item.answer?.text ? (

                <div
                  style={{
                    marginTop: "18px",
                    background: "#0f172a",
                    border: "1px solid rgba(34,197,94,.25)",
                    borderRadius: "14px",
                    padding: "18px"
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "12px"
                    }}
                  >

                    <div
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "50%",
                        background: "#22c55e",
                        color: "#fff",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontWeight: 700
                      }}
                    >
                      ✓
                    </div>

                    <div>

                      <div
                        style={{
                          color: "#22c55e",
                          fontWeight: 700
                        }}
                      >
                        Seller Response
                      </div>

                      <small
                        style={{
                          color: "#94a3b8"
                        }}
                      >
                        {item.answer?.answeredBy?.name ||
                          "Verified Seller"}
                      </small>

                    </div>

                  </div>

                  <div
                    style={{
                      color: "#e2e8f0",
                      lineHeight: "1.8",
                      whiteSpace: "pre-wrap"
                    }}
                  >
                    {item.answer.text}
                  </div>

                </div>

              ) : (

                <div
                  style={{
                    marginTop: "18px",
                    padding: "18px",
                    borderRadius: "14px",
                    border: "1px dashed rgba(255,255,255,.12)",
                    color: "#94a3b8",
                    textAlign: "center"
                  }}
                >
                  Waiting for seller response...
                </div>

              )}

            </div>

          ))

        )}

      </div>

      <div
        className="admin-card"
        style={{
          marginTop: "40px",
          padding: "28px",
          borderRadius: "18px"
        }}
      >

        <h3
          style={{
            color: "#fff",
            marginBottom: "12px"
          }}
        >
          Ask a Question
        </h3>

        {!token && (

          <div
            style={{
              marginBottom: "18px",
              color: "#f59e0b"
            }}
          >
            Please login to ask a question.
          </div>

        )}

        <form onSubmit={submitQuestion}>
          <textarea
            value={question}
            onChange={(e) =>
              setQuestion(e.target.value)
            }
            placeholder="Ask anything about this product..."
            disabled={!token}
            required
            style={{
              width: "100%",
              minHeight: "140px",
              resize: "vertical",
              padding: "18px",
              borderRadius: "14px",
              border: "1px solid rgba(255,255,255,.08)",
              background: "#111827",
              color: "#fff",
              outline: "none",
              fontSize: "15px",
              lineHeight: "1.6",
              marginBottom: "20px"
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end"
            }}
          >
            <button
              type="submit"
              disabled={!token}
              className="primary-btn"
              style={{
                minWidth: "220px",
                height: "48px",
                opacity: !token ? 0.6 : 1,
                cursor: !token
                  ? "not-allowed"
                  : "pointer"
              }}
            >
              Submit Question
            </button>
          </div>

        </form>

      </div>

    </div>

  );

}
