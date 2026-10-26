import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  LifeBuoy,
  Plus,
  ChevronLeft,
  Send,
  X,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  RefreshCw,
  Check,
  MessageSquare,
  Clock,
  HelpCircle,
  Inbox,
} from "lucide-react";
import ApiService from "../../api/apiService";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import StatusBadge from "../../components/ui/StatusBadge";
import Modal from "../../components/ui/Modal";
import { SkeletonCard } from "../../components/ui/Skeleton";
import { formatDate, unwrap, unwrapList } from "./apiHelpers";

const CATEGORIES = [
  { value: "delivery", label: "Delivery", color: "var(--egas-primary)" },
  { value: "payment", label: "Payment", color: "var(--egas-accent)" },
  { value: "product", label: "Product", color: "var(--egas-success)" },
  { value: "account", label: "Account", color: "var(--egas-info)" },
  { value: "other", label: "Other", color: "var(--egas-text-secondary)" },
];

const MAX_IMAGES = 5;

/* ============================================================
   MAIN PAGE
   ============================================================ */
export default function SupportPage() {
  const [listState, setListState] = useState({
    status: "loading",
    tickets: [],
  });
  const [createOpen, setCreateOpen] = useState(false);
  const [openTicketId, setOpenTicketId] = useState(null);

  const loadList = useCallback(async () => {
    setListState({ status: "loading", tickets: [] });
    try {
      const res = await ApiService.support?.getAll?.();
      const list = unwrapList(res);
      setListState({ status: "success", tickets: list });
    } catch (err) {
      setListState({ status: "error", tickets: [], error: err });
    }
  }, []);

  useEffect(() => {
    loadList();
  }, [loadList]);

  return (
    <>
      <PageHeader
        title="Help & Support"
        subtitle="Raise a ticket and track responses from our team."
        actions={
          <div style={{ display: "flex", gap: "var(--sp-2)" }}>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<RefreshCw size={14} />}
              onClick={loadList}
              disabled={listState.status === "loading"}
            >
              Refresh
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus size={14} />}
              onClick={() => setCreateOpen(true)}
            >
              New ticket
            </Button>
          </div>
        }
      />

      {listState.status === "loading" && (
        <div className="egas-list-stack">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {listState.status === "error" && (
        <ErrorState
          title="We couldn't load your tickets"
          description="Please check your connection and try again."
          onRetry={loadList}
        />
      )}

      {listState.status === "success" && listState.tickets.length === 0 && (
        <EmptyState
          icon={<Inbox size={26} />}
          title="No tickets yet"
          description="If you need help with an order, delivery, payment, or account, open a ticket and our team will respond."
          actionLabel="Create a ticket"
          onAction={() => setCreateOpen(true)}
        />
      )}

      {listState.status === "success" && listState.tickets.length > 0 && (
        <div className="egas-list-stack">
          {listState.tickets.map((t) => (
            <TicketListItem
              key={t._id}
              t={t}
              onOpen={() => setOpenTicketId(t._id)}
            />
          ))}
        </div>
      )}

      <CreateTicketModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(ticket) => {
          setCreateOpen(false);
          if (ticket?._id) setOpenTicketId(ticket._id);
          else loadList();
        }}
      />

      <TicketThreadModal
        ticketId={openTicketId}
        onClose={() => {
          setOpenTicketId(null);
          loadList();
        }}
      />
    </>
  );
}

/* ============================================================
   LIST ITEM
   ============================================================ */
function TicketListItem({ t, onOpen }) {
  const cat = CATEGORIES.find((c) => c.value === t.category) || CATEGORIES[4];
  const replies = (t.responses || []).length;

  return (
    <button
      type="button"
      onClick={onOpen}
      className="egas-ticket"
      style={{
        textAlign: "left",
        cursor: "pointer",
        display: "grid",
        gap: "var(--sp-3)",
        background: "var(--egas-surface)",
      }}
    >
      <div className="egas-ticket__top">
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <h3 className="egas-ticket__subject">{t.subject}</h3>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                color: cat.color,
                background: `${cat.color}18`,
                padding: "2px 8px",
                borderRadius: 4,
                letterSpacing: "0.05em",
              }}
            >
              {cat.label}
            </span>
          </div>
          <p className="egas-ticket__meta">
            #{t.ticketId || String(t._id).slice(-8).toUpperCase()}
            {" · "}
            {formatDate(t.createdAt, { withTime: true })}
            {replies > 0 && (
              <>
                {" "}
                ·{" "}
                <span style={{ color: "var(--egas-primary)", fontWeight: 600 }}>
                  {replies} response{replies > 1 ? "s" : ""}
                </span>
              </>
            )}
          </p>
        </div>
        <StatusBadge status={t.status} />
      </div>

      {t.description && (
        <p
          className="egas-text egas-text--sm"
          style={{
            margin: 0,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {t.description}
        </p>
      )}
    </button>
  );
}

/* ============================================================
   CREATE TICKET MODAL
   ============================================================ */

function CreateTicketModal({ open, onClose, onCreated }) {
  return (
    <Modal
      open={open}
      onClose={() => !open.lock && onClose()}
      title="Create a support ticket"
      size="lg"
      footer={null}
    >
      {open && <CreateTicketForm onClose={onClose} onCreated={onCreated} />}
    </Modal>
  );
}

function CreateTicketForm({ onClose, onCreated }) {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("delivery");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  const addFiles = (e) => {
    const picked = Array.from(e.target.files || []);
    const next = [...files, ...picked].slice(0, MAX_IMAGES);
    const tooBig = next.find((f) => f.size > 5 * 1024 * 1024);
    if (tooBig) {
      setError(`${tooBig.name} is larger than 5MB.`);
      return;
    }
    setError("");
    setFiles(next);
    if (fileRef.current) fileRef.current.value = "";
  };
  const removeFile = (i) => setFiles((fs) => fs.filter((_, idx) => idx !== i));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!subject.trim() || !description.trim()) {
      setError("Subject and description are required.");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("subject", subject.trim());
      fd.append("category", category);
      fd.append("description", description.trim());
      files.forEach((f) => fd.append("images", f));

      const res = await ApiService.support?.create?.(fd);
      const ticket = unwrap(res);
      onCreated?.(ticket);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Could not create the ticket.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      style={{ display: "grid", gap: "var(--sp-4)" }}
      noValidate
    >
      <Input
        key="ticket-subject"
        label="Subject"
        required
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Short title of your issue"
      />

      <div className="egas-field" key="ticket-category">
        <label
          htmlFor="egas-ticket-cat"
          className="egas-label egas-label--required"
        >
          Category
        </label>
        <select
          id="egas-ticket-cat"
          className="egas-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="egas-field" key="ticket-description">
        <label
          htmlFor="egas-ticket-desc"
          className="egas-label egas-label--required"
        >
          Description
        </label>
        <textarea
          id="egas-ticket-desc"
          className="egas-textarea"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Explain what happened, including order numbers or any relevant details."
        />
      </div>

      <div className="egas-field" key="ticket-files">
        <label className="egas-label">
          Attach images (optional, up to {MAX_IMAGES})
        </label>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          onChange={addFiles}
          style={{ display: "none" }}
          id="egas-ticket-files"
        />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <label
            htmlFor="egas-ticket-files"
            className="egas-btn egas-btn--secondary egas-btn--sm"
          >
            <ImageIcon size={14} /> Choose images
          </label>
        </div>
        {files.length > 0 && (
          <div className="egas-file-chips" style={{ marginTop: 8 }}>
            {files.map((f, i) => (
              <span key={i} className="egas-file-chip">
                {f.name}
                <button
                  type="button"
                  aria-label={`Remove ${f.name}`}
                  onClick={() => removeFile(i)}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="egas-auth-error" role="alert">
          <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
          <span>{error}</span>
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: "var(--sp-2)",
          justifyContent: "flex-end",
          marginTop: "var(--sp-2)",
        }}
      >
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          Submit
        </Button>
      </div>
    </form>
  );
}

/* ============================================================
   TICKET THREAD MODAL
   ============================================================ */
function TicketThreadModal({ ticketId, onClose }) {
  const [state, setState] = useState({
    status: "idle",
    ticket: null,
    error: "",
  });
  const [reply, setReply] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [replyError, setReplyError] = useState("");
  const [sending, setSending] = useState(false);
  const [closing, setClosing] = useState(false);
  const fileRef = useRef(null);
  const scrollRef = useRef(null);

  const load = useCallback(async () => {
    if (!ticketId) {
      setState({ status: "idle", ticket: null, error: "" });
      return;
    }
    setState((s) => ({ ...s, status: "loading" }));
    try {
      const res = await ApiService.support?.getById?.(ticketId);
      setState({ status: "success", ticket: unwrap(res), error: "" });
      // Scroll to bottom after load
      setTimeout(() => {
        if (scrollRef.current)
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }, 50);
    } catch (err) {
      setState({
        status: "error",
        ticket: null,
        error:
          err?.response?.data?.message ||
          err?.message ||
          "Could not load ticket.",
      });
    }
  }, [ticketId]);

  useEffect(() => {
    load();
  }, [load]);

  const submitReply = async (e) => {
    e.preventDefault();
    setReplyError("");
    if (!reply.trim() && attachments.length === 0) {
      setReplyError("Please write a message or attach an image.");
      return;
    }
    setSending(true);
    try {
      const fd = new FormData();
      fd.append("message", reply.trim());
      attachments.forEach((f) => fd.append("attachments", f));

      await ApiService.support?.addResponse?.(ticketId, fd);
      setReply("");
      setAttachments([]);
      if (fileRef.current) fileRef.current.value = "";
      await load();
    } catch (err) {
      setReplyError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Could not send reply.",
      );
    } finally {
      setSending(false);
    }
  };

  const closeTicket = async () => {
    if (!ticketId) {
      setReplyError("Cannot close ticket: ticket ID is missing.");
      return;
    }

    if (!window.confirm("Close this ticket?")) return;

    setClosing(true);
    setReplyError("");

    try {
      const response = await ApiService.support.close(ticketId);

      if (response.data?.success) {
        await load();
      } else {
        setReplyError(
          response.data?.message || "The ticket could not be closed.",
        );
      }
    } catch (err) {
      setReplyError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Could not close the ticket.",
      );
    } finally {
      setClosing(false);
    }
  };

  const t = state.ticket;
  const responses = t?.responses || [];
  const canReply = t && t.status !== "closed" && t.status !== "resolved";

  const cat = t
    ? CATEGORIES.find((c) => c.value === t.category) || CATEGORIES[4]
    : CATEGORIES[4];

  return (
    <Modal
      open={!!ticketId}
      onClose={onClose}
      title={t?.subject || "Support Ticket"}
      size="lg"
      footer={
        <div
          style={{
            display: "flex",
            gap: "var(--sp-2)",
            width: "100%",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Button variant="ghost" onClick={onClose}>
            <ChevronLeft size={14} /> Back
          </Button>
          {canReply && (
            <Button
              variant="secondary"
              leftIcon={<Check size={14} />}
              onClick={closeTicket}
              loading={closing}
            >
              Close ticket
            </Button>
          )}
        </div>
      }
    >
      {state.status === "loading" && <SkeletonCard />}

      {state.status === "error" && (
        <div className="egas-auth-error" role="alert">
          {state.error}
        </div>
      )}

      {state.status === "success" && t && (
        <div style={{ display: "grid", gap: "var(--sp-4)" }}>
          {/* Meta banner */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "var(--sp-3)",
              padding: "var(--sp-4)",
              background: "var(--egas-bg)",
              borderRadius: "var(--radius-md)",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: cat.color,
                    background: `${cat.color}18`,
                    padding: "2px 8px",
                    borderRadius: 4,
                    letterSpacing: "0.05em",
                  }}
                >
                  {cat.label}
                </span>
                <span
                  style={{
                    fontSize: "var(--fs-xs)",
                    color: "var(--egas-text-secondary)",
                    fontFamily: "monospace",
                  }}
                >
                  #{t.ticketId || String(t._id).slice(-8).toUpperCase()}
                </span>
              </div>
              <div
                style={{
                  marginTop: 6,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: "var(--fs-sm)",
                  color: "var(--egas-text-secondary)",
                }}
              >
                <Clock size={12} />
                Created {formatDate(t.createdAt, { withTime: true })}
              </div>
            </div>
            <StatusBadge status={t.status} />
          </div>

          {/* Thread */}
          <div
            ref={scrollRef}
            style={{
              display: "grid",
              gap: "var(--sp-3)",
              maxHeight: "45vh",
              overflowY: "auto",
              paddingRight: 4,
            }}
          >
            {/* Original description as first bubble (from user) */}
            <ThreadBubble
              isUser
              author="You"
              at={t.createdAt}
              message={t.description}
              attachments={t.images}
            />

            {responses.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  color: "var(--egas-text-secondary)",
                  fontSize: "var(--fs-sm)",
                  padding: "var(--sp-4) 0",
                }}
              >
                <MessageSquare
                  size={20}
                  style={{ opacity: 0.5, marginBottom: 4 }}
                />
                <div>
                  No replies yet. Our team usually responds within one business
                  day.
                </div>
              </div>
            )}

            {responses.map((r, i) => (
              <ThreadBubble
                key={i}
                isUser={!r.isAdminResponse}
                author={
                  r.isAdminResponse
                    ? "Support"
                    : r.user
                      ? `${r.user.firstName || ""} ${r.user.lastName || ""}`.trim() ||
                        "You"
                      : "You"
                }
                at={r.createdAt}
                message={r.message}
                attachments={r.attachments}
              />
            ))}
          </div>

          {/* Reply composer */}
          {canReply ? (
            <form
              onSubmit={submitReply}
              style={{
                display: "grid",
                gap: "var(--sp-3)",
                borderTop: "1px solid var(--egas-border)",
                paddingTop: "var(--sp-4)",
              }}
            >
              <div className="egas-field">
                <label htmlFor="egas-reply" className="egas-label">
                  Your reply
                </label>
                <textarea
                  id="egas-reply"
                  className="egas-textarea"
                  rows={3}
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Write a message to support…"
                />
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const picked = Array.from(e.target.files || []);
                  const next = [...attachments, ...picked].slice(0, MAX_IMAGES);
                  const tooBig = next.find((f) => f.size > 5 * 1024 * 1024);
                  if (tooBig) {
                    setReplyError(`${tooBig.name} is larger than 5MB.`);
                    return;
                  }
                  setAttachments(next);
                  if (fileRef.current) fileRef.current.value = "";
                }}
                style={{ display: "none" }}
                id="egas-reply-files"
              />

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <label
                  htmlFor="egas-reply-files"
                  className="egas-btn egas-btn--secondary egas-btn--sm"
                >
                  <ImageIcon size={14} /> Attach images
                </label>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  leftIcon={<Send size={14} />}
                  loading={sending}
                  disabled={sending}
                >
                  Send reply
                </Button>
              </div>

              {attachments.length > 0 && (
                <div className="egas-file-chips">
                  {attachments.map((f, i) => (
                    <span key={i} className="egas-file-chip">
                      {f.name}
                      <button
                        type="button"
                        aria-label={`Remove ${f.name}`}
                        onClick={() =>
                          setAttachments((fs) =>
                            fs.filter((_, idx) => idx !== i),
                          )
                        }
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {replyError && (
                <div className="egas-auth-error" role="alert">
                  <AlertCircle
                    size={16}
                    style={{ flexShrink: 0, marginTop: 2 }}
                  />
                  <span>{replyError}</span>
                </div>
              )}
            </form>
          ) : (
            <div className="egas-auth-success">
              <CheckCircle2
                size={16}
                style={{ marginRight: 6, verticalAlign: -2 }}
              />
              This ticket is {t.status}. Open a new ticket if you need further
              help.
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

/* ============================================================
   THREAD BUBBLE
   ============================================================ */
function ThreadBubble({ isUser, author, at, message, attachments }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
      }}
    >
      <div
        style={{
          maxWidth: "85%",
          padding: "var(--sp-3) var(--sp-4)",
          borderRadius: "var(--radius-lg)",
          background: isUser ? "var(--egas-primary-light)" : "var(--egas-bg)",
          color: "var(--egas-text)",
          border: `1px solid ${isUser ? "transparent" : "var(--egas-border)"}`,
          display: "grid",
          gap: 6,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: "var(--fs-xs)",
            color: "var(--egas-text-secondary)",
            fontWeight: 600,
          }}
        >
          <span>{author}</span>
          <span>·</span>
          <span style={{ fontWeight: 400 }}>
            {formatDate(at, { withTime: true })}
          </span>
        </div>
        {message && (
          <div
            style={{
              fontSize: "var(--fs-sm)",
              whiteSpace: "pre-wrap",
              lineHeight: 1.5,
            }}
          >
            {message}
          </div>
        )}
        {Array.isArray(attachments) && attachments.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
              gap: 6,
              marginTop: 4,
            }}
          >
            {attachments.map((a, i) => (
              <a
                key={i}
                href={a.secure_url || a.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "block",
                  borderRadius: 6,
                  overflow: "hidden",
                  border: "1px solid var(--egas-border)",
                }}
              >
                <img
                  src={a.secure_url || a.url}
                  alt={`Attachment ${i + 1}`}
                  style={{ width: "100%", height: 80, objectFit: "cover" }}
                />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
