import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";
import "../styles/admin.css";

export default function Questions() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data } = await api.get("/questions/admin/all");
      setQuestions(data.data || []);
    } catch (err) {
      toast.error("Failed to load questions");
    }
  };

  const deleteQuestion = async (id) => {
    if (!window.confirm("Delete this question?")) return;

    try {
      await api.delete(`/questions/${id}`);
      toast.success("Question deleted");
      fetchQuestions();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Unable to delete question"
      );
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-content">
        <AdminTopbar />

          <div className="dashboard-header">

              <div>

                  <h1>Product Questions</h1>

                  <p>
                      Review customer questions and manage vendor responses.
                  </p>

              </div>

          </div>

        <div className="table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Customer</th>
                <th>Vendor</th>
                <th>Question</th>
                <th>Answer</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {questions.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No questions found.
                  </td>
                </tr>
              ) : (
                questions.map((q) => (
                  <tr key={q._id}>
                    <td>{q.product?.name || "-"}</td>

                    <td>{q.customer?.name || "-"}</td>

                    <td>
                      {q.vendor?.shopName ||
                        q.vendor?.name ||
                        "-"}
                    </td>

                    <td>{q.question}</td>

                    <td>{q.answer?.text || "Not Answered"}</td>

                    <td>{q.status}</td>

                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => deleteQuestion(q._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}