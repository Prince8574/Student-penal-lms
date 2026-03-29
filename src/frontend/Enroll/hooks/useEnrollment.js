import { useState, useCallback, useEffect } from "react";
import { paymentAPI, enrollmentAPI } from "../../../services/api";
import { useNavigate } from "react-router-dom";

export function useEnrollment() {
  const navigate = useNavigate();
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);
  const [success, setSuccess]           = useState(false);
  const [enrolledIds, setEnrolledIds]   = useState(new Set());

  // Load real enrolled course IDs from DB on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    enrollmentAPI.getMyEnrollments()
      .then(res => {
        const ids = new Set(
          (res.data?.data || []).map(e => String(e.course?._id || e.courseId))
        );
        setEnrolledIds(ids);
      })
      .catch(() => {});
  }, []);

  const isEnrolled = useCallback((courseId) => {
    return enrolledIds.has(String(courseId));
  }, [enrolledIds]);

  const enroll = useCallback(async (courseId, paymentData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await paymentAPI.checkout(courseId, {
        paymentMethod: paymentData?.paymentMethod || 'Free',
        transactionId: paymentData?.transactionId,
        amount:        paymentData?.amount,
        gst:           paymentData?.gst,
      });

      // Update local enrolled set
      setEnrolledIds(prev => new Set([...prev, String(courseId)]));
      setSuccess(true);
      return { ok: true };
    } catch (err) {
      if (err?.response?.data?.message === 'Already enrolled in this course') {
        setEnrolledIds(prev => new Set([...prev, String(courseId)]));
        return { ok: true };
      }
      const msg = err?.response?.data?.message || "Enrollment failed. Please try again.";
      setError(msg);
      return { ok: false, msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const goToLearn = useCallback((courseId) => {
    navigate(`/learn/${courseId}`);
  }, [navigate]);

  return { enroll, isEnrolled, goToLearn, loading, error, success, setError };
}
