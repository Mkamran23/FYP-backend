import { Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { reviewService } from "../services/reviewService";
const Stars = ({ value, onChange }) => (
  <div className="flex gap-1" aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => onChange?.(star)}
        disabled={!onChange}
        className={star <= value ? "text-amber-400" : "text-slate-300"}
      >
        <Star size={onChange ? 26 : 16} fill="currentColor" />
      </button>
    ))}
  </div>
);
export default function Ratings() {
  const { token } = useAuth();
  const [exchanges, setExchanges] = useState([]);
  const [selected, setSelected] = useState(null);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await reviewService.getPending(token);
      setExchanges(data.exchanges);
      setError("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [token]);
  useEffect(() => {
    load();
  }, [load]);
  const submit = async (event) => {
    event.preventDefault();
    try {
      await reviewService.create(
        { exchangeId: selected.exchangeId, rating, feedback },
        token,
      );
      setSelected(null);
      setFeedback("");
      await load();
    } catch (e) {
      setError(e.message);
    }
  };
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl p-4 sm:p-6">
        <p className="text-sm font-semibold text-blue-600">Community trust</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-800">
          Ratings & reviews
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Share feedback after a completed skill exchange.
        </p>
        {error && (
          <p
            role="alert"
            className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}
        {loading ? (
          <p className="mt-6 text-sm text-slate-500">
            Loading completed exchanges...
          </p>
        ) : !exchanges.length ? (
          <p className="mt-6 rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
            No completed exchanges are awaiting your review.
          </p>
        ) : (
          <div className="mt-6 space-y-3">
            {exchanges.map((exchange) => (
              <article
                key={exchange.exchangeId}
                className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div>
                  <h2 className="font-semibold text-slate-800">
                    How was your exchange with {exchange.otherUser.name}?
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Skill: {exchange.skill?.name || "Skill exchange"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(exchange)}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  Leave review
                </button>
              </article>
            ))}
          </div>
        )}
        {selected && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4">
            <form
              onSubmit={submit}
              className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
            >
              <h2 className="text-lg font-bold text-slate-800">
                Rate {selected.otherUser.name}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Your feedback is visible on their profile.
              </p>
              <div className="mt-5">
                <Stars value={rating} onChange={setRating} />
              </div>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                maxLength={500}
                rows={4}
                placeholder="What went well?"
                className="mt-5 w-full rounded-lg border border-slate-200 p-3 text-sm"
              />
              <p className="text-right text-xs text-slate-400">
                {feedback.length}/500
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="rounded-lg border px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                  Submit review
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
