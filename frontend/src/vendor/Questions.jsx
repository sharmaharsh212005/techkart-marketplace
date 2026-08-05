import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

import VendorSidebar from "./VendorSidebar";
import VendorTopbar from "./VendorTopbar";

import "../styles/admin.css";

export default function VendorQuestions() {

  const [questions, setQuestions] = useState([]);

  const [answer, setAnswer] = useState("");

  const [selectedQuestion, setSelectedQuestion] =
    useState(null);

  const [viewQuestion, setViewQuestion] =
    useState(null);

  useEffect(() => {

    fetchQuestions();

  }, []);

  const fetchQuestions = async () => {

    try {

      const { data } =
        await api.get("/questions/vendor");

      setQuestions(data.data || []);

    } catch (error) {

      toast.error(
        "Unable to load questions"
      );

    }

  };

  const submitAnswer = async () => {

    if (!answer.trim()) {

      return toast.error(
        "Please enter an answer"
      );

    }

    try {

      await api.put(

        `/questions/${selectedQuestion._id}/answer`,

        {
          answer,
        }

      );

      toast.success(
        "Answer submitted"
      );

      setAnswer("");

      setSelectedQuestion(null);

      fetchQuestions();

    } catch (error) {

      toast.error(

        error.response?.data?.message ||

        "Unable to submit answer"

      );

    }

  };
  return (
    <>
      <div className="admin-layout">

        <VendorSidebar />

        <div className="admin-content">

          <VendorTopbar />

          <div className="page-header">

            <h2>Product Questions</h2>

          </div>

          <div className="table-container">

            <table className="orders-table">

              <thead>

                <tr>

                  <th style={{ width: "20%" }}>
                    Product
                  </th>

                  <th style={{ width: "15%" }}>
                    Customer
                  </th>

                  <th style={{ width: "35%" }}>
                    Question
                  </th>

                  <th style={{ width: "30%" }}>
                    Answer
                  </th>

                </tr>

              </thead>

              <tbody>

                {
                  questions.length === 0 ? (

                    <tr>

                      <td
                        colSpan="4"
                        style={{
                          textAlign: "center",
                          padding: "40px",
                        }}
                      >

                        No product questions found.

                      </td>

                    </tr>

                  ) : (

                    questions.map((item) => (

                      <tr key={item._id}>

                        <td>

                          <strong>

                            {item.product?.name}

                          </strong>

                        </td>

                        <td>

                          <strong>

                            {item.customer?.name}

                          </strong>

                        </td>

                        <td
                          style={{
                            lineHeight: "1.7",
                          }}
                        >

                          {item.question}

                        </td>

                        <td
                          style={{
                            minWidth: "330px",
                          }}
                        >

                          {
                            item.answer?.text ? (

                              <div>

                                <div
                                  style={{
                                    background: "#111827",
                                    border:
                                      "1px solid rgba(255,255,255,.08)",
                                    borderRadius: "12px",
                                    padding: "16px",
                                    color: "#fff",
                                    lineHeight: "1.7",
                                    marginBottom: "12px",
                                  }}
                                >

                                  {item.answer.text}

                                </div>

                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "10px",
                                  }}
                                >

                                  <button
                                    className="secondary-btn"
                                    onClick={() =>
                                      setViewQuestion(item)
                                    }
                                  >

                                    View Details

                                  </button>

                                </div>

                              </div>

                            ) : selectedQuestion?._id === item._id ? (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "14px",
                          }}
                        >

                          <textarea
                            className="form-control"
                            rows={4}
                            placeholder="Write your answer..."
                            value={answer}
                            onChange={(e) =>
                              setAnswer(e.target.value)
                            }
                            style={{
                              resize: "vertical",
                              minHeight: "120px",
                            }}
                          />

                          <div
                            style={{
                              display: "flex",
                              gap: "12px",
                            }}
                          >

                            <button
                              className="primary-btn"
                              onClick={submitAnswer}
                            >

                              Submit Answer

                            </button>

                            <button
                              className="delete-btn"
                              onClick={() => {

                                setSelectedQuestion(null);

                                setAnswer("");

                              }}
                            >

                              Cancel

                            </button>

                          </div>

                        </div>

                      ) : (

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                          }}
                        >

                          <button
                            className="primary-btn"
                            onClick={() => {

                              setSelectedQuestion(item);

                              setAnswer("");

                            }}
                          >

                            Answer

                          </button>

                          <button
                            className="secondary-btn"
                            onClick={() =>
                              setViewQuestion(item)
                            }
                          >

                            View Details

                          </button>

                        </div>

                      )}

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>
      </div>
    
    </div>

      {
        viewQuestion && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,.65)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
              padding: "20px",
            }}
          >
            <div
              style={{
                width: "780px",
                maxWidth: "100%",
                background: "#111827",
                borderRadius: "18px",
                border: "1px solid rgba(255,255,255,.08)",
                padding: "30px",
                color: "#fff",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "25px",
                }}
              >
                <h2>Question Details</h2>

                <button
                  className="delete-btn"
                  onClick={() =>
                    setViewQuestion(null)
                  }
                >
                  ✕
                </button>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(2,minmax(0,1fr))",
                  gap: "20px",
                  marginBottom: "25px",
                }}
              >
                <div>
                  <strong>Customer</strong>

                  <p
                    style={{
                      marginTop: "8px",
                    }}
                  >
                    {viewQuestion.customer?.name}
                  </p>
                </div>

                <div>
                  <strong>Product</strong>

                  <p
                    style={{
                      marginTop: "8px",
                    }}
                  >
                    {viewQuestion.product?.name}
                  </p>
                </div>

                <div>
                  <strong>Asked On</strong>

                  <p
                    style={{
                      marginTop: "8px",
                    }}
                  >
                    {new Date(
                      viewQuestion.createdAt
                    ).toLocaleString()}
                  </p>
                </div>

                <div>
                  <strong>Status</strong>

                  <div
                    style={{
                      marginTop: "10px",
                    }}
                  >
                    {viewQuestion.answer?.text ? (
                      <span
                        style={{
                          padding:
                            "8px 16px",
                          borderRadius:
                            "30px",
                          background:
                            viewQuestion
                              .answer
                              ?.answeredRole ===
                            "admin"
                              ? "#2563eb"
                              : "#22c55e",
                          color: "#fff",
                          fontWeight: 600,
                        }}
                      >
                        {viewQuestion.answer
                          ?.answeredRole ===
                        "admin"
                          ? "Answered by Admin"
                          : "Answered by Vendor"}
                      </span>
                    ) : (
                      <span
                        style={{
                          padding:
                            "8px 16px",
                          borderRadius:
                            "30px",
                          background:
                            "#f59e0b",
                          color: "#fff",
                          fontWeight: 600,
                        }}
                      >
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: "#0f172a",
                  borderRadius: "14px",
                  padding: "18px",
                  marginBottom: "20px",
                }}
              >
                <h4
                  style={{
                    marginBottom: "12px",
                  }}
                >
                  Customer Question
                </h4>

                <p
                  style={{
                    lineHeight: "1.8",
                  }}
                >
                  {viewQuestion.question}
                </p>
              </div>

              {viewQuestion.answer?.text && (
                <div
                  style={{
                    background: "#0f172a",
                    borderRadius: "14px",
                    padding: "18px",
                  }}
                >
                  <h4
                    style={{
                      marginBottom: "12px",
                    }}
                  >
                    Seller Answer
                  </h4>

                  <p
                    style={{
                      lineHeight: "1.8",
                    }}
                  >
                    {viewQuestion.answer.text}
                  </p>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "30px",
                }}
              >
                <button
                  className="primary-btn"
                  onClick={() =>
                    setViewQuestion(null)
                  }
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )
      }
    </>

  );

}