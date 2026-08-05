import { useState } from "react";
import api from "../api/axios";

const EnquiryModal = ({
  productId,
  open,
  onClose
}) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

if (!open) return null;

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!subject.trim() || !message.trim()) {
      return alert("Please fill all fields");
    }

    try {
      setLoading(true);

      const { data } = await api.post(
        "/enquiries",
        {
          productId,
          subject,
          message
        }
      );

      alert(data.message);

      setSubject("");
      setMessage("");

      onClose();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "650px",
          maxWidth: "95%",
          background: "#1f2937",
          borderRadius: "16px",
          border: "1px solid #334155",
          overflow: "hidden",
          boxShadow: "0 25px 60px rgba(0,0,0,.45)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #334155",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3
            style={{
              color: "#fff",
              margin: 0,
              fontSize: "24px",
              fontWeight: 700,
            }}
          >
            Send Enquiry
          </h3>

          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#94a3b8",
              fontSize: "30px",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={submitHandler}>
          <div style={{ padding: 24 }}>
            <label
              style={{
                display: "block",
                color: "#fff",
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              Subject
            </label>

            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter enquiry subject"
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "10px",
                border: "1px solid #334155",
                background: "#111827",
                color: "#fff",
                marginBottom: 20,
              }}
            />

            <label
              style={{
                display: "block",
                color: "#fff",
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              Message
            </label>

            <textarea
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your enquiry..."
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "10px",
                border: "1px solid #334155",
                background: "#111827",
                color: "#fff",
                resize: "none",
              }}
            />
          </div>

          <div
            style={{
              padding: 20,
              borderTop: "1px solid #334155",
              display: "flex",
              justifyContent: "flex-end",
              gap: 15,
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "12px 22px",
                borderRadius: "10px",
                background: "#374151",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "12px 26px",
                borderRadius: "10px",
                background: "#3b82f6",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {loading ? "Sending..." : "Send Enquiry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnquiryModal;