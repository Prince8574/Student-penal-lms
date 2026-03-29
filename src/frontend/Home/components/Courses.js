import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseAPI, enrollmentAPI } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { Stars, BadgePill } from '../../Explore/components/UIElements';
import { T } from '../../Explore/utils/designTokens';

function Courses() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch available courses
        const coursesRes = await courseAPI.getAll({ limit: 4 });
        setCourses(coursesRes.data?.data || []);

        // Fetch enrolled courses only if logged in
        if (isAuthenticated) {
          const enrollRes = await enrollmentAPI.getMyEnrollments();
          setEnrollments(enrollRes.data?.data || []);
        }
      } catch (err) {
        console.error('Courses fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated]);

  // Build a map of courseId -> enrollment for quick lookup
  const enrollmentMap = {};
  enrollments.forEach(e => {
    if (e.course?._id) enrollmentMap[e.course._id] = e;
  });

  // My enrolled courses section
  const myCourses = enrollments.slice(0, 4);

  return (
    <section className="courses-section" id="courses">
      <div className="courses-inner">

        {/* My Enrolled Courses — only show if logged in and has enrollments */}
        {isAuthenticated && myCourses.length > 0 && (
          <>
            <div className="courses-head" style={{ marginBottom: 20 }}>
              <div>
                <p className="sec-eyebrow">My Learning</p>
                <h2 className="sec-h2">Continue <em>where you left off</em></h2>
              </div>
              <a href="#" className="see-all" onClick={(e) => { e.preventDefault(); navigate('/my-courses'); }}>
                View all my courses →
              </a>
            </div>

            <div className="courses-grid" style={{ marginBottom: 32 }}>
              {myCourses.map((enrollment, i) => (
                <EnrolledCourseCard
                  key={enrollment.enrollmentId || i}
                  enrollment={enrollment}
                  onClick={() => navigate(`/learn/${enrollment.course?._id}`)}
                />
              ))}
            </div>
          </>
        )}

        {/* Explore Courses */}
        <div className="courses-head">
          <div>
            <p className="sec-eyebrow" id="c-eye">🔥 Trending</p>
            <h2 className="sec-h2" id="c-h2">Top courses <em>this week</em></h2>
          </div>
          <a href="#" className="see-all" onClick={(e) => { e.preventDefault(); navigate('/explore'); }}>
            View all courses →
          </a>
        </div>

        {/* Horizontal scroll strip */}
        <div style={{
          display: 'flex', gap: 18, overflowX: 'auto', paddingBottom: 12,
          scrollbarWidth: 'none', msOverflowStyle: 'none',
        }}>
          {loading ? (
            [1,2,3,4].map(i => (
              <div key={i} style={{
                minWidth: 240, height: 300, borderRadius: 16,
                background: 'rgba(255,255,255,.04)', flexShrink: 0,
                animation: 'pulse 1.5s ease-in-out infinite',
              }} />
            ))
          ) : courses.length === 0 ? (
            <div style={{ color: 'rgba(255,255,255,.4)', fontSize: '.9rem', padding: '40px 0' }}>
              No courses available yet.
            </div>
          ) : (
            courses.map((course, i) => (
              <TopCourseCard
                key={course._id || i}
                course={course}
                rank={i + 1}
                isEnrolled={!!enrollmentMap[course._id]}
                onClick={() => navigate(`/course/${course._id}`)}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

// Progress Ring
function ProgressRing({ pct, size, stroke, color }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: 'stroke-dasharray .6s ease' }} />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
        style={{ fill: T.t0, fontSize: size * 0.24, fontWeight: 800,
          transform: 'rotate(90deg)', transformOrigin: 'center' }}>
        {pct}%
      </text>
    </svg>
  );
}

// Card for enrolled courses — same as MyCourses page
function EnrolledCourseCard({ enrollment, onClick }) {
  const [vis, setVis] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); obs.disconnect(); }
    }, { threshold: 0.07 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const raw = enrollment.course || {};
  const pct = Math.round(enrollment.progress || 0);
  const accentMap = {
    'Web Dev': '#4F6EF7', 'AI / ML': '#A855F7', 'Cloud': '#38BDF8',
    'Design': '#F472B6', 'DSA': '#34D399', 'Data Science': '#FBBF24',
    'Development': '#4F6EF7', 'Mobile Dev': '#60A5FA', 'DevOps': '#0EB5AA',
  };
  const accent = accentMap[raw.category] || '#4F6EF7';
  const title = raw.title || 'Untitled Course';
  const instructor = typeof raw.instructor === 'object' ? raw.instructor?.name || 'Instructor' : raw.instructor || 'Instructor';
  const category = raw.category || 'Course';
  const level = raw.level || 'Beginner';
  const duration = raw.duration || '—';
  const rating = raw.rating || 0;
  const thumbnail = raw.thumbnail || '';
  const icon = raw.emoji || '📘';
  const badge = raw.badge || 'Enrolled';
  const bg = raw.bg || `linear-gradient(135deg,${accent}18,${accent}06)`;
  const courseId = raw._id || enrollment.courseId;
  const tags = Array.isArray(raw.tags) ? raw.tags.map(t => typeof t === 'object' ? t.name || '' : String(t)) : [];

  return (
    <div ref={ref} className="course-card"
      onClick={() => navigate(`/learn/${courseId}`)}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? 'translateY(0)' : 'translateY(22px)',
        transition: 'opacity .55s, transform .55s cubic-bezier(.4,0,.2,1)',
      }}>
      {/* Thumbnail */}
      <div style={{ height: 155, background: bg, position: 'relative', overflow: 'hidden' }}>
        {thumbnail ? (
          <img src={thumbnail} alt={title}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
        ) : (
          <>
            <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 65% 80% at 30% 40%,${accent}28,transparent)` }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-55%)', width: 58, height: 58, borderRadius: 15, background: `linear-gradient(135deg,${accent}1a,${accent}36)`, border: `1.5px solid ${accent}44`, display: 'grid', placeItems: 'center', backdropFilter: 'blur(8px)', zIndex: 2 }}>
              <span style={{ fontSize: '1.7rem' }}>{icon}</span>
            </div>
          </>
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,transparent 35%,rgba(0,0,0,.7))', zIndex: 1 }} />
        <div style={{ position: 'absolute', top: 11, left: 11, zIndex: 3, display: 'flex', gap: 6 }}>
          <BadgePill text={badge} />
        </div>
        <div style={{ position: 'absolute', top: 11, right: 11, zIndex: 3, padding: '3px 8px', borderRadius: 6, background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(6px)', fontSize: '.63rem', fontWeight: 700, color: T.text2, border: '1px solid rgba(255,255,255,.08)' }}>
          {level}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '15px 16px 17px', display: 'flex', flexDirection: 'column', gap: 9, position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '.62rem', fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: accent }}>{category}</span>
          <span style={{ fontSize: '.68rem', color: T.text3 }}>{duration}</span>
        </div>
        <div style={{ fontSize: '.93rem', fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{title}</div>
        <div style={{ fontSize: '.76rem', color: T.text2 }}>{instructor}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontSize: '.8rem', fontWeight: 800, color: T.gold }}>{rating}</span>
          <Stars r={rating} />
        </div>
        {tags.length > 0 && (
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {tags.slice(0, 3).map(t => <span key={t} className="tag">{t}</span>)}
          </div>
        )}
        <div style={{ height: 1, background: T.bord, margin: '2px 0' }} />

        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ProgressRing pct={pct} size={46} stroke={4} color={pct === 100 ? T.green : accent} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '.75rem', color: T.t1, fontWeight: 600, marginBottom: 6 }}>
              {pct === 100 ? 'Course completed!' : pct > 0 ? 'Keep going!' : 'Start learning'}
            </div>
            <div style={{ height: 4, background: 'rgba(255,255,255,.07)', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? `linear-gradient(90deg,${T.green},${T.teal})` : `linear-gradient(90deg,${accent},${accent}88)`, borderRadius: 10, transition: 'width .6s ease' }} />
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={e => { e.stopPropagation(); navigate(`/learn/${courseId}`); }}
          style={{ width: '100%', padding: '12px 0', borderRadius: 50, border: 'none', cursor: 'pointer', background: pct === 100 ? 'linear-gradient(135deg,#22C55E,#0EB5AA)' : 'linear-gradient(135deg,#0EB5AA,#38BDF8)', color: '#030810', fontSize: '.84rem', fontWeight: 800, transition: 'transform .18s' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
        >
          {pct === 100 ? '🏅 View Certificate' : pct > 0 ? '▶ Continue Course' : '▶ Start Course'}
        </button>
      </div>
    </div>
  );
}

// Top Course Card — horizontal scroll style with rank badge
function TopCourseCard({ course, rank, isEnrolled, onClick }) {
  const ACCENTS = ['#f0a500','#7c2fff','#00d4aa','#f02079','#3b9eff','#ff6b35'];
  const accent = ACCENTS[(course.title?.charCodeAt(0) || 0) % ACCENTS.length];
  const GRADS = [
    'linear-gradient(135deg,#1a0d30 0%,#2d1b4a 100%)',
    'linear-gradient(135deg,#0a1830 0%,#162a46 100%)',
    'linear-gradient(135deg,#0a1a10 0%,#0f2e18 100%)',
    'linear-gradient(135deg,#1a0a0a 0%,#2e0f18 100%)',
    'linear-gradient(135deg,#0a0a2a 0%,#1a1050 100%)',
  ];
  const bg = GRADS[(course.title?.charCodeAt(0) || 0) % GRADS.length];
  const disc = course.originalPrice > course.price
    ? Math.round((1 - course.price / course.originalPrice) * 100) : 0;

  return (
    <div
      onClick={onClick}
      style={{
        minWidth: 230, maxWidth: 230, borderRadius: 18, overflow: 'hidden',
        background: 'linear-gradient(180deg,#0f0f1e 0%,#0a0a18 100%)',
        border: '1px solid rgba(255,255,255,.09)',
        cursor: 'pointer', flexShrink: 0,
        transition: 'transform .25s cubic-bezier(.4,0,.2,1), box-shadow .25s, border-color .25s',
        boxShadow: '0 2px 16px rgba(0,0,0,.4)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px) scale(1.01)';
        e.currentTarget.style.boxShadow = `0 20px 48px rgba(0,0,0,.55), 0 0 0 1px ${accent}44`;
        e.currentTarget.style.borderColor = `${accent}55`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,.4)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,.09)';
      }}
    >
      {/* Thumbnail */}
      <div style={{
        height: 140, background: bg, position: 'relative',
        overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {course.thumbnail ? (
          <img
            src={`http://localhost:5000/uploads/${course.thumbnail.split('/').pop()}`}
            alt={course.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { e.target.style.display = 'none'; }}
          />
        ) : (
          <>
            <div style={{
              position: 'absolute', width: 100, height: 100, borderRadius: '50%',
              background: `radial-gradient(circle, ${accent}35, transparent 70%)`,
              top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            }} />
            <span style={{ fontSize: '2.8rem', position: 'relative', zIndex: 1 }}>
              {course.emoji || '📚'}
            </span>
          </>
        )}

        {/* Dark gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(10,10,24,.92) 0%, rgba(10,10,24,.1) 55%, transparent 100%)',
        }} />

        {/* Rank */}
        <div style={{
          position: 'absolute', top: 10, left: 10,
          padding: '3px 9px', borderRadius: 99,
          background: rank <= 3 ? 'linear-gradient(135deg,#f0a500,#ff7c1f)' : 'rgba(0,0,0,.6)',
          backdropFilter: 'blur(6px)',
          fontSize: '.62rem', fontWeight: 800, color: '#fff',
          border: rank <= 3 ? 'none' : '1px solid rgba(255,255,255,.18)',
          boxShadow: rank <= 3 ? '0 2px 8px rgba(240,165,0,.45)' : 'none',
          letterSpacing: '.03em',
        }}>
          {rank === 1 ? '🥇 #1' : rank === 2 ? '🥈 #2' : rank === 3 ? '🥉 #3' : `#${rank}`}
        </div>

        {/* Discount badge */}
        {disc > 0 && (
          <div style={{
            position: 'absolute', top: 10, right: 10,
            padding: '3px 8px', borderRadius: 99,
            background: 'rgba(240,32,121,.85)',
            fontSize: '.6rem', fontWeight: 800, color: '#fff',
            letterSpacing: '.03em',
          }}>{disc}% OFF</div>
        )}

        {/* Category + Level — bottom */}
        <div style={{
          position: 'absolute', bottom: 10, left: 10, right: 10,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{
            padding: '2px 8px', borderRadius: 99,
            background: `${accent}28`, border: `1px solid ${accent}50`,
            fontSize: '.56rem', fontWeight: 700, color: accent,
            backdropFilter: 'blur(4px)',
          }}>
            {typeof course.category === 'string' ? course.category : course.category?.name || 'Course'}
          </span>
          {course.level && (
            <span style={{
              padding: '2px 8px', borderRadius: 99,
              background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.15)',
              fontSize: '.56rem', fontWeight: 600, color: 'rgba(255,255,255,.7)',
              backdropFilter: 'blur(4px)',
            }}>{course.level}</span>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '13px 14px 15px' }}>
        {/* Title */}
        <div style={{
          fontSize: '.88rem', fontWeight: 700, color: '#f0f2f8',
          lineHeight: 1.35, marginBottom: 9,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
          minHeight: '2.4rem',
        }}>{course.title}</div>

        {/* Instructor */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 11 }}>
          <div style={{
            width: 20, height: 20, borderRadius: '50%',
            background: `linear-gradient(135deg,${accent}55,${accent}22)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '.6rem', flexShrink: 0, border: `1px solid ${accent}44`,
          }}>👤</div>
          <span style={{
            fontSize: '.73rem', color: '#8899b8',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {typeof course.instructor === 'object'
              ? course.instructor?.name || 'Admin'
              : course.instructor || 'Admin'}
          </span>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,.07)', marginBottom: 11 }} />

        {/* Rating + Price row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ color: '#f0a500', fontSize: '.82rem', lineHeight: 1 }}>★</span>
            <span style={{ fontSize: '.78rem', fontWeight: 700, color: '#f0f2f8' }}>
              {course.rating || '4.5'}
            </span>
            <span style={{ fontSize: '.68rem', color: '#4d6080' }}>
              ({course.enrolledStudents || 0})
            </span>
          </div>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
            {course.originalPrice > course.price && (
              <span style={{ fontSize: '.68rem', color: '#4d6080', textDecoration: 'line-through' }}>
                ₹{course.originalPrice?.toLocaleString()}
              </span>
            )}
            <span style={{
              fontSize: '.88rem', fontWeight: 800,
              color: course.price === 0 ? '#00d4aa' : accent,
            }}>
              {course.price === 0 ? 'Free' : `₹${course.price?.toLocaleString()}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Courses;
